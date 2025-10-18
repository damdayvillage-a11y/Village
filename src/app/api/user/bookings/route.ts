import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

// GET /api/user/bookings - Get all user bookings
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

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    // Build where clause
    const where: any = { guestId: user.id };
    
    if (status) {
      where.status = status;
    }
    
    if (from || to) {
      where.checkIn = {};
      if (from) where.checkIn.gte = new Date(from);
      if (to) where.checkIn.lte = new Date(to);
    }

    // Fetch bookings with homestay details
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        homestay: {
          select: {
            id: true,
            name: true,
            address: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform data for frontend
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      homestayId: booking.homestayId,
      homestayName: booking.homestay.name,
      homestayAddress: booking.homestay.address,
      checkIn: booking.checkIn.toISOString(),
      checkOut: booking.checkOut.toISOString(),
      guests: booking.guests,
      status: booking.status,
      pricing: booking.pricing,
      createdAt: booking.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedBookings);
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/user/bookings - Create new booking
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { homestayId, checkIn, checkOut, guests, pricing } = body;

    // Validate required fields
    if (!homestayId || !checkIn || !checkOut || !guests || !pricing) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const now = new Date();

    if (checkInDate < now) {
      return NextResponse.json({ 
        error: 'Check-in date must be in the future' 
      }, { status: 400 });
    }

    if (checkOutDate <= checkInDate) {
      return NextResponse.json({ 
        error: 'Check-out date must be after check-in date' 
      }, { status: 400 });
    }

    // Verify homestay exists and is available
    const homestay = await prisma.homestay.findUnique({
      where: { id: homestayId },
      select: { 
        id: true, 
        available: true,
        maxGuests: true 
      }
    });

    if (!homestay) {
      return NextResponse.json({ error: 'Homestay not found' }, { status: 404 });
    }

    if (!homestay.available) {
      return NextResponse.json({ 
        error: 'Homestay is not available' 
      }, { status: 400 });
    }

    if (guests > homestay.maxGuests) {
      return NextResponse.json({ 
        error: `Maximum ${homestay.maxGuests} guests allowed` 
      }, { status: 400 });
    }

    // Check for overlapping bookings
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        homestayId,
        status: { in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'] },
        OR: [
          {
            AND: [
              { checkIn: { lte: checkInDate } },
              { checkOut: { gte: checkInDate } }
            ]
          },
          {
            AND: [
              { checkIn: { lte: checkOutDate } },
              { checkOut: { gte: checkOutDate } }
            ]
          },
          {
            AND: [
              { checkIn: { gte: checkInDate } },
              { checkOut: { lte: checkOutDate } }
            ]
          }
        ]
      }
    });

    if (overlappingBooking) {
      return NextResponse.json({ 
        error: 'Homestay is already booked for these dates' 
      }, { status: 400 });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        homestayId,
        guestId: user.id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        pricing,
        status: 'PENDING',
      },
      include: {
        homestay: {
          select: {
            id: true,
            name: true,
            address: true,
          }
        }
      }
    });

    // Send notification to user
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Booking Created',
        message: `Your booking for ${booking.homestay.name} has been created and is pending confirmation.`,
        type: 'BOOKING',
      }
    });

    // Format response
    const formattedBooking = {
      id: booking.id,
      homestayId: booking.homestayId,
      homestayName: booking.homestay.name,
      homestayAddress: booking.homestay.address,
      checkIn: booking.checkIn.toISOString(),
      checkOut: booking.checkOut.toISOString(),
      guests: booking.guests,
      status: booking.status,
      pricing: booking.pricing,
      createdAt: booking.createdAt.toISOString(),
    };

    return NextResponse.json(formattedBooking, { status: 201 });
  } catch (error) {
    console.error('Failed to create booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
