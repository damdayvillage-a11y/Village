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

    // Check if homestay is available (simplified for now)
    if (homestay.bookings && homestay.bookings.length > 50) {
      return NextResponse.json(
        { error: 'Homestay is not available for the selected dates' },
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
      currency: 'INR', // Default to INR for village bookings
    });

    // Get current occupancy for pricing calculation
    const currentDate = new Date();
    const totalHomestays = await prisma.homestay.count();
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
        // Store pricing info in the pricing field as JSON
        pricing: pricingBreakdown as any,
        status: 'PENDING',
        // Note: guestDetails would be stored separately or in a JSON field
        carbonFootprint: {
          estimated: 0,
          methodology: 'Standard village calculation'
        } as any,
        paymentRef: null, // Will be set when payment is processed
      },
      include: {
        homestay: {
          include: {
            village: true
          }
        }
      }
    });

    // Send confirmation email (implement email service)
    // await sendBookingConfirmation(booking);

    return NextResponse.json({
      id: booking.id,
      confirmationNumber: `DAM-${booking.id.substring(0, 8).toUpperCase()}`,
      status: booking.status,
      homestay: {
        id: homestay.id,
        name: homestay.name,
        village: booking.homestay.village?.name,
        // host info would be fetched separately
      },
      dates: {
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
      },
      guests: booking.guests,
      pricing: pricingBreakdown,
      guestDetails: guestDetails, // Use original guest details from request
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
            name: true,
            description: true,
            village: {
              select: {
                name: true,
              }
            }
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      confirmationNumber: `DAM-${booking.id.substring(0, 8).toUpperCase()}`,
      status: booking.status,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
      pricing: booking.pricing, // Contains amount and currency info
      carbonFootprint: booking.carbonFootprint,
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