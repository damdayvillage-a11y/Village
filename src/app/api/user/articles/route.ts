import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Replace with actual database queries when Prisma is properly set up
    // For now, return mock data
    const articles = [
      {
        id: '1',
        title: 'Village Life in the Himalayas',
        status: 'published',
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        views: 234
      },
      {
        id: '2',
        title: 'Sustainable Tourism Practices',
        status: 'draft',
        publishedAt: null,
        views: 0
      },
      {
        id: '3',
        title: 'Traditional Crafts of Damday Village',
        status: 'review',
        publishedAt: null,
        views: 0
      }
    ];

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Failed to fetch user articles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, status = 'draft' } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // TODO: Replace with actual database insert when Prisma is properly set up
    const newArticle = {
      id: Date.now().toString(),
      title,
      content,
      status,
      authorId: session.user?.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: status === 'published' ? new Date().toISOString() : null,
      views: 0
    };

    console.log('Creating new article:', newArticle);

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error('Failed to create article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}