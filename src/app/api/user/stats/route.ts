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
    const stats = {
      bookings: 3,
      orders: 7,
      articles: 2,
      contributions: 12
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to fetch user stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}