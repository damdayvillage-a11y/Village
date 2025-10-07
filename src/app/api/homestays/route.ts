import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Sample homestays data for the marketplace
    const sampleHomestays = [
      {
        id: '1',
        name: 'Traditional Himalayan Cottage',
        description: 'Experience authentic village life in a traditional stone cottage with modern amenities.',
        basePrice: 2500,
        maxGuests: 4,
        amenities: ['WiFi', 'Hot Water', 'Traditional Fireplace', 'Organic Meals'],
        village: { name: 'Damday Village' },
        rating: 4.8,
        totalBookings: 127,
        images: ['/images/cottage-1.jpg', '/images/cottage-2.jpg']
      },
      {
        id: '2', 
        name: 'Eco-Friendly Mountain Retreat',
        description: 'Sustainable accommodation with solar power and organic farming experience.',
        basePrice: 3000,
        maxGuests: 6,
        amenities: ['Solar Power', 'Organic Farm', 'Mountain Views', 'Yoga Space'],
        village: { name: 'Damday Village' },
        rating: 4.9,
        totalBookings: 89,
        images: ['/images/retreat-1.jpg', '/images/retreat-2.jpg']
      }
    ];

    // Try to fetch from database only if DATABASE_URL is available and not during build
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== 'postgresql://dummy:dummy@localhost:5432/dummy') {
      try {
        const homestays = await prisma.homestay.findMany({
          include: {
            village: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        });

        if (homestays.length > 0) {
          return NextResponse.json({
            homestays: homestays,
            total: homestays.length
          });
        }
      } catch (dbError) {
        console.warn('Database connection failed, using sample data:', dbError);
        // Fall through to return sample data
      }
    }

    return NextResponse.json({
      homestays: sampleHomestays,
      total: sampleHomestays.length
    });

  } catch (error) {
    console.error('Error fetching homestays:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homestays' },
      { status: 500 }
    );
  }
}