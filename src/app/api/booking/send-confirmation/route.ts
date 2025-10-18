import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import prisma from '@/lib/db/prisma';
import { EmailNotificationService } from '@/lib/notifications/email';
import { format } from 'date-fns';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { bookingId, email } = body;

    if (!bookingId || !email) {
      return NextResponse.json(
        { error: 'Booking ID and email are required' },
        { status: 400 }
      );
    }

    // Fetch booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        homestay: {
          include: {
            owner: true,
          },
        },
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

    // Extract pricing information
    const pricing = typeof booking.pricing === 'object' && booking.pricing !== null ? 
      booking.pricing as any : {};
    const totalAmount = pricing.total || 0;

    // Send confirmation email using the email service
    const emailSent = await EmailNotificationService.sendBookingConfirmation({
      guestEmail: email,
      guestName: booking.guest.name,
      homestayTitle: booking.homestay.name,
      hostName: booking.homestay.owner.name,
      checkInDate: format(new Date(booking.checkIn), 'PPP'),
      checkOutDate: format(new Date(booking.checkOut), 'PPP'),
      guests: booking.guests,
      totalAmount,
      currency: 'INR',
      bookingId: booking.id,
      bookingReference: booking.id.substring(0, 8).toUpperCase()
    });

    if (!emailSent) {
      console.warn('Email sending failed, but continuing...');
      // Don't fail the request if email fails - just log it
    }

    // Also send notification to host
    await EmailNotificationService.sendHostNotification({
      hostEmail: booking.homestay.owner.email,
      hostName: booking.homestay.owner.name,
      homestayTitle: booking.homestay.name,
      guestName: booking.guest.name,
      checkInDate: format(new Date(booking.checkIn), 'PPP'),
      checkOutDate: format(new Date(booking.checkOut), 'PPP'),
      guests: booking.guests,
      bookingReference: booking.id.substring(0, 8).toUpperCase(),
      guestContact: booking.guest.email
    });

    return NextResponse.json({
      success: true,
      message: emailSent ? 'Confirmation email sent successfully' : 'Booking confirmed (email service unavailable)',
      emailSent
    });
  } catch (error) {
    console.error('Send confirmation email error:', error);
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    );
  }
}
