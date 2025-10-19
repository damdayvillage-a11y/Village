import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/bookings/manage - List bookings with filters
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'HOST')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const homestayId = searchParams.get('homestayId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '20');

    const where: any = {};

    if (homestayId) {
      where.homestayId = homestayId;
    }

    if (status) {
      where.status = status;
    }

    if (startDate) {
      where.checkIn = { gte: new Date(startDate) };
    }

    if (endDate) {
      where.checkOut = { lte: new Date(endDate) };
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          homestay: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
          guest: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// POST /api/admin/bookings/manage - Create manual booking
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'HOST')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { homestayId, guestId, checkIn, checkOut, guests, pricing, status, notes } = body;

    if (!homestayId || !guestId || !checkIn || !checkOut || !guests) {
      return NextResponse.json(
        { error: 'Homestay ID, guest ID, check-in, check-out, and guest count are required' },
        { status: 400 }
      );
    }

    // Check for conflicts
    const conflicts = await prisma.booking.findMany({
      where: {
        homestayId,
        status: {
          in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'],
        },
        OR: [
          {
            AND: [
              { checkIn: { lte: new Date(checkIn) } },
              { checkOut: { gt: new Date(checkIn) } },
            ],
          },
          {
            AND: [
              { checkIn: { lt: new Date(checkOut) } },
              { checkOut: { gte: new Date(checkOut) } },
            ],
          },
          {
            AND: [
              { checkIn: { gte: new Date(checkIn) } },
              { checkOut: { lte: new Date(checkOut) } },
            ],
          },
        ],
      },
    });

    if (conflicts.length > 0) {
      return NextResponse.json(
        { error: 'Booking conflicts with existing reservations' },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        homestayId,
        guestId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests,
        pricing: pricing || { total: 0 },
        status: status || 'CONFIRMED',
      },
      include: {
        homestay: {
          select: {
            id: true,
            name: true,
          },
        },
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

// PATCH /api/admin/bookings/manage - Update booking
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'HOST')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    // If dates are being updated, check for conflicts
    if (updates.checkIn || updates.checkOut) {
      const booking = await prisma.booking.findUnique({
        where: { id },
      });

      if (!booking) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      }

      const newCheckIn = updates.checkIn ? new Date(updates.checkIn) : booking.checkIn;
      const newCheckOut = updates.checkOut ? new Date(updates.checkOut) : booking.checkOut;

      const conflicts = await prisma.booking.findMany({
        where: {
          id: { not: id },
          homestayId: booking.homestayId,
          status: {
            in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'],
          },
          OR: [
            {
              AND: [
                { checkIn: { lte: newCheckIn } },
                { checkOut: { gt: newCheckIn } },
              ],
            },
            {
              AND: [
                { checkIn: { lt: newCheckOut } },
                { checkOut: { gte: newCheckOut } },
              ],
            },
            {
              AND: [
                { checkIn: { gte: newCheckIn } },
                { checkOut: { lte: newCheckOut } },
              ],
            },
          ],
        },
      });

      if (conflicts.length > 0) {
        return NextResponse.json(
          { error: 'Updated dates conflict with existing reservations' },
          { status: 400 }
        );
      }
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updates,
      include: {
        homestay: {
          select: {
            id: true,
            name: true,
          },
        },
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

// DELETE /api/admin/bookings/manage - Cancel booking
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const refund = searchParams.get('refund') === 'true';

    if (!id) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    // Update status instead of hard delete
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
    });

    // TODO: Process refund if requested
    // This would integrate with payment processor

    return NextResponse.json({
      message: 'Booking cancelled successfully',
      refund: refund ? 'Refund will be processed' : 'No refund requested',
      booking,
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 });
  }
}
