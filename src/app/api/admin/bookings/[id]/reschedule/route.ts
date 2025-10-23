import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db';
import { UserRole } from '@prisma/client';
import { calculateBookingPrice } from '@/lib/pricing-engine';
import { logActivity, ActivityAction } from '@/lib/activity-logger';

export const dynamic = 'force-dynamic';

// POST reschedule booking
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { newCheckIn, newCheckOut } = body;

    if (!newCheckIn || !newCheckOut) {
      return NextResponse.json(
        { error: 'New check-in and check-out dates are required' },
        { status: 400 }
      );
    }

    // Fetch existing booking
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        homestay: true,
        guest: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Verify ownership or admin
    if (
      session.user?.role !== UserRole.ADMIN &&
      session.user?.role !== UserRole.HOST &&
      session.user?.id !== booking.guestId
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if booking can be rescheduled
    const rescheduleableStatuses = ['PENDING', 'CONFIRMED'];
    if (!rescheduleableStatuses.includes(booking.status)) {
      return NextResponse.json(
        { error: `Cannot reschedule booking with status: ${booking.status}` },
        { status: 400 }
      );
    }

    const newCheckInDate = new Date(newCheckIn);
    const newCheckOutDate = new Date(newCheckOut);

    // Validate dates
    if (newCheckInDate >= newCheckOutDate) {
      return NextResponse.json(
        { error: 'Check-out date must be after check-in date' },
        { status: 400 }
      );
    }

    if (newCheckInDate < new Date()) {
      return NextResponse.json(
        { error: 'Check-in date cannot be in the past' },
        { status: 400 }
      );
    }

    // Check for conflicts
    const conflicts = await prisma.booking.findMany({
      where: {
        id: { not: params.id },
        homestayId: booking.homestayId,
        status: {
          in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'],
        },
        OR: [
          {
            AND: [
              { checkIn: { lte: newCheckInDate } },
              { checkOut: { gt: newCheckInDate } },
            ],
          },
          {
            AND: [
              { checkIn: { lt: newCheckOutDate } },
              { checkOut: { gte: newCheckOutDate } },
            ],
          },
          {
            AND: [
              { checkIn: { gte: newCheckInDate } },
              { checkOut: { lte: newCheckOutDate } },
            ],
          },
        ],
      },
    });

    if (conflicts.length > 0) {
      return NextResponse.json(
        { error: 'New dates conflict with existing reservations' },
        { status: 400 }
      );
    }

    // Calculate new pricing
    const oldPricing = booking.pricing as any;
    const newPricingResult = await calculateBookingPrice(
      {
        homestayId: booking.homestayId,
        checkIn: newCheckInDate,
        checkOut: newCheckOutDate,
        guests: booking.guests,
      },
      {
        basePricePerNight: parseFloat(booking.homestay.basePrice.toString()),
        cleaningFee: oldPricing?.cleaningFee || 50,
        serviceFeePercent: oldPricing?.serviceFeePercent || 10,
        taxPercent: oldPricing?.taxPercent || 12,
      }
    );

    const oldTotal = oldPricing?.totalPrice || oldPricing?.total || 0;
    const newTotal = newPricingResult.totalPrice;
    const priceDifference = newTotal - oldTotal;

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        checkIn: newCheckInDate,
        checkOut: newCheckOutDate,
        pricing: newPricingResult as any,
      },
    });

    // Log activity
    if (session.user?.id) {
      await logActivity({
        userId: session.user.id,
        action: 'RESCHEDULE',
        entity: 'Booking',
        entityId: params.id,
        description: `Rescheduled booking from ${booking.checkIn.toISOString()} to ${newCheckInDate.toISOString()}`,
        metadata: {
          bookingId: params.id,
          oldCheckIn: booking.checkIn,
          oldCheckOut: booking.checkOut,
          newCheckIn: newCheckInDate,
          newCheckOut: newCheckOutDate,
          oldTotal,
          newTotal,
          priceDifference,
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      });
    }

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      pricingComparison: {
        oldTotal,
        newTotal,
        difference: priceDifference,
        message:
          priceDifference > 0
            ? `Additional payment of ${priceDifference} required`
            : priceDifference < 0
            ? `Refund of ${Math.abs(priceDifference)} will be processed`
            : 'No price difference',
      },
    });
  } catch (error) {
    console.error('Failed to reschedule booking:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
