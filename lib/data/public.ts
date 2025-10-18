/**
 * Server-side data fetching functions for public data
 * These functions can be imported directly in server components
 * to avoid fetch calls during build time
 */

import prisma from '@/lib/db/prisma';

/**
 * Check if we're in build time and should skip database queries
 */
function shouldSkipDatabase(): boolean {
  return (
    process.env.SKIP_DB_DURING_BUILD === 'true' ||
    process.env.DATABASE_URL === 'postgresql://dummy:dummy@localhost:5432/dummy' ||
    (process.env.CI === 'true' && !process.env.DATABASE_URL)
  );
}

/**
 * Fetch featured homestays
 */
export async function getFeaturedHomestaysData() {
  if (shouldSkipDatabase()) {
    return { success: true, data: [] };
  }

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

    return {
      success: true,
      data: homestaysWithRatings,
    };
  } catch (error) {
    console.error('Error fetching featured homestays:', error);
    return {
      success: false,
      data: [],
    };
  }
}

/**
 * Fetch featured products
 */
export async function getFeaturedProductsData() {
  if (shouldSkipDatabase()) {
    return { success: true, data: [] };
  }

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

    return {
      success: true,
      data: productsWithDetails,
    };
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return {
      success: false,
      data: [],
    };
  }
}

/**
 * Fetch village statistics
 */
export async function getVillageStatsData() {
  if (shouldSkipDatabase()) {
    return { success: true, data: null };
  }

  try {
    // Get real-time statistics from the database
    const [
      totalHomestays,
      totalProducts,
      totalBookings,
      totalUsers,
      totalReviews,
      avgHomestayRating,
    ] = await Promise.all([
      prisma.homestay.count({
        where: {
          available: true,
        },
      }),
      prisma.product.count({
        where: {
          active: true,
        },
      }),
      prisma.booking.count({
        where: {
          status: {
            in: ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'],
          },
        },
      }),
      prisma.user.count(),
      prisma.review.count(),
      prisma.review.aggregate({
        _avg: {
          rating: true,
        },
        where: {
          homestayId: {
            not: null,
          },
        },
      }),
    ]);

    // Calculate carbon credits offset
    const carbonCredits = await prisma.carbonCredit.aggregate({
      _sum: {
        balance: true,
      },
    });

    const totalCarbonOffset = carbonCredits._sum.balance || 0;
    const co2OffsetKg = Number(totalCarbonOffset) * 0.1; // Each credit = 0.1 kg CO2

    const stats = {
      homestays: {
        total: totalHomestays,
        label: 'Homestays Available',
      },
      products: {
        total: totalProducts,
        label: 'Local Products',
      },
      bookings: {
        total: totalBookings,
        label: 'Happy Guests',
      },
      users: {
        total: totalUsers,
        label: 'Community Members',
      },
      reviews: {
        total: totalReviews,
        avgRating: Math.round((avgHomestayRating._avg.rating || 0) * 10) / 10,
        label: 'Guest Reviews',
      },
      carbonOffset: {
        total: Math.round(co2OffsetKg * 10) / 10,
        label: 'CO₂ Offset (kg)',
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
    };
  }
}
