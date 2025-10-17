import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET() {
  try {
    const featuredHomestays = await prisma.homestay.findMany({
      where: {
        featured: true,
        status: 'APPROVED',
      },
      take: 6,
      include: {
        images: {
          take: 1,
          orderBy: {
            isPrimary: 'desc',
          },
        },
        amenities: true,
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

      return {
        id: homestay.id,
        name: homestay.name,
        description: homestay.description,
        location: homestay.location,
        pricePerNight: homestay.pricePerNight,
        maxGuests: homestay.maxGuests,
        image: homestay.images[0]?.url || '/placeholder-homestay.jpg',
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: homestay.reviews.length,
        amenities: homestay.amenities.map((a) => a.name),
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
