import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

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
      available: true,
    };

    // Full-text search
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { address: { contains: query, mode: 'insensitive' } },
      ];
    }

    // Location filter
    if (location) {
      where.address = {
        contains: location,
        mode: 'insensitive',
      };
    }

    // Price filter
    if (priceMin || priceMax) {
      where.basePrice = {};
      if (priceMin) where.basePrice.gte = parseFloat(priceMin);
      if (priceMax) where.basePrice.lte = parseFloat(priceMax);
    }

    // Guest capacity filter
    if (guests) {
      where.maxGuests = {
        gte: parseInt(guests),
      };
    }

    // Build orderBy
    let orderBy: any = {};
    switch (sortBy) {
      case 'price_asc':
        orderBy = { basePrice: 'asc' };
        break;
      case 'price_desc':
        orderBy = { basePrice: 'desc' };
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
            checkIn: true,
            checkOut: true,
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
            (booking.checkIn >= checkInDate && booking.checkIn < checkOutDate) ||
            (booking.checkOut > checkInDate && booking.checkOut <= checkOutDate) ||
            (booking.checkIn <= checkInDate && booking.checkOut >= checkOutDate)
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

      // Parse photos and amenities from JSON
      const photos = Array.isArray(homestay.photos) ? homestay.photos : [];
      const amenitiesArray = Array.isArray(homestay.amenities) ? homestay.amenities : [];

      // Remove bookings from response
      const { bookings, reviews, ...rest } = homestay;

      return {
        ...rest,
        location: homestay.address,
        pricePerNight: homestay.basePrice,
        images: photos,
        primaryImage: photos[0] || '/placeholder-homestay.jpg',
        amenities: amenitiesArray,
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
