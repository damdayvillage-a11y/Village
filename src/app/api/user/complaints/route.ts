import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Replace with actual database queries when Prisma is properly set up
    // For now, return mock data
    const complaints = [
      {
        id: '1',
        type: 'complaint',
        title: 'Homestay Booking Issue',
        description: 'Unable to modify booking dates after confirmation.',
        status: 'in_progress',
        priority: 'medium',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        adminResponse: 'We are looking into this issue and will provide an update soon.'
      },
      {
        id: '2',
        type: 'suggestion',
        title: 'Mobile App for Village Tour',
        description: 'It would be great to have a mobile app for the village tour with offline maps.',
        status: 'reviewed',
        priority: 'low',
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        updatedAt: new Date(Date.now() - 259200000).toISOString(),
        adminResponse: 'Thank you for the suggestion! This is on our roadmap for 2024.'
      }
    ];

    return NextResponse.json(complaints);
  } catch (error) {
    console.error('Failed to fetch complaints:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, title, description, priority = 'medium' } = await request.json();

    if (!type || !title || !description) {
      return NextResponse.json({ 
        error: 'Type, title, and description are required' 
      }, { status: 400 });
    }

    if (!['complaint', 'suggestion'].includes(type)) {
      return NextResponse.json({ 
        error: 'Type must be either "complaint" or "suggestion"' 
      }, { status: 400 });
    }

    // TODO: Replace with actual database insert when Prisma is properly set up
    const newComplaint = {
      id: Date.now().toString(),
      type,
      title,
      description,
      priority,
      status: 'open',
      authorId: session.user?.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      adminResponse: null
    };

    console.log('Creating new complaint/suggestion:', newComplaint);

    return NextResponse.json(newComplaint, { status: 201 });
  } catch (error) {
    console.error('Failed to create complaint/suggestion:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}