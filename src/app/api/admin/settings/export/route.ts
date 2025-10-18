import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { UserRole } from '@prisma/client';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

// PR13 Phase 1: Export settings as JSON for backup/migration
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin permissions
    if (session.user?.role !== UserRole.ADMIN && session.user?.role !== UserRole.VILLAGE_COUNCIL) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Fetch all settings from database
    const settings = await prisma.appSettings.findMany({
      select: {
        category: true,
        key: true,
        value: true,
        isPublic: true,
        updatedAt: true,
      },
      orderBy: [
        { category: 'asc' },
        { key: 'asc' },
      ],
    });

    // Format as JSON export
    const exportData = {
      exportedAt: new Date().toISOString(),
      exportedBy: session.user.email,
      version: '1.0',
      settingsCount: settings.length,
      settings: settings,
    };

    // Return as downloadable JSON
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="settings-export-${Date.now()}.json"`,
      },
    });
  } catch (error) {
    console.error('Failed to export settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
