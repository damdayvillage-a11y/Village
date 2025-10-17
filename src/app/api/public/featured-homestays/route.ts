import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET() {
  try {
    const featuredHomestays = await prisma.homestay.findMany({
      where: {
        available: true,
      },
      take: 6,
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const homestaysWithRatings = featuredHomestays.map((homestay) => {
      const avgRating =
        homestay.reviews.length > 0
          ? homestay.reviews.reduce((sum, r) => sum + r.rating, 0) / homestay.reviews.length
          : 0;

      // Parse photos from JSON field
      const photos = Array.isArray(homestay.photos) ? homestay.photos : [];
      const amenitiesArray = Array.isArray(homestay.amenities) ? homestay.amenities : [];

      return {
        id: homestay.id,
        name: homestay.name,
        description: homestay.description,
        location: homestay.address,
        pricePerNight: homestay.basePrice,
        maxGuests: homestay.maxGuests,
        image: photos[0] || '/placeholder-homestay.jpg',
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: homestay.reviews.length,
        amenities: amenitiesArray,
      };
    });

    return NextResponse.json({
      success: true,
      data: homestaysWithRatings,
    });
  } catch (error) {
    console.error('Error fetching featured homestays:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch featured homestays',
      },
      { status: 500 }
    );
  }
}
