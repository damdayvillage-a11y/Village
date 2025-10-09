import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { UserRole } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get session with error handling
    let session;
    try {
      session = await getServerSession(authOptions);
    } catch (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ 
        error: 'Authentication service unavailable',
        details: 'Unable to verify session. Please try again.' 
      }, { status: 503 });
    }
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has admin permissions
    if (session.user?.role !== UserRole.ADMIN && session.user?.role !== UserRole.VILLAGE_COUNCIL) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // TODO: Replace with actual database queries when Prisma is properly set up
    // For now, return mock data
    const stats = {
      totalUsers: 147,
      activeBookings: 23,
      pendingReviews: 8,
      systemHealth: 'healthy',
      complaints: 12,
      articles: 34,
      revenue: 45600,
      occupancyRate: 78
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : 'An unexpected error occurred'
    }, { status: 500 });
  }
}