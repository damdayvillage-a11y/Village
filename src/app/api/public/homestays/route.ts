import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const location = searchParams.get('location');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const guests = searchParams.get('guests');
    const amenities = searchParams.get('amenities'); // comma-separated
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'recent'; // price_asc, price_desc, rating_desc, recent
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      available: true,
    };

    // Location filter (using address field)
    if (location) {
      where.address = {
        contains: location,
        mode: 'insensitive',
      };
    }

    // Price filter (using basePrice)
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

    // Full-text search
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
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
      case 'rating_desc':
        orderBy = { createdAt: 'desc' }; // Will calculate rating separately
        break;
      case 'recent':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    // Fetch homestays with reviews for rating calculation
    const [homestays, total] = await Promise.all([
      prisma.homestay.findMany({
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
        },
      }),
      prisma.homestay.count({ where }),
    ]);

    // Calculate average ratings
    const homestaysWithRatings = homestays.map((homestay) => {
      const ratings = homestay.reviews.map((r) => r.rating);
      const averageRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
        : 0;

      // Parse photos and amenities from JSON
      const photos = Array.isArray(homestay.photos) ? homestay.photos : [];
      const amenitiesArray = Array.isArray(homestay.amenities) ? homestay.amenities : [];

      return {
        id: homestay.id,
        name: homestay.name,
        description: homestay.description,
        location: homestay.address,
        pricePerNight: homestay.basePrice,
        maxGuests: homestay.maxGuests,
        rooms: homestay.rooms,
        images: photos,
        primaryImage: photos[0] || '/placeholder-homestay.jpg',
        amenities: amenitiesArray,
        averageRating: parseFloat(averageRating.toFixed(1)),
        reviewCount: homestay.reviews.length,
        latitude: homestay.latitude,
        longitude: homestay.longitude,
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
    });
  } catch (error) {
    console.error('Error fetching homestays:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch homestays' },
      { status: 500 }
    );
  }
}
