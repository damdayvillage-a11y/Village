import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

// GET /api/user/analytics - Get user's personal analytics
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

    // Calculate date ranges
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get booking stats
    const totalBookings = await prisma.booking.count({
      where: { userId: user.id }
    });

    const thisMonthBookings = await prisma.booking.count({
      where: {
        userId: user.id,
        createdAt: { gte: thisMonthStart }
      }
    });

    const lastMonthBookings = await prisma.booking.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd
        }
      }
    });

    // Get spending stats (from orders)
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      select: { totalAmount: true, createdAt: true }
    });

    const totalSpending = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const thisMonthSpending = orders
      .filter(order => order.createdAt >= thisMonthStart)
      .reduce((sum, order) => sum + order.totalAmount, 0);
    const lastMonthSpending = orders
      .filter(order => order.createdAt >= lastMonthStart && order.createdAt <= lastMonthEnd)
      .reduce((sum, order) => sum + order.totalAmount, 0);

    // Get carbon credit stats
    const carbonCredit = await prisma.carbonCredit.findUnique({
      where: { userId: user.id }
    });

    const carbonTransactions = await prisma.carbonTransaction.findMany({
      where: { userId: user.id },
      select: { amount: true, type: true, createdAt: true }
    });

    const thisMonthCarbonEarned = carbonTransactions
      .filter(t => t.createdAt >= thisMonthStart && (t.type === 'EARN' || t.type === 'BONUS'))
      .reduce((sum, t) => sum + t.amount, 0);

    const lastMonthCarbonEarned = carbonTransactions
      .filter(t => 
        t.createdAt >= lastMonthStart && 
        t.createdAt <= lastMonthEnd && 
        (t.type === 'EARN' || t.type === 'BONUS')
      )
      .reduce((sum, t) => sum + t.amount, 0);

    // Get activity stats (total actions)
    const totalArticles = await prisma.article.count({
      where: { authorId: user.id }
    });

    const totalReviews = await prisma.review.count({
      where: { userId: user.id }
    });

    const totalActions = totalBookings + orders.length + totalArticles + totalReviews;
    const thisMonthActions = thisMonthBookings + 
      orders.filter(o => o.createdAt >= thisMonthStart).length;

    // Calculate trends
    const bookingTrend = lastMonthBookings === 0 
      ? (thisMonthBookings > 0 ? 'up' : 'stable')
      : thisMonthBookings > lastMonthBookings ? 'up' : thisMonthBookings < lastMonthBookings ? 'down' : 'stable';
    
    const bookingTrendPercent = lastMonthBookings === 0
      ? 100
      : Math.abs(((thisMonthBookings - lastMonthBookings) / lastMonthBookings) * 100);

    const spendingTrend = lastMonthSpending === 0
      ? (thisMonthSpending > 0 ? 'up' : 'stable')
      : thisMonthSpending > lastMonthSpending ? 'up' : thisMonthSpending < lastMonthSpending ? 'down' : 'stable';
    
    const spendingTrendPercent = lastMonthSpending === 0
      ? 100
      : Math.abs(((thisMonthSpending - lastMonthSpending) / lastMonthSpending) * 100);

    const carbonTrend = lastMonthCarbonEarned === 0
      ? (thisMonthCarbonEarned > 0 ? 'up' : 'stable')
      : thisMonthCarbonEarned > lastMonthCarbonEarned ? 'up' : thisMonthCarbonEarned < lastMonthCarbonEarned ? 'down' : 'stable';
    
    const carbonTrendPercent = lastMonthCarbonEarned === 0
      ? 100
      : Math.abs(((thisMonthCarbonEarned - lastMonthCarbonEarned) / lastMonthCarbonEarned) * 100);

    return NextResponse.json({
      bookingStats: {
        total: totalBookings,
        thisMonth: thisMonthBookings,
        trend: bookingTrend,
        trendPercent: Math.round(bookingTrendPercent)
      },
      spendingStats: {
        total: totalSpending,
        thisMonth: thisMonthSpending,
        trend: spendingTrend,
        trendPercent: Math.round(spendingTrendPercent)
      },
      carbonStats: {
        totalOffset: carbonCredit?.totalEarned || 0,
        thisMonth: thisMonthCarbonEarned,
        trend: carbonTrend,
        trendPercent: Math.round(carbonTrendPercent)
      },
      activityStats: {
        totalActions,
        thisMonth: thisMonthActions,
        trend: 'stable',
        trendPercent: 0
      }
    });
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
