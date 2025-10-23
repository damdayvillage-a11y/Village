import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { logActivity } from '@/lib/activity-logger';

/**
 * GET /api/admin/village-leaders/[id]
 * Get a specific village leader
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const leader = await prisma.villageLeader.findUnique({
      where: { id: params.id },
    });

    if (!leader) {
      return NextResponse.json(
        { error: 'Leader not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: leader,
    });
  } catch (error) {
    console.error('Error fetching village leader:', error);
    return NextResponse.json(
      { error: 'Failed to fetch village leader' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/village-leaders/[id]
 * Update a specific village leader
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    try {
      const leader = await prisma.villageLeader.update({
        where: { id: params.id },
        data: {
          ...(name && { name }),
          ...(position && { position }),
          ...(photo && { photo }),
          ...(message !== undefined && { message }),
          ...(priority !== undefined && { priority }),
          ...(isActive !== undefined && { isActive }),
        },
      });

      // Log activity
      if (session.user?.id) {
        await logActivity({
          userId: session.user.id,
          action: 'UPDATE',
          entity: 'VillageLeader',
          entityId: leader.id,
          description: `Updated village leader: ${leader.name}`,
          metadata: { leaderId: leader.id, updates: Object.keys(body) },
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
        });
      }

      return NextResponse.json({
        success: true,
        data: leader,
        message: 'Village leader updated successfully',
      });
    } catch (dbError) {
      console.log('Database error:', dbError);
      return NextResponse.json({
        success: false,
        error: 'Failed to update leader',
      }, { status: 503 });
    }
  } catch (error) {
    console.error('Error updating village leader:', error);
    return NextResponse.json(
      { error: 'Failed to update village leader' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/village-leaders/[id]
 * Delete a specific village leader
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    try {
      const leader = await prisma.villageLeader.delete({
        where: { id: params.id },
      });

      // Log activity
      if (session.user?.id) {
        await logActivity({
          userId: session.user.id,
          action: 'DELETE',
          entity: 'VillageLeader',
          entityId: params.id,
          description: `Deleted village leader: ${leader.name}`,
          metadata: { leaderId: params.id, name: leader.name },
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Village leader deleted successfully',
      });
    } catch (dbError) {
      console.log('Database error:', dbError);
      return NextResponse.json({
        success: false,
        error: 'Failed to delete leader',
      }, { status: 503 });
    }
  } catch (error) {
    console.error('Error deleting village leader:', error);
    return NextResponse.json(
      { error: 'Failed to delete village leader' },
      { status: 500 }
    );
  }
}
