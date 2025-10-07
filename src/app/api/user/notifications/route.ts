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
    const notifications = [
      {
        id: '1',
        title: 'Booking Confirmed',
        message: 'Your homestay booking for Himalayan Cottage has been confirmed.',
        type: 'success',
        timestamp: new Date().toISOString(),
        read: false
      },
      {
        id: '2',
        title: 'Article Published',
        message: 'Your article "Village Life in the Himalayas" has been published.',
        type: 'info',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: true
      },
      {
        id: '3',
        title: 'New Project Update',
        message: 'Solar microgrid project has reached 75% completion.',
        type: 'info',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        read: false
      }
    ];

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}