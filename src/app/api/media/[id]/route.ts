import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { UserRole } from '@prisma/client';
import prisma from '@/lib/db/prisma';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const media = await prisma.media.findUnique({
      where: { id: params.id },
    });

    if (!media) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Delete file from disk
    if (media.filename) {
      const filepath = join(process.cwd(), 'public', 'uploads', media.filename);
      if (existsSync(filepath)) {
        await unlink(filepath);
      }
    }

    // Delete database record
    await prisma.media.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
