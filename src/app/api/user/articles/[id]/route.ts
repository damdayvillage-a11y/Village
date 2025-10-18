import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

// GET single article
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const article = await prisma.article.findFirst({
      where: {
        id: params.id,
        authorId: session.user.id
      }
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Failed to fetch article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// UPDATE article
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, status, excerpt, tags } = await request.json();

    // Verify article belongs to user
    const existingArticle = await prisma.article.findFirst({
      where: {
        id: params.id,
        authorId: session.user.id
      }
    });

    if (!existingArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Update article
    const updateData: any = {
      updatedAt: new Date()
    };

    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (tags !== undefined) updateData.tags = tags;
    
    if (status !== undefined) {
      // Normalize status to uppercase for consistency
      const normalizedStatus = typeof status === 'string' ? status.toUpperCase() : status;
      updateData.status = normalizedStatus;
      // Set publishedAt when publishing for the first time
      if (normalizedStatus === 'PUBLISHED' && !existingArticle.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const updatedArticle = await prisma.article.update({
      where: { id: params.id },
      data: updateData
    });

    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error('Failed to update article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE article
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify article belongs to user
    const existingArticle = await prisma.article.findFirst({
      where: {
        id: params.id,
        authorId: session.user.id
      }
    });

    if (!existingArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Delete article
    await prisma.article.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Failed to delete article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
