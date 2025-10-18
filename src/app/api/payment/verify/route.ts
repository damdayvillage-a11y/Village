import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
      orderId,
    } = body;

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment data' }, { status: 400 });
    }

    // Get Razorpay secret
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpayKeySecret) {
      return NextResponse.json(
        { error: 'Payment gateway not configured' },
        { status: 500 }
      );
    }

    // Verify signature
    const hmac = crypto.createHmac('sha256', razorpayKeySecret);
    hmac.update(\`\${razorpay_order_id}|\${razorpay_payment_id}\`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Create payment record in database
    const payment = await prisma.payment.create({
      data: {
        amount: 0, // Will be updated from Razorpay webhook
        currency: 'INR',
        status: 'COMPLETED',
        provider: 'RAZORPAY',
        transactionId: razorpay_payment_id,
        metadata: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        },
        userId: session.user.id,
      },
    });

    // Update booking or order status
    if (bookingId) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CONFIRMED',
          paymentId: payment.id,
        },
      });

      // Create notification
      await prisma.notification.create({
        data: {
          userId: session.user.id,
          type: 'BOOKING',
          title: 'Booking Confirmed',
          message: 'Your booking has been confirmed. Payment received successfully.',
          actionUrl: \`/user-panel/bookings/\${bookingId}\`,
          metadata: {
            bookingId,
            paymentId: payment.id,
          },
        },
      });
    } else if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'CONFIRMED',
          paymentId: payment.id,
        },
      });

      // Create notification
      await prisma.notification.create({
        data: {
          userId: session.user.id,
          type: 'ORDER',
          title: 'Order Confirmed',
          message: 'Your order has been confirmed. Payment received successfully.',
          actionUrl: \`/user-panel/orders/\${orderId}\`,
          metadata: {
            orderId,
            paymentId: payment.id,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      transactionId: payment.id,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
