import { NextRequest, NextResponse } from 'next/server';
import {
  generateImageVariants,
  validateImage,
  generateImageHash,
  getImageMetadata,
} from '@/lib/image-optimizer';
import { logActivity } from '@/lib/activity-logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/media/upload
 * Upload and optimize images with automatic variant generation
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const results = [];
    const errors = [];

    for (const file of files) {
      try {
        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Validate image
        const validation = await validateImage(buffer, {
          maxSizeMB: 10,
          maxWidth: 5000,
          maxHeight: 5000,
        });

        if (!validation.valid) {
          errors.push({
            filename: file.name,
            error: validation.error,
          });
          continue;
        }

        // Get metadata
        const metadata = await getImageMetadata(buffer);

        // Generate hash for deduplication
        const hash = generateImageHash(buffer);

        // Generate optimized variants
        const variants = await generateImageVariants(buffer, {
          format: 'webp',
          includeOriginal: false,
        });

        // In production, you would:
        // 1. Save variants to cloud storage (S3, Cloudinary, etc.)
        // 2. Save metadata to database
        // 3. Return CDN URLs

        // For now, return mock URLs (TODO: implement actual storage)
        const baseUrl = `/uploads/${hash}`;

        const result = {
          filename: file.name,
          hash,
          originalMetadata: {
            format: metadata.format,
            width: metadata.width,
            height: metadata.height,
            size: buffer.length,
          },
          variants: {
            thumbnail: {
              url: `${baseUrl}/thumbnail.webp`,
              width: variants.thumbnail.info.width,
              height: variants.thumbnail.info.height,
              size: variants.thumbnail.info.size,
            },
            medium: {
              url: `${baseUrl}/medium.webp`,
              width: variants.medium.info.width,
              height: variants.medium.info.height,
              size: variants.medium.info.size,
            },
            large: {
              url: `${baseUrl}/large.webp`,
              width: variants.large.info.width,
              height: variants.large.info.height,
              size: variants.large.info.size,
            },
          },
        };

        results.push(result);

        // Log activity (non-blocking)
        try {
          await logActivity({
            userId: 'system', // TODO: Get actual user ID from session
            action: 'CREATE',
            entity: 'Media',
            entityId: hash,
            description: `Uploaded and optimized image: ${file.name}`,
            metadata: {
              filename: file.name,
              originalSize: buffer.length,
              optimizedSizes: {
                thumbnail: variants.thumbnail.info.size,
                medium: variants.medium.info.size,
                large: variants.large.info.size,
              },
            },
          });
        } catch (logError) {
          console.error('Failed to log media upload activity:', logError);
          // Don't fail the upload if logging fails
        }
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        errors.push({
          filename: file.name,
          error: error instanceof Error ? error.message : 'Processing failed',
        });
      }
    }

    return NextResponse.json({
      success: results.length > 0,
      uploaded: results.length,
      failed: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
