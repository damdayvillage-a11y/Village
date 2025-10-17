import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET() {
  try {
    // Get testimonials from reviews that are featured and have high ratings
    const testimonials = await prisma.review.findMany({
      where: {
        rating: {
          gte: 4,
        },
        featured: true,
      },
      take: 6,
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        product: {
          select: {
            name: true,
          },
        },
        homestay: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedTestimonials = testimonials.map((review) => ({
      id: review.id,
      userName: review.user.name || 'Anonymous',
      userImage: review.user.image || '/default-avatar.png',
      rating: review.rating,
      comment: review.comment,
      itemName: review.product?.name || review.homestay?.name || 'Village Experience',
      itemType: review.productId ? 'product' : review.homestayId ? 'homestay' : 'general',
      date: review.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: formattedTestimonials,
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch testimonials',
      },
      { status: 500 }
    );
  }
}
