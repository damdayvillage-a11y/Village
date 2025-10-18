import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's articles from database
    const articles = await prisma.article.findMany({
      where: {
        authorId: session.user.id
      },
      select: {
        id: true,
        title: true,
        status: true,
        publishedAt: true,
        views: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Failed to fetch user articles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, status = 'DRAFT', excerpt, tags } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + 
      '-' + Date.now();

    // Create article in database
    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        excerpt,
        slug,
        status,
        authorId: session.user.id,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        tags: tags || [],
      }
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error('Failed to create article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}