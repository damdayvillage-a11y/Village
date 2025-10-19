import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/bookings/analytics - Get booking analytics
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'HOST')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const homestayId = searchParams.get('homestayId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const metric = searchParams.get('metric'); // 'revenue' | 'occupancy' | 'bookings' | 'all'

    const where: any = {};

    if (homestayId) {
      where.homestayId = homestayId;
    }

    // Default to last 90 days if no dates provided
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    where.checkIn = {
      gte: start,
      lte: end,
    };

    // Fetch all bookings in range
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        homestay: {
          select: {
            id: true,
            name: true,
          },
        },
        guest: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { checkIn: 'asc' },
    });

    // Calculate metrics
    const analytics: any = {
      period: {
        start,
        end,
        days: Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
      },
      totalBookings: bookings.length,
      bookingsByStatus: {
        pending: 0,
        confirmed: 0,
        checkedIn: 0,
        completed: 0,
        cancelled: 0,
      },
      revenue: {
        total: 0,
        completed: 0,
        pending: 0,
        average: 0,
      },
      occupancy: {
        totalNights: 0,
        availableNights: 0,
        bookedNights: 0,
        rate: 0,
      },
      guests: {
        total: 0,
        average: 0,
        repeat: 0,
      },
      bookingsByMonth: {},
      revenueByMonth: {},
      topHomestays: [],
    };

    // Process bookings
    const guestIds = new Set();
    const guestBookings: any = {};
    const homestayStats: any = {};

    bookings.forEach(booking => {
      // Status counts
      analytics.bookingsByStatus[booking.status.toLowerCase()]++;

      // Revenue
      const pricing = booking.pricing as any;
      const total = pricing?.total || 0;
      analytics.revenue.total += total;

      if (booking.status === 'COMPLETED') {
        analytics.revenue.completed += total;
      } else if (booking.status === 'PENDING' || booking.status === 'CONFIRMED') {
        analytics.revenue.pending += total;
      }

      // Nights calculation
      const nights = Math.ceil(
        (booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (booking.status !== 'CANCELLED') {
        analytics.occupancy.bookedNights += nights;
      }

      // Guests
      analytics.guests.total += booking.guests;
      guestIds.add(booking.guestId);

      // Track repeat guests
      if (!guestBookings[booking.guestId]) {
        guestBookings[booking.guestId] = 0;
      }
      guestBookings[booking.guestId]++;

      // Monthly aggregations
      const month = booking.checkIn.toISOString().substring(0, 7); // YYYY-MM
      analytics.bookingsByMonth[month] = (analytics.bookingsByMonth[month] || 0) + 1;
      analytics.revenueByMonth[month] = (analytics.revenueByMonth[month] || 0) + total;

      // Homestay stats
      if (!homestayStats[booking.homestayId]) {
        homestayStats[booking.homestayId] = {
          homestayId: booking.homestayId,
          name: booking.homestay.name,
          bookings: 0,
          revenue: 0,
          nights: 0,
        };
      }

      homestayStats[booking.homestayId].bookings++;
      homestayStats[booking.homestayId].revenue += total;
      homestayStats[booking.homestayId].nights += nights;
    });

    // Calculate averages
    analytics.revenue.average = analytics.totalBookings > 0
      ? analytics.revenue.total / analytics.totalBookings
      : 0;

    analytics.guests.average = analytics.totalBookings > 0
      ? analytics.guests.total / analytics.totalBookings
      : 0;

    // Count repeat guests
    Object.values(guestBookings).forEach((count: any) => {
      if (count > 1) {
        analytics.guests.repeat++;
      }
    });

    analytics.guests.repeatRate = guestIds.size > 0
      ? (analytics.guests.repeat / guestIds.size) * 100
      : 0;

    // Calculate occupancy rate
    // This is simplified - real calculation would need homestay capacity data
    const totalDays = analytics.period.days;
    const homestayCount = homestayId ? 1 : Object.keys(homestayStats).length || 1;
    analytics.occupancy.availableNights = totalDays * homestayCount;
    analytics.occupancy.rate = analytics.occupancy.availableNights > 0
      ? (analytics.occupancy.bookedNights / analytics.occupancy.availableNights) * 100
      : 0;

    // Top homestays
    analytics.topHomestays = Object.values(homestayStats)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10);

    // Convert monthly data to arrays for charting
    analytics.bookingsByMonthArray = Object.entries(analytics.bookingsByMonth)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    analytics.revenueByMonthArray = Object.entries(analytics.revenueByMonth)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Filter by metric if specified
    if (metric && metric !== 'all') {
      return NextResponse.json({ [metric]: analytics[metric] });
    }

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
