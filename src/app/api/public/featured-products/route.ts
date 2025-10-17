import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET() {
  try {
    const featuredProducts = await prisma.product.findMany({
      where: {
        featured: true,
        status: 'ACTIVE',
      },
      take: 8,
      include: {
        category: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: [
        {
          trending: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    const productsWithDetails = featuredProducts.map((product) => {
      const avgRating =
        product.reviews.length > 0
          ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
          : 0;

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice,
        stock: product.stock,
        inStock: product.stock > 0,
        image: product.imageUrl || '/placeholder-product.jpg',
        category: product.category?.name || 'Uncategorized',
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: product.reviews.length,
        trending: product.trending,
      };
    });

    return NextResponse.json({
      success: true,
      data: productsWithDetails,
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch featured products',
      },
      { status: 500 }
    );
  }
}
