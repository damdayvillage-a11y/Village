/**
 * Public data fetching functions for homepage and public pages
 */

import { prisma } from '@/lib/db';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Get featured homestays for homepage display
 */
export async function getFeaturedHomestaysData(): Promise<ApiResponse<any[]>> {
  try {
    const homestays = await prisma.homestay.findMany({
      where: {
        status: 'APPROVED',
        isActive: true,
      },
      take: 6,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        name: true,
        description: true,
        location: true,
        pricePerNight: true,
        maxGuests: true,
        images: true,
        amenities: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    const formattedHomestays = homestays.map((homestay) => {
      const reviews = homestay.reviews || [];
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      return {
        id: homestay.id,
        name: homestay.name,
        description: homestay.description,
        location: homestay.location,
        pricePerNight: homestay.pricePerNight,
        maxGuests: homestay.maxGuests,
        image: Array.isArray(homestay.images) && homestay.images.length > 0 
          ? homestay.images[0] 
          : '/placeholder-homestay.jpg',
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
        amenities: homestay.amenities || [],
      };
    });

    return {
      success: true,
      data: formattedHomestays,
    };
  } catch (error) {
    console.error('Error fetching featured homestays:', error);
    return {
      success: false,
      data: [],
      error: 'Failed to fetch featured homestays',
    };
  }
}

/**
 * Get featured products for homepage display
 */
export async function getFeaturedProductsData(): Promise<ApiResponse<any[]>> {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: 'APPROVED',
        isActive: true,
        stock: {
          gt: 0,
        },
      },
      take: 8,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        images: true,
        category: true,
        locallySourced: true,
        carbonFootprint: true,
      },
    });

    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      inStock: product.stock > 0,
      image: Array.isArray(product.images) && product.images.length > 0 
        ? product.images[0] 
        : '/placeholder-product.jpg',
      category: product.category,
      locallySourced: product.locallySourced || false,
      carbonFootprint: product.carbonFootprint || 0,
    }));

    return {
      success: true,
      data: formattedProducts,
    };
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return {
      success: false,
      data: [],
      error: 'Failed to fetch featured products',
    };
  }
}

/**
 * Get village statistics for homepage display
 */
export async function getVillageStatsData(): Promise<ApiResponse<any>> {
  try {
    const [
      homestaysCount,
      productsCount,
      bookingsCount,
      usersCount,
      reviews,
      carbonOffset,
    ] = await Promise.all([
      prisma.homestay.count({
        where: { status: 'APPROVED', isActive: true },
      }),
      prisma.product.count({
        where: { status: 'APPROVED', isActive: true },
      }),
      prisma.booking.count({
        where: { status: { not: 'CANCELLED' } },
      }),
      prisma.user.count(),
      prisma.review.findMany({
        select: { rating: true },
      }),
      prisma.carbonCredit.aggregate({
        _sum: { amount: true },
      }),
    ]);

    const avgRating = reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : 0;

    const stats = {
      homestays: {
        total: homestaysCount,
        label: 'Total Homestays',
      },
      products: {
        total: productsCount,
        label: 'Total Products',
      },
      bookings: {
        total: bookingsCount,
        label: 'Total Bookings',
      },
      users: {
        total: usersCount,
        label: 'Registered Users',
      },
      reviews: {
        total: reviews.length,
        label: 'Reviews & Ratings',
        avgRating,
      },
      carbonOffset: {
        total: Math.round(carbonOffset._sum.amount || 0),
        label: 'Carbon Offset (kg CO₂)',
      },
    };

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error('Error fetching village stats:', error);
    return {
      success: false,
      data: null,
      error: 'Failed to fetch village statistics',
    };
  }
}
