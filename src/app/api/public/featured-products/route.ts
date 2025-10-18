import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const featuredProducts = await prisma.product.findMany({
      where: {
        active: true,
        stock: {
          gt: 0,
        },
      },
      take: 8,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const productsWithDetails = featuredProducts.map((product) => {
      // Parse images from JSON field
      const images = Array.isArray(product.images) ? product.images : [];

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        inStock: product.stock > 0 || product.unlimited,
        image: images[0] || '/placeholder-product.jpg',
        category: product.category || 'Uncategorized',
        locallySourced: product.locallySourced,
        carbonFootprint: product.carbonFootprint,
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
