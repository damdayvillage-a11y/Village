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

    // Fetch user's complaints from database
    const complaints = await prisma.complaint.findMany({
      where: {
        authorId: session.user.id
      },
      select: {
        id: true,
        type: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        category: true,
        adminResponse: true,
        createdAt: true,
        updatedAt: true,
        resolvedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(complaints);
  } catch (error) {
    console.error('Failed to fetch complaints:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, title, description, priority = 'MEDIUM', category } = await request.json();

    if (!type || !title || !description) {
      return NextResponse.json({ 
        error: 'Type, title, and description are required' 
      }, { status: 400 });
    }

    // Validate type
    const validTypes = ['COMPLAINT', 'SUGGESTION', 'FEEDBACK'];
    const normalizedType = type.toUpperCase();
    
    if (!validTypes.includes(normalizedType)) {
      return NextResponse.json({ 
        error: 'Type must be COMPLAINT, SUGGESTION, or FEEDBACK' 
      }, { status: 400 });
    }

    // Create complaint in database
    const newComplaint = await prisma.complaint.create({
      data: {
        type: normalizedType,
        title,
        description,
        priority: priority.toUpperCase(),
        category,
        authorId: session.user.id,
        status: 'OPEN'
      }
    });

    return NextResponse.json(newComplaint, { status: 201 });
  } catch (error) {
    console.error('Failed to create complaint/suggestion:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}