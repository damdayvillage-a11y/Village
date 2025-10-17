import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const homestay = await prisma.homestay.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
            createdAt: true,
          },
        },
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!homestay || !homestay.available) {
      return NextResponse.json(
        { success: false, error: 'Homestay not found' },
        { status: 404 }
      );
    }

    // Calculate average rating
    const ratings = homestay.reviews.map((r) => r.rating);
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : 0;

    // Parse photos from JSON field
    const photos = Array.isArray(homestay.photos) ? homestay.photos : [];
    const amenitiesArray = Array.isArray(homestay.amenities) ? homestay.amenities : [];

    // Get related homestays (same village)
    const relatedHomestays = await prisma.homestay.findMany({
      where: {
        villageId: homestay.villageId,
        id: { not: id },
        available: true,
      },
      take: 4,
      select: {
        id: true,
        name: true,
        address: true,
        basePrice: true,
        photos: true,
      },
    });

    const response = {
      id: homestay.id,
      name: homestay.name,
      description: homestay.description,
      location: homestay.address,
      pricePerNight: homestay.basePrice,
      maxGuests: homestay.maxGuests,
      rooms: homestay.rooms,
      images: photos,
      amenities: amenitiesArray,
      averageRating: parseFloat(averageRating.toFixed(1)),
      reviewCount: homestay.reviews.length,
      latitude: homestay.latitude,
      longitude: homestay.longitude,
      host: {
        id: homestay.owner.id,
        name: homestay.owner.name || 'Host',
        avatar: homestay.owner.image || '/default-avatar.png',
        memberSince: homestay.owner.createdAt.toISOString().split('T')[0],
      },
      reviews: homestay.reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt.toISOString(),
        user: {
          name: review.user.name || 'Anonymous',
          avatar: review.user.image || '/default-avatar.png',
        },
      })),
      relatedHomestays: relatedHomestays.map((h) => {
        const hPhotos = Array.isArray(h.photos) ? h.photos : [];
        return {
          id: h.id,
          name: h.name,
          location: h.address,
          pricePerNight: h.basePrice,
          primaryImage: hPhotos[0] || '/placeholder-homestay.jpg',
        };
      }),
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Error fetching homestay details:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch homestay details' },
      { status: 500 }
    );
  }
}
