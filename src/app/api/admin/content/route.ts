import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db';

// Force dynamic rendering - this route uses request parameters
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


/**
 * GET /api/admin/content
 * Fetch content blocks for a specific page
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get page parameter from query string
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');

    if (!page) {
      return NextResponse.json(
        { error: 'Page parameter is required' },
        { status: 400 }
      );
    }

    // Fetch content blocks for the page
    const blocks = await prisma.contentBlock.findMany({
      where: {
        page,
        active: true,
      },
      orderBy: {
        position: 'asc',
      },
    });

    return NextResponse.json({ blocks });
  } catch (error) {
    console.error('Error fetching content blocks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content blocks' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/content
 * Create a new content block
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { page, type, position, content } = body;

    // Validate required fields
    if (!page || !type || position === undefined || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: page, type, position, content' },
        { status: 400 }
      );
    }

    // Create content block
    const block = await prisma.contentBlock.create({
      data: {
        page,
        type,
        position,
        content,
      },
    });

    return NextResponse.json({ block }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating content block:', error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A block already exists at this position on this page' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create content block' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/content
 * Update content blocks (bulk update)
 */
export async function PUT(request: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { blocks } = body;

    if (!Array.isArray(blocks)) {
      return NextResponse.json(
        { error: 'Invalid request: blocks must be an array' },
        { status: 400 }
      );
    }

    // Update blocks in transaction
    const updatedBlocks = await prisma.$transaction(
      blocks.map((block: any) =>
        prisma.contentBlock.upsert({
          where: { id: block.id || 'new' },
          update: {
            type: block.type,
            position: block.position,
            content: block.content,
            active: block.active !== undefined ? block.active : true,
          },
          create: {
            page: block.page,
            type: block.type,
            position: block.position,
            content: block.content,
            active: block.active !== undefined ? block.active : true,
          },
        })
      )
    );

    return NextResponse.json({ blocks: updatedBlocks });
  } catch (error) {
    console.error('Error updating content blocks:', error);
    return NextResponse.json(
      { error: 'Failed to update content blocks' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/content
 * Delete a content block
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Get block ID from query string
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Block ID is required' },
        { status: 400 }
      );
    }

    // Delete content block (soft delete by setting active to false)
    await prisma.contentBlock.update({
      where: { id },
      data: { active: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting content block:', error);
    return NextResponse.json(
      { error: 'Failed to delete content block' },
      { status: 500 }
    );
  }
}
