import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import prisma from '@/lib/db/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookingId = params.id;
    const body = await request.json();
    const { reason } = body;

    // Fetch booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        homestay: true,
        guest: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Verify the booking belongs to the user
    if (booking.guestId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if booking can be cancelled
    if (booking.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'Booking is already cancelled' },
        { status: 400 }
      );
    }

    if (booking.status === 'CHECKED_OUT') {
      return NextResponse.json(
        { error: 'Cannot cancel completed booking' },
        { status: 400 }
      );
    }

    // Calculate refund amount
    const checkInDate = new Date(booking.checkIn);
    const now = new Date();
    const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    let refundPercentage = 0;
    if (hoursUntilCheckIn > 24) {
      refundPercentage = 100;
    } else if (hoursUntilCheckIn > 12) {
      refundPercentage = 50;
    }

    // Calculate refund amount from pricing JSON
    const pricingData = booking.pricing as any;
    const totalPrice = typeof pricingData === 'object' && pricingData !== null ? 
      (pricingData.total || 0) : 0;
    const refundAmount = (totalPrice * refundPercentage) / 100;

    // Update booking status (remove non-existent fields)
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
        // cancelledAt and cancellationReason fields don't exist in schema
        // Store cancellation info in carbonFootprint JSON field as workaround
        carbonFootprint: {
          ...(typeof booking.carbonFootprint === 'object' ? booking.carbonFootprint as any : {}),
          cancelledAt: new Date().toISOString(),
          cancellationReason: reason,
        },
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: 'BOOKING',
        title: 'Booking Cancelled',
        message: `Your booking for ${booking.homestay.name} has been cancelled. ${refundPercentage > 0 ? `Refund: ₹${refundAmount}` : 'No refund applicable.'}`,
        actionUrl: `/user-panel/bookings/${bookingId}`,
        metadata: {
          bookingId,
          refundAmount,
          refundPercentage,
        },
      },
    });

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      refund: {
        amount: refundAmount,
        percentage: refundPercentage,
      },
    });
  } catch (error) {
    console.error('Booking cancellation error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}
