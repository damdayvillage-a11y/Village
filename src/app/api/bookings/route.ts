import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { DynamicPricingEngine, defaultPricingPolicy } from '@/lib/booking/pricing';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      homestayId,
      checkIn,
      checkOut,
      guests,
      guestDetails,
      offlineId,
    } = body;

    // Validate required fields
    if (!homestayId || !checkIn || !checkOut || !guests || !guestDetails) {
      return NextResponse.json(
        { error: 'Missing required booking information' },
        { status: 400 }
      );
    }

    // Parse dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return NextResponse.json(
        { error: 'Check-out date must be after check-in date' },
        { status: 400 }
      );
    }

    // Verify homestay exists and is available
    const homestay = await prisma.homestay.findUnique({
      where: { id: homestayId },
      include: {
        bookings: {
          where: {
            AND: [
              { checkIn: { lt: checkOutDate } },
              { checkOut: { gt: checkInDate } },
              { status: { in: ['CONFIRMED', 'CHECKED_IN'] } },
            ],
          },
        },
      },
    });

    if (!homestay) {
      return NextResponse.json(
        { error: 'Homestay not found' },
        { status: 404 }
      );
    }

    if (!homestay.isActive) {
      return NextResponse.json(
        { error: 'Homestay is not available' },
        { status: 400 }
      );
    }

    if (homestay.bookings.length > 0) {
      return NextResponse.json(
        { error: 'Homestay is not available for the selected dates' },
        { status: 409 }
      );
    }

    if (guests > homestay.maxGuests) {
      return NextResponse.json(
        { error: `Maximum ${homestay.maxGuests} guests allowed` },
        { status: 400 }
      );
    }

    // Calculate pricing using dynamic pricing engine
    const pricingEngine = new DynamicPricingEngine({
      ...defaultPricingPolicy,
      homestayId: homestay.id,
      basePrice: homestay.basePrice,
      currency: homestay.currency,
    });

    // Get current occupancy for pricing calculation
    const currentDate = new Date();
    const totalHomestays = await prisma.homestay.count({ where: { isActive: true } });
    const occupiedHomestays = await prisma.booking.count({
      where: {
        AND: [
          { checkIn: { lte: currentDate } },
          { checkOut: { gte: currentDate } },
          { status: { in: ['CONFIRMED', 'CHECKED_IN'] } },
        ],
      },
    });
    const currentOccupancy = totalHomestays > 0 ? occupiedHomestays / totalHomestays : 0;

    const pricingBreakdown = await pricingEngine.calculatePrice(
      { checkIn: checkInDate, checkOut: checkOutDate, guests },
      currentOccupancy
    );

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        homestayId: homestay.id,
        guestId: guestDetails.userId || null,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        totalAmount: pricingBreakdown.total,
        currency: pricingBreakdown.currency,
        status: 'PENDING',
        guestDetails: {
          name: guestDetails.name,
          email: guestDetails.email,
          phone: guestDetails.phone,
          specialRequests: guestDetails.specialRequests || '',
        },
        pricingBreakdown: pricingBreakdown as any,
        offlineId: offlineId || null,
      },
      include: {
        homestay: {
          include: {
            village: true,
            host: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    // Send confirmation email (implement email service)
    // await sendBookingConfirmation(booking);

    return NextResponse.json({
      id: booking.id,
      confirmationNumber: booking.confirmationNumber,
      status: booking.status,
      homestay: {
        id: homestay.id,
        title: homestay.title,
        village: homestay.village?.name,
        host: booking.homestay.host,
      },
      dates: {
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
      },
      guests: booking.guests,
      pricing: pricingBreakdown,
      guestDetails: booking.guestDetails,
      createdAt: booking.createdAt,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const homestayId = searchParams.get('homestayId');
    const status = searchParams.get('status');

    const where: any = {};

    if (userId) {
      where.guestId = userId;
    }

    if (homestayId) {
      where.homestayId = homestayId;
    }

    if (status) {
      where.status = status.toUpperCase();
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        homestay: {
          select: {
            id: true,
            title: true,
            images: true,
            village: {
              select: {
                name: true,
              },
            },
            host: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      confirmationNumber: booking.confirmationNumber,
      status: booking.status,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
      totalAmount: booking.totalAmount,
      currency: booking.currency,
      guestDetails: booking.guestDetails,
      homestay: booking.homestay,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    }));

    return NextResponse.json({
      bookings: formattedBookings,
      total: formattedBookings.length,
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}