import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/cms/blocks - Get blocks for a page
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'VILLAGE_COUNCIL')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const pageId = searchParams.get('pageId');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    if (!pageId) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    const where: any = { pageId };
    if (!includeInactive) {
      where.active = true;
    }

    const blocks = await prisma.block.findMany({
      where,
      orderBy: { position: 'asc' },
    });

    return NextResponse.json({ blocks });
  } catch (error) {
    console.error('Error fetching blocks:', error);
    return NextResponse.json({ error: 'Failed to fetch blocks' }, { status: 500 });
  }
}

// POST /api/admin/cms/blocks - Create new block
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'VILLAGE_COUNCIL')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { pageId, type, content, position, active } = body;

    if (!pageId || !type || !content) {
      return NextResponse.json(
        { error: 'Page ID, type, and content are required' },
        { status: 400 }
      );
    }

    // If position not specified, add to end
    let blockPosition = position;
    if (blockPosition === undefined) {
      const lastBlock = await prisma.block.findFirst({
        where: { pageId },
        orderBy: { position: 'desc' },
      });
      blockPosition = lastBlock ? lastBlock.position + 1 : 0;
    }

    const block = await prisma.block.create({
      data: {
        pageId,
        type,
        content,
        position: blockPosition,
        active: active !== undefined ? active : true,
      },
    });

    return NextResponse.json(block, { status: 201 });
  } catch (error) {
    console.error('Error creating block:', error);
    return NextResponse.json({ error: 'Failed to create block' }, { status: 500 });
  }
}

// PATCH /api/admin/cms/blocks - Update block or reorder blocks
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'VILLAGE_COUNCIL')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, reorder, ...updates } = body;

    // Handle reordering multiple blocks
    if (reorder && Array.isArray(reorder)) {
      const updatePromises = reorder.map((item: { id: string; position: number }) =>
        prisma.block.update({
          where: { id: item.id },
          data: { position: item.position },
        })
      );

      const blocks = await Promise.all(updatePromises);
      return NextResponse.json({ blocks });
    }

    // Handle single block update
    if (!id) {
      return NextResponse.json({ error: 'Block ID is required' }, { status: 400 });
    }

    const block = await prisma.block.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(block);
  } catch (error) {
    console.error('Error updating block:', error);
    return NextResponse.json({ error: 'Failed to update block' }, { status: 500 });
  }
}

// DELETE /api/admin/cms/blocks - Delete block
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Block ID is required' }, { status: 400 });
    }

    // Get block to know its position and pageId
    const block = await prisma.block.findUnique({
      where: { id },
    });

    if (!block) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    }

    // Delete block
    await prisma.block.delete({
      where: { id },
    });

    // Reorder remaining blocks
    await prisma.$executeRaw`
      UPDATE blocks
      SET position = position - 1
      WHERE page_id = ${block.pageId}
      AND position > ${block.position}
    `;

    return NextResponse.json({ message: 'Block deleted successfully' });
  } catch (error) {
    console.error('Error deleting block:', error);
    return NextResponse.json({ error: 'Failed to delete block' }, { status: 500 });
  }
}
