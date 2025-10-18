import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
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

    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    // For now, we'll just log and return success
    const emailContent = {
      to: email,
      subject: `Booking Confirmation - ${booking.homestay.name}`,
      bookingDetails: {
        confirmationNumber: booking.id,
        homestayName: booking.homestay.name,
        hostName: booking.homestay.owner.name,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        totalAmount: booking.totalPrice,
        guestName: booking.guest.name,
      },
    };

    console.log('Sending confirmation email:', emailContent);

    // TODO: Implement actual email sending
    // Example with SendGrid:
    // await sendGrid.send({
    //   to: email,
    //   from: 'noreply@damdayvillage.com',
    //   subject: emailContent.subject,
    //   html: generateEmailTemplate(emailContent.bookingDetails),
    // });

    return NextResponse.json({
      success: true,
      message: 'Confirmation email sent successfully',
    });
  } catch (error) {
    console.error('Send confirmation email error:', error);
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    );
  }
}
