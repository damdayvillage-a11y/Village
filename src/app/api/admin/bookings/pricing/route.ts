import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateBookingPrice } from '@/lib/pricing-engine';

// POST /api/admin/bookings/pricing - Calculate dynamic price
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { homestayId, checkIn, checkOut, guests, promoCode } = body;

    if (!homestayId || !checkIn || !checkOut || !guests) {
      return NextResponse.json(
        { error: 'Homestay ID, check-in, check-out, and guest count are required' },
        { status: 400 }
      );
    }

    // Fetch homestay details
    const homestay = await prisma.homestay.findUnique({
      where: { id: homestayId },
      select: {
        id: true,
        name: true,
        basePrice: true,
        maxGuests: true,
      },
    });

    if (!homestay) {
      return NextResponse.json({ error: 'Homestay not found' }, { status: 404 });
    }

    // Validate guest count
    if (guests > homestay.maxGuests) {
      return NextResponse.json(
        { error: `Maximum ${homestay.maxGuests} guests allowed` },
        { status: 400 }
      );
    }

    // Check availability
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    // Get custom pricing overrides
    const priceOverrides = await prisma.availability.findMany({
      where: {
        homestayId,
        date: {
          gte: checkInDate,
          lt: checkOutDate,
        },
        priceOverride: {
          not: null,
        },
      },
      select: {
        date: true,
        priceOverride: true,
      },
    });

    // Calculate base occupancy for dynamic pricing
    const totalBookings = await prisma.booking.count({
      where: {
        homestayId,
        status: {
          in: ['CONFIRMED', 'CHECKED_IN'],
        },
        checkIn: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalDays = 30;
    const occupancyRate = totalBookings / totalDays;

    // Default pricing configuration
    // TODO: These should be fetched from homestay-specific or global settings
    const DEFAULT_CLEANING_FEE = 50;
    const DEFAULT_SERVICE_FEE_PERCENT = 10;
    const DEFAULT_TAX_PERCENT = 12;

    // Calculate pricing
    const pricingResult = await calculateBookingPrice(
      {
        homestayId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        promoCode,
      },
      {
        basePricePerNight: parseFloat(homestay.basePrice.toString()),
        cleaningFee: DEFAULT_CLEANING_FEE,
        serviceFeePercent: DEFAULT_SERVICE_FEE_PERCENT,
        taxPercent: DEFAULT_TAX_PERCENT,
        currentOccupancyRate: occupancyRate,
      }
    );

    // Cache pricing for 5 minutes
    // TODO: Implement Redis caching for better performance

    return NextResponse.json(pricingResult);
  } catch (error) {
    console.error('Error calculating pricing:', error);
    return NextResponse.json({ error: 'Failed to calculate pricing' }, { status: 500 });
  }
}

// GET /api/admin/bookings/pricing - Get pricing history
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

    if (!homestayId) {
      return NextResponse.json({ error: 'Homestay ID is required' }, { status: 400 });
    }

    const where: any = {
      homestayId,
      status: {
        in: ['CONFIRMED', 'CHECKED_IN', 'COMPLETED'],
      },
    };

    if (startDate) {
      where.checkIn = { gte: new Date(startDate) };
    }

    if (endDate) {
      where.checkOut = { lte: new Date(endDate) };
    }

    const bookings = await prisma.booking.findMany({
      where,
      select: {
        id: true,
        checkIn: true,
        checkOut: true,
        guests: true,
        pricing: true,
        createdAt: true,
      },
      orderBy: { checkIn: 'desc' },
      take: 50,
    });

    // Calculate average pricing metrics
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => {
      const pricing = b.pricing as any;
      return sum + (pricing?.total || 0);
    }, 0);

    const averagePrice = totalBookings > 0 ? totalRevenue / totalBookings : 0;

    return NextResponse.json({
      bookings,
      metrics: {
        totalBookings,
        totalRevenue,
        averagePrice,
      },
    });
  } catch (error) {
    console.error('Error fetching pricing history:', error);
    return NextResponse.json({ error: 'Failed to fetch pricing history' }, { status: 500 });
  }
}
