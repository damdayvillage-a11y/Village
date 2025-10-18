import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { UserRole } from '@prisma/client';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

// PR13 Phase 1: Reset settings to defaults
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin permissions
    if (session.user?.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Forbidden - Admin-only operation' }, { status: 403 });
    }

    const body = await request.json();
    const { category } = body;

    if (category) {
      // Reset specific category
      await prisma.appSettings.deleteMany({
        where: { category },
      });
      return NextResponse.json({ 
        success: true, 
        message: `${category} settings reset to defaults` 
      });
    } else {
      // Reset ALL settings (dangerous operation)
      await prisma.appSettings.deleteMany({});
      return NextResponse.json({ 
        success: true, 
        message: 'All settings reset to defaults' 
      });
    }
  } catch (error) {
    console.error('Failed to reset settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
