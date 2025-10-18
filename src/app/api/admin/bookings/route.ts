import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db';
import { UserRole, BookingStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/bookings
 * Fetch all bookings with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin permissions
    if (session.user?.role !== UserRole.ADMIN && session.user?.role !== UserRole.VILLAGE_COUNCIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const homestayId = searchParams.get('homestayId');

    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (startDate) {
      where.checkIn = { gte: new Date(startDate) };
    }

    if (endDate) {
      if (where.checkIn) {
        where.checkIn.lte = new Date(endDate);
      } else {
        where.checkIn = { lte: new Date(endDate) };
      }
    }

    if (homestayId) {
      where.homestayId = homestayId;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        homestay: {
          select: {
            id: true,
            name: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            method: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/bookings
 * Update booking status
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin permissions
    if (session.user?.role !== UserRole.ADMIN && session.user?.role !== UserRole.VILLAGE_COUNCIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { bookingId, status, notes } = body;

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: bookingId, status' },
        { status: 400 }
      );
    }

    // Validate status
    if (!Object.values(BookingStatus).includes(status)) {
      return NextResponse.json(
        { error: 'Invalid booking status' },
        { status: 400 }
      );
    }

    // Get existing booking to merge pricing data
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { pricing: true },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { 
        status,
        // Add notes to pricing JSON if provided
        ...(notes && {
          pricing: {
            ...(typeof existingBooking.pricing === 'object' && existingBooking.pricing ? existingBooking.pricing : {}),
            adminNotes: notes,
            updatedBy: session.user.email,
            updatedAt: new Date().toISOString(),
          }
        })
      },
      include: {
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        homestay: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
