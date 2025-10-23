import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { logActivity } from '@/lib/activity-logger';

/**
 * GET /api/admin/village-leaders
 * Get all village leaders
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    try {
      const leaders = await prisma.villageLeader.findMany({
        orderBy: { priority: 'asc' },
      });

      return NextResponse.json({
        success: true,
        data: leaders,
      });
    } catch (dbError) {
      console.log('Database not available, returning empty array');
      return NextResponse.json({
        success: true,
        data: [],
      });
    }
  } catch (error) {
    console.error('Error fetching village leaders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch village leaders' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/village-leaders
 * Create a new village leader
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, position, photo, message, priority, isActive } = body;

    if (!name || !position || !photo) {
      return NextResponse.json(
        { error: 'Name, position, and photo are required' },
        { status: 400 }
      );
    }

    try {
      const leader = await prisma.villageLeader.create({
        data: {
          name,
          position,
          photo,
          message: message || null,
          priority: priority || 0,
          isActive: isActive !== undefined ? isActive : true,
        },
      });

      // Log activity
      if (session.user?.id) {
        await logActivity({
          userId: session.user.id,
          action: 'CREATE',
          entity: 'VillageLeader',
          entityId: leader.id,
          description: `Created village leader: ${name}`,
          metadata: { leaderId: leader.id, name, position },
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
        });
      }

      return NextResponse.json({
        success: true,
        data: leader,
        message: 'Village leader created successfully',
      });
    } catch (dbError) {
      console.log('Database error:', dbError);
      return NextResponse.json({
        success: false,
        error: 'Database not configured. Leader cannot be saved.',
        message: 'Please configure the database to save village leaders.',
      }, { status: 503 });
    }
  } catch (error) {
    console.error('Error creating village leader:', error);
    return NextResponse.json(
      { error: 'Failed to create village leader' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/village-leaders
 * Update multiple leaders (bulk update priorities)
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { leaders } = body;

    if (!Array.isArray(leaders)) {
      return NextResponse.json(
        { error: 'Leaders array is required' },
        { status: 400 }
      );
    }

    try {
      // Update priorities for all leaders
      const updates = leaders.map((leader: any) =>
        prisma.villageLeader.update({
          where: { id: leader.id },
          data: { priority: leader.priority },
        })
      );

      await Promise.all(updates);

      // Log activity
      if (session.user?.id) {
        await logActivity({
          userId: session.user.id,
          action: 'UPDATE',
          entity: 'VillageLeader',
          entityId: 'bulk',
          description: `Reordered ${leaders.length} village leaders`,
          metadata: { count: leaders.length },
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Leaders reordered successfully',
      });
    } catch (dbError) {
      console.log('Database error:', dbError);
      return NextResponse.json({
        success: false,
        error: 'Failed to update leaders',
      }, { status: 503 });
    }
  } catch (error) {
    console.error('Error updating village leaders:', error);
    return NextResponse.json(
      { error: 'Failed to update village leaders' },
      { status: 500 }
    );
  }
}
