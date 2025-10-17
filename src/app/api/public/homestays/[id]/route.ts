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
        host: {
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

    if (!homestay || !homestay.isApproved) {
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

    // Get related homestays (same location)
    const relatedHomestays = await prisma.homestay.findMany({
      where: {
        location: homestay.location,
        id: { not: id },
        isApproved: true,
      },
      take: 4,
      select: {
        id: true,
        name: true,
        location: true,
        pricePerNight: true,
        images: true,
      },
    });

    const response = {
      id: homestay.id,
      name: homestay.name,
      description: homestay.description,
      location: homestay.location,
      pricePerNight: homestay.pricePerNight,
      maxGuests: homestay.maxGuests,
      bedrooms: homestay.bedrooms,
      bathrooms: homestay.bathrooms,
      images: homestay.images,
      amenities: homestay.amenities,
      houseRules: homestay.houseRules,
      averageRating: parseFloat(averageRating.toFixed(1)),
      reviewCount: homestay.reviews.length,
      host: {
        id: homestay.host.id,
        name: homestay.host.name || 'Host',
        avatar: homestay.host.image || '/default-avatar.png',
        memberSince: homestay.host.createdAt.toISOString().split('T')[0],
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
      relatedHomestays: relatedHomestays.map((h) => ({
        id: h.id,
        name: h.name,
        location: h.location,
        pricePerNight: h.pricePerNight,
        primaryImage: h.images?.[0] || '/placeholder-homestay.jpg',
      })),
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
