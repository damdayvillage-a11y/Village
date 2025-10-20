import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db';
import { UserRole } from '@prisma/client';

export const dynamic = 'force-dynamic';

// Process refund for an order
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user?.role !== UserRole.ADMIN && session.user?.role !== UserRole.VILLAGE_COUNCIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { amount, reason } = body;

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid refund amount is required' },
        { status: 400 }
      );
    }

    if (!reason || !reason.trim()) {
      return NextResponse.json(
        { error: 'Refund reason is required' },
        { status: 400 }
      );
    }

    // Fetch order
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Validate refund amount
    if (amount > order.total) {
      return NextResponse.json(
        { error: 'Refund amount cannot exceed order total' },
        { status: 400 }
      );
    }

    // Check if order can be refunded
    if (order.status === 'CANCELLED' || order.status === 'REFUNDED') {
      return NextResponse.json(
        { error: 'Order has already been cancelled or refunded' },
        { status: 400 }
      );
    }

    // In production, integrate with payment gateway to process refund
    // For now, we'll create a refund record and update order status
    
    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: amount === order.total ? 'REFUNDED' : 'CANCELLED',
      },
    });

    // Log the refund (you might want to create a separate Refund model)
    const refundLog = {
      orderId: order.id,
      amount,
      reason,
      processedBy: session.user?.id,
      processedAt: new Date(),
    };

    console.log('Refund processed:', refundLog);

    // TODO: Integrate with payment gateway (Stripe, Razorpay, etc.)
    // const paymentRefund = await processPaymentRefund(order.paymentId, amount);

    return NextResponse.json({
      success: true,
      message: 'Refund processed successfully',
      refund: {
        orderId: order.id,
        amount,
        reason,
        status: updatedOrder.status,
      },
      note: 'Payment gateway integration pending. Refund recorded in system.',
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
