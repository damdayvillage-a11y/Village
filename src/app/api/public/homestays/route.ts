import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

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
      isApproved: true,
    };

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

    // Amenities filter (AND logic)
    if (amenities) {
      const amenityList = amenities.split(',').map(a => a.trim());
      where.amenities = {
        hasEvery: amenityList,
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
        orderBy = { pricePerNight: 'asc' };
        break;
      case 'price_desc':
        orderBy = { pricePerNight: 'desc' };
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

      return {
        id: homestay.id,
        name: homestay.name,
        description: homestay.description,
        location: homestay.location,
        pricePerNight: homestay.pricePerNight,
        maxGuests: homestay.maxGuests,
        bedrooms: homestay.bedrooms,
        bathrooms: homestay.bathrooms,
        images: homestay.images,
        primaryImage: homestay.images?.[0] || '/placeholder-homestay.jpg',
        amenities: homestay.amenities,
        averageRating: parseFloat(averageRating.toFixed(1)),
        reviewCount: homestay.reviews.length,
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
