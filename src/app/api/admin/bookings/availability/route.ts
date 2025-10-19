import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/bookings/availability - Check availability for dates
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'HOST')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const homestayId = searchParams.get('homestayId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!homestayId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Homestay ID, start date, and end date are required' },
        { status: 400 }
      );
    }

    const availability = await prisma.availability.findMany({
      where: {
        homestayId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      orderBy: { date: 'asc' },
    });

    // Also check for existing bookings
    const bookings = await prisma.booking.findMany({
      where: {
        homestayId,
        status: {
          in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'],
        },
        OR: [
          {
            AND: [
              { checkIn: { lte: new Date(startDate) } },
              { checkOut: { gte: new Date(startDate) } },
            ],
          },
          {
            AND: [
              { checkIn: { lte: new Date(endDate) } },
              { checkOut: { gte: new Date(endDate) } },
            ],
          },
          {
            AND: [
              { checkIn: { gte: new Date(startDate) } },
              { checkOut: { lte: new Date(endDate) } },
            ],
          },
        ],
      },
      select: {
        checkIn: true,
        checkOut: true,
      },
    });

    return NextResponse.json({ availability, bookings });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json({ error: 'Failed to check availability' }, { status: 500 });
  }
}

// POST /api/admin/bookings/availability - Set availability
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'HOST')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { homestayId, date, isAvailable, priceOverride, minimumStay, notes } = body;

    if (!homestayId || !date) {
      return NextResponse.json(
        { error: 'Homestay ID and date are required' },
        { status: 400 }
      );
    }

    // Upsert availability record
    const availability = await prisma.availability.upsert({
      where: {
        homestayId_date: {
          homestayId,
          date: new Date(date),
        },
      },
      update: {
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        priceOverride,
        minimumStay,
        notes,
      },
      create: {
        homestayId,
        date: new Date(date),
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        priceOverride,
        minimumStay,
        notes,
      },
    });

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Error setting availability:', error);
    return NextResponse.json({ error: 'Failed to set availability' }, { status: 500 });
  }
}

// PATCH /api/admin/bookings/availability - Update date range availability
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'HOST')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { homestayId, startDate, endDate, isAvailable, priceOverride, minimumStay, notes } = body;

    if (!homestayId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Homestay ID, start date, and end date are required' },
        { status: 400 }
      );
    }

    // Generate dates in range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates = [];
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }

    // Upsert availability for each date
    const operations = dates.map(date =>
      prisma.availability.upsert({
        where: {
          homestayId_date: {
            homestayId,
            date,
          },
        },
        update: {
          isAvailable: isAvailable !== undefined ? isAvailable : true,
          priceOverride,
          minimumStay,
          notes,
        },
        create: {
          homestayId,
          date,
          isAvailable: isAvailable !== undefined ? isAvailable : true,
          priceOverride,
          minimumStay,
          notes,
        },
      })
    );

    const results = await Promise.all(operations);

    return NextResponse.json({
      message: `Updated availability for ${results.length} dates`,
      count: results.length,
    });
  } catch (error) {
    console.error('Error updating availability:', error);
    return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 });
  }
}

// DELETE /api/admin/bookings/availability - Remove availability record
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Availability ID is required' }, { status: 400 });
    }

    await prisma.availability.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Availability record deleted successfully' });
  } catch (error) {
    console.error('Error deleting availability:', error);
    return NextResponse.json({ error: 'Failed to delete availability' }, { status: 500 });
  }
}
