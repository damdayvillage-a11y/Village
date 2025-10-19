import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
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

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching village stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch village statistics',
      },
      { status: 500 }
    );
  }
}
