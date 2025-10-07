import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const amenities = searchParams.get('amenities');

    // Build where clause based on filters
    const where: any = {
      isActive: true,
    };

    if (location) {
      where.OR = [
        { village: { name: { contains: location, mode: 'insensitive' } } },
        { title: { contains: location, mode: 'insensitive' } },
        { description: { contains: location, mode: 'insensitive' } },
      ];
    }

    if (guests) {
      where.maxGuests = { gte: parseInt(guests) };
    }

    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = parseFloat(minPrice);
      if (maxPrice) where.basePrice.lte = parseFloat(maxPrice);
    }

    if (amenities) {
      const amenityList = amenities.split(',');
      where.amenities = {
        hasEvery: amenityList,
      };
    }

    // Get homestays with availability check if dates provided
    let homestays;
    if (checkIn && checkOut) {
      homestays = await prisma.homestay.findMany({
        where: {
          ...where,
          // Check availability by ensuring no overlapping bookings
          NOT: {
            bookings: {
              some: {
                AND: [
                  { checkIn: { lt: new Date(checkOut) } },
                  { checkOut: { gt: new Date(checkIn) } },
                  { status: { in: ['CONFIRMED', 'CHECKED_IN'] } },
                ],
              },
            },
          },
        },
        include: {
          village: true,
          host: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
          _count: {
            select: {
              bookings: true,
              reviews: true,
            },
          },
        },
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' },
        ],
      });
    } else {
      homestays = await prisma.homestay.findMany({
        where,
        include: {
          village: true,
          host: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
          _count: {
            select: {
              bookings: true,
              reviews: true,
            },
          },
        },
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' },
        ],
      });
    }

    // Calculate average ratings and format response
    const formattedHomestays = homestays.map((homestay) => ({
      id: homestay.id,
      title: homestay.title,
      description: homestay.description,
      basePrice: homestay.basePrice,
      currency: homestay.currency,
      maxGuests: homestay.maxGuests,
      bedrooms: homestay.bedrooms,
      bathrooms: homestay.bathrooms,
      amenities: homestay.amenities,
      images: homestay.images,
      featured: homestay.featured,
      location: {
        village: homestay.village?.name,
        address: homestay.address,
        coordinates: homestay.coordinates,
      },
      host: homestay.host,
      stats: {
        totalBookings: homestay._count.bookings,
        totalReviews: homestay._count.reviews,
        averageRating: homestay.reviews.length > 0
          ? homestay.reviews.reduce((sum, review) => sum + review.rating, 0) / homestay.reviews.length
          : 0,
      },
      availability: {
        available: checkIn && checkOut ? true : null,
        checkIn: checkIn || null,
        checkOut: checkOut || null,
      },
    }));

    return NextResponse.json({
      homestays: formattedHomestays,
      total: formattedHomestays.length,
      filters: {
        location,
        checkIn,
        checkOut,
        guests,
        minPrice,
        maxPrice,
        amenities,
      },
    });

  } catch (error) {
    console.error('Error fetching homestays:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homestays' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      address,
      coordinates,
      basePrice,
      currency = 'INR',
      maxGuests,
      bedrooms,
      bathrooms,
      amenities,
      images,
      villageId,
      hostId,
      policies,
    } = body;

    // Validate required fields
    if (!title || !description || !basePrice || !maxGuests || !hostId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create homestay
    const homestay = await prisma.homestay.create({
      data: {
        title,
        description,
        address,
        coordinates,
        basePrice: parseFloat(basePrice),
        currency,
        maxGuests: parseInt(maxGuests),
        bedrooms: parseInt(bedrooms || 1),
        bathrooms: parseInt(bathrooms || 1),
        amenities: amenities || [],
        images: images || [],
        villageId,
        hostId,
        policies: policies || {},
        isActive: true,
      },
      include: {
        village: true,
        host: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(homestay, { status: 201 });

  } catch (error) {
    console.error('Error creating homestay:', error);
    return NextResponse.json(
      { error: 'Failed to create homestay' },
      { status: 500 }
    );
  }
}