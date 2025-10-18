import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');

    if (!checkIn || !checkOut) {
      return NextResponse.json(
        { success: false, error: 'checkIn and checkOut dates are required' },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return NextResponse.json(
        { success: false, error: 'checkOut must be after checkIn' },
        { status: 400 }
      );
    }

    // Check if homestay exists
    const homestay = await prisma.homestay.findUnique({
      where: { id },
      select: { id: true, available: true },
    });

    if (!homestay || !homestay.available) {
      return NextResponse.json(
        { success: false, error: 'Homestay not found' },
        { status: 404 }
      );
    }

    // Check for conflicting bookings
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        homestayId: id,
        status: {
          in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'],
        },
        OR: [
          // Booking starts during the requested period
          {
            AND: [
              { checkIn: { gte: checkInDate } },
              { checkIn: { lt: checkOutDate } },
            ],
          },
          // Booking ends during the requested period
          {
            AND: [
              { checkOut: { gt: checkInDate } },
              { checkOut: { lte: checkOutDate } },
            ],
          },
          // Booking completely encompasses the requested period
          {
            AND: [
              { checkIn: { lte: checkInDate } },
              { checkOut: { gte: checkOutDate } },
            ],
          },
        ],
      },
    });

    const isAvailable = conflictingBookings.length === 0;

    return NextResponse.json({
      success: true,
      data: {
        available: isAvailable,
        checkIn,
        checkOut,
        conflictingBookings: conflictingBookings.length,
      },
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}
