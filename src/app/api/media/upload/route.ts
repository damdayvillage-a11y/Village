import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { UserRole } from '@prisma/client';
import prisma from '@/lib/db/prisma';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import {
  isAllowedFileType,
  isAllowedFileSize,
  getFileCategory,
  generateUniqueFilename,
} from '@/lib/storage-config';
import {
  processImage,
  isValidImage,
  getImageDimensions,
  calculateChecksum,
} from '@/lib/image-processor';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureUploadDir();

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const folder = (formData.get('folder') as string) || null;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadedFiles = [];
    const errors = [];

    for (const file of files) {
      try {
        // Validate file type
        if (!isAllowedFileType(file.type)) {
          errors.push(`${file.name}: File type not allowed`);
          continue;
        }

        // Validate file size
        if (!isAllowedFileSize(file.size)) {
          errors.push(`${file.name}: File too large`);
          continue;
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const filename = generateUniqueFilename(file.name);
        const fileCategory = getFileCategory(file.type);

        let width: number | undefined;
        let height: number | undefined;
        let thumbnailUrl: string | undefined;
        let finalUrl = `/uploads/${filename}`;

        // Process images
        if (fileCategory === 'image' && (await isValidImage(buffer))) {
          const processed = await processImage({
            buffer,
            filename,
            uploadDir: UPLOAD_DIR,
            generateThumbnail: true,
          });

          width = processed.width;
          height = processed.height;
          
          // Update URLs to use optimized versions
          const optimizedFilename = filename.replace(/\.[^.]+$/, '.webp');
          finalUrl = `/uploads/${optimizedFilename}`;
          thumbnailUrl = `/uploads/thumb_${optimizedFilename}`;
        } else {
          // For non-images, just save the file
          const { writeFile } = await import('fs/promises');
          await writeFile(join(UPLOAD_DIR, filename), buffer);
        }

        // Calculate checksum
        const checksum = await calculateChecksum(buffer);

        // Create database record
        const mediaRecord = await prisma.media.create({
          data: {
            filename: filename.replace(/\.[^.]+$/, '.webp'), // Store webp filename
            originalName: file.name,
            mimeType: file.type,
            size: file.size,
            width,
            height,
            url: finalUrl,
            thumbnailUrl,
            storageProvider: 'local',
            folder,
            tags: [],
            checksum,
            uploadedBy: session?.user?.id || undefined,
          },
        });

        uploadedFiles.push(mediaRecord);
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        errors.push(`${file.name}: Processing failed`);
      }
    }

    return NextResponse.json({
      success: uploadedFiles.length > 0,
      files: uploadedFiles,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 });
  }
}
