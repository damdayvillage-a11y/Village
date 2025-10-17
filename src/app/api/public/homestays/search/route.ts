import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse search parameters
    const query = searchParams.get('q');
    const location = searchParams.get('location');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const amenities = searchParams.get('amenities');
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isApproved: true,
    };

    // Full-text search
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } },
      ];
    }

    // Location filter
    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive',
      };
    }

    // Price filter
    if (priceMin || priceMax) {
      where.pricePerNight = {};
      if (priceMin) where.pricePerNight.gte = parseFloat(priceMin);
      if (priceMax) where.pricePerNight.lte = parseFloat(priceMax);
    }

    // Guest capacity filter
    if (guests) {
      where.maxGuests = {
        gte: parseInt(guests),
      };
    }

    // Amenities filter
    if (amenities) {
      const amenityList = amenities.split(',').map(a => a.trim());
      where.amenities = {
        hasEvery: amenityList,
      };
    }

    // Build orderBy
    let orderBy: any = {};
    switch (sortBy) {
      case 'price_asc':
        orderBy = { pricePerNight: 'asc' };
        break;
      case 'price_desc':
        orderBy = { pricePerNight: 'desc' };
        break;
      case 'relevance':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    // Fetch homestays
    let homestays = await prisma.homestay.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
        bookings: checkIn && checkOut ? {
          where: {
            status: {
              in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'],
            },
          },
          select: {
            checkInDate: true,
            checkOutDate: true,
          },
        } : false,
      },
    });

    // Filter by date availability if provided
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      homestays = homestays.filter((homestay: any) => {
        if (!homestay.bookings) return true;
        
        const hasConflict = homestay.bookings.some((booking: any) => {
          return (
            (booking.checkInDate >= checkInDate && booking.checkInDate < checkOutDate) ||
            (booking.checkOutDate > checkInDate && booking.checkOutDate <= checkOutDate) ||
            (booking.checkInDate <= checkInDate && booking.checkOutDate >= checkOutDate)
          );
        });
        
        return !hasConflict;
      });
    }

    // Calculate total after date filtering
    const total = homestays.length;

    // Calculate average ratings and format response
    const homestaysWithRatings = homestays.map((homestay: any) => {
      const ratings = homestay.reviews.map((r: any) => r.rating);
      const averageRating = ratings.length > 0
        ? ratings.reduce((sum: number, r: number) => sum + r, 0) / ratings.length
        : 0;

      // Remove bookings from response
      const { bookings, reviews, ...rest } = homestay;

      return {
        ...rest,
        primaryImage: homestay.images?.[0] || '/placeholder-homestay.jpg',
        averageRating: parseFloat(averageRating.toFixed(1)),
        reviewCount: reviews.length,
      };
    });

    return NextResponse.json({
      success: true,
      data: homestaysWithRatings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      filters: {
        query,
        location,
        checkIn,
        checkOut,
        guests,
        priceMin,
        priceMax,
        amenities,
      },
    });
  } catch (error) {
    console.error('Error searching homestays:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search homestays' },
      { status: 500 }
    );
  }
}
