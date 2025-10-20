import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db';
import { UserRole } from '@prisma/client';
import { logActivity, ActivityAction, ActivityEntity } from '@/lib/activity-logger';

export const dynamic = 'force-dynamic';

// POST booking refund
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user?.role !== UserRole.ADMIN && session.user?.role !== UserRole.HOST) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { amount, reason, fullRefund = false } = body;

    // Fetch booking
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        payments: true,
        homestay: true,
        guest: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check if booking can be refunded
    const refundableStatuses = ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED'];
    if (!refundableStatuses.includes(booking.status)) {
      return NextResponse.json(
        { error: `Cannot refund booking with status: ${booking.status}` },
        { status: 400 }
      );
    }

    // Calculate refund amount
    const pricing = booking.pricing as any;
    const totalPaid = pricing?.total || 0;
    const refundAmount = fullRefund ? totalPaid : (amount || 0);

    // Validate refund amount
    if (refundAmount <= 0) {
      return NextResponse.json({ error: 'Refund amount must be greater than 0' }, { status: 400 });
    }

    if (refundAmount > totalPaid) {
      return NextResponse.json(
        { error: `Refund amount cannot exceed total paid: ${totalPaid}` },
        { status: 400 }
      );
    }

    // Process refund
    // In production, integrate with payment gateway (Stripe, Razorpay, etc.)
    // Example: const refund = await stripe.refunds.create({ charge: chargeId, amount: refundAmount });

    // Update booking status to CANCELLED (since REFUNDED doesn't exist in schema)
    await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: 'CANCELLED',
        // Store refund details in metadata or separate table
        // In production, add refund details to a RefundTransaction table
      },
    });

    // Log activity
    if (session.user?.id) {
      await logActivity({
        userId: session.user.id,
        action: ActivityAction.REFUND,
        entity: ActivityEntity.BOOKING,
        entityId: params.id,
        description: `Processed refund of ${refundAmount} for booking ${booking.id}`,
        metadata: {
          bookingId: booking.id,
          amount: refundAmount,
          reason,
          fullRefund,
          guestEmail: booking.guest.email,
          homestayName: booking.homestay.name,
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      });
    }

    return NextResponse.json({
      success: true,
      refund: {
        bookingId: params.id,
        amount: refundAmount,
        reason,
        fullRefund,
        status: 'processed',
        processedAt: new Date().toISOString(),
        // In production, include payment gateway refund ID
        // refundId: refund.id,
      },
      message: `Refund of ${refundAmount} processed successfully. Payment gateway integration pending.`,
    });
  } catch (error) {
    console.error('Failed to process refund:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
