import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { UserRole } from '@prisma/client';
import prisma from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');
    const type = searchParams.get('type');

    const where: any = {};
    if (folder && folder !== 'all') {
      if (folder === 'uncategorized') {
        where.folder = null;
      } else {
        where.folder = folder;
      }
    }
    if (type && type !== 'all') {
      where.type = type;
    }

    const files = await prisma.media.findMany({
      where,
      orderBy: { uploadedAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Media fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}
