import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch real statistics from database
    const [bookingsCount, ordersCount, articlesCount, carbonCredit, achievementsCount] = await Promise.all([
      // Count bookings
      prisma.booking.count({
        where: { guestId: user.id }
      }),
      
      // Count orders
      prisma.order.count({
        where: { customerId: user.id }
      }),
      
      // Count articles (using reviews as proxy since we don't have articles table)
      prisma.review.count({
        where: { userId: user.id }
      }),
      
      // Get carbon credit balance
      prisma.carbonCredit.findUnique({
        where: { userId: user.id },
        select: { balance: true }
      }),
      
      // Count completed achievements
      prisma.userAchievement.count({
        where: { 
          userId: user.id,
          completed: true
        }
      })
    ]);

    const stats = {
      bookings: bookingsCount,
      orders: ordersCount,
      articles: articlesCount,
      carbonCredits: carbonCredit?.balance || 0,
      achievements: achievementsCount
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to fetch user stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}