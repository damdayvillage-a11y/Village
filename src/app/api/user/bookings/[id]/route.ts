import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

// GET /api/user/bookings/[id] - Get specific booking
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Fetch booking (only if it belongs to the user)
    const booking = await prisma.booking.findFirst({
      where: {
        id: params.id,
        guestId: user.id
      },
      include: {
        homestay: {
          select: {
            id: true,
            name: true,
            address: true,
            photos: true,
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Format response
    const formattedBooking = {
      id: booking.id,
      homestayId: booking.homestayId,
      homestayName: booking.homestay.name,
      homestayAddress: booking.homestay.address,
      homestayPhotos: booking.homestay.photos,
      checkIn: booking.checkIn.toISOString(),
      checkOut: booking.checkOut.toISOString(),
      guests: booking.guests,
      status: booking.status,
      pricing: booking.pricing,
      paymentRef: booking.paymentRef,
      carbonFootprint: booking.carbonFootprint,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedBooking);
  } catch (error) {
    console.error('Failed to fetch booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/user/bookings/[id] - Update booking (reschedule)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { checkIn, checkOut, guests } = body;

    // Fetch existing booking
    const existingBooking = await prisma.booking.findFirst({
      where: {
        id: params.id,
        guestId: user.id
      },
      include: {
        homestay: true
      }
    });

    if (!existingBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Only allow rescheduling for confirmed bookings
    if (existingBooking.status !== 'CONFIRMED' && existingBooking.status !== 'PENDING') {
      return NextResponse.json({ 
        error: 'Only pending or confirmed bookings can be rescheduled' 
      }, { status: 400 });
    }

    // Validate new dates if provided
    if (checkIn || checkOut) {
      const newCheckIn = checkIn ? new Date(checkIn) : existingBooking.checkIn;
      const newCheckOut = checkOut ? new Date(checkOut) : existingBooking.checkOut;
      const now = new Date();

      if (newCheckIn < now) {
        return NextResponse.json({ 
          error: 'Check-in date must be in the future' 
        }, { status: 400 });
      }

      if (newCheckOut <= newCheckIn) {
        return NextResponse.json({ 
          error: 'Check-out date must be after check-in date' 
        }, { status: 400 });
      }

      // Check for overlapping bookings (excluding current booking)
      const overlappingBooking = await prisma.booking.findFirst({
        where: {
          id: { not: params.id },
          homestayId: existingBooking.homestayId,
          status: { in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'] },
          OR: [
            {
              AND: [
                { checkIn: { lte: newCheckIn } },
                { checkOut: { gte: newCheckIn } }
              ]
            },
            {
              AND: [
                { checkIn: { lte: newCheckOut } },
                { checkOut: { gte: newCheckOut } }
              ]
            },
            {
              AND: [
                { checkIn: { gte: newCheckIn } },
                { checkOut: { lte: newCheckOut } }
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
    }

    // Validate guests if provided
    if (guests && guests > existingBooking.homestay.maxGuests) {
      return NextResponse.json({ 
        error: `Maximum ${existingBooking.homestay.maxGuests} guests allowed` 
      }, { status: 400 });
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        ...(checkIn && { checkIn: new Date(checkIn) }),
        ...(checkOut && { checkOut: new Date(checkOut) }),
        ...(guests && { guests }),
        updatedAt: new Date(),
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
        title: 'Booking Updated',
        message: `Your booking for ${updatedBooking.homestay.name} has been updated.`,
        type: 'BOOKING',
      }
    });

    // Format response
    const formattedBooking = {
      id: updatedBooking.id,
      homestayId: updatedBooking.homestayId,
      homestayName: updatedBooking.homestay.name,
      homestayAddress: updatedBooking.homestay.address,
      checkIn: updatedBooking.checkIn.toISOString(),
      checkOut: updatedBooking.checkOut.toISOString(),
      guests: updatedBooking.guests,
      status: updatedBooking.status,
      pricing: updatedBooking.pricing,
      updatedAt: updatedBooking.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedBooking);
  } catch (error) {
    console.error('Failed to update booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/user/bookings/[id] - Cancel booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Fetch existing booking
    const existingBooking = await prisma.booking.findFirst({
      where: {
        id: params.id,
        guestId: user.id
      },
      include: {
        homestay: {
          select: {
            name: true
          }
        }
      }
    });

    if (!existingBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Only allow cancellation for pending or confirmed bookings
    if (existingBooking.status !== 'CONFIRMED' && existingBooking.status !== 'PENDING') {
      return NextResponse.json({ 
        error: 'Only pending or confirmed bookings can be cancelled' 
      }, { status: 400 });
    }

    // Update booking status to cancelled
    await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: 'CANCELLED',
        updatedAt: new Date(),
      }
    });

    // Send notification to user
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Booking Cancelled',
        message: `Your booking for ${existingBooking.homestay.name} has been cancelled.`,
        type: 'BOOKING',
      }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Booking cancelled successfully' 
    });
  } catch (error) {
    console.error('Failed to cancel booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
