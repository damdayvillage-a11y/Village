import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db';
import { UserRole } from '@prisma/client';
import { logActivity, ActivityAction, ActivityEntity } from '@/lib/activity-logger';

export const dynamic = 'force-dynamic';

// Export users to CSV
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user?.role !== UserRole.ADMIN && session.user?.role !== UserRole.VILLAGE_COUNCIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const active = searchParams.get('active');

    // Build where clause
    const where: any = {};
    if (role) {
      where.role = role as UserRole;
    }
    if (active !== null && active !== undefined) {
      where.active = active === 'true';
    }

    // Fetch users
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        active: true,
        verified: true,
        createdAt: true,
        lastLogin: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Convert to CSV
    const csvHeader = 'ID,Email,Name,Role,Phone,Active,Verified,Created At,Last Login\n';
    const csvRows = users.map(user => 
      `"${user.id}","${user.email}","${user.name}","${user.role}","${user.phone || ''}","${user.active}","${user.verified}","${user.createdAt.toISOString()}","${user.lastLogin?.toISOString() || ''}"`
    ).join('\n');
    
    const csv = csvHeader + csvRows;

    // Log activity
    if (session.user?.id) {
      await logActivity({
        userId: session.user.id,
        action: ActivityAction.EXPORT,
        entity: ActivityEntity.USER,
        description: `Exported ${users.length} users to CSV`,
        metadata: { count: users.length, filters: { role, active } },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      });
    }

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="users-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Failed to export users:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
