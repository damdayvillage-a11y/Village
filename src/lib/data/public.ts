/**
 * Public data fetching functions for homepage and public pages
 */

import { prisma } from '@/lib/db';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Mock data for demo/development when database is not available
const MOCK_HOMESTAYS = [
  {
    id: '1',
    name: 'Mountain View Cottage',
    description: 'Experience breathtaking Himalayan views from this cozy cottage with traditional architecture.',
    location: 'Upper Damday',
    pricePerNight: 2500,
    maxGuests: 4,
    image: '/placeholder-homestay.jpg',
    rating: 4.8,
    reviewCount: 24,
    amenities: ['WiFi', 'Hot Water', 'Mountain View', 'Traditional Kitchen'],
  },
  {
    id: '2',
    name: 'Himalayan Retreat',
    description: 'Peaceful retreat nestled in the mountains with organic farm-to-table meals.',
    location: 'Central Damday',
    pricePerNight: 3000,
    maxGuests: 6,
    image: '/placeholder-homestay.jpg',
    rating: 4.9,
    reviewCount: 18,
    amenities: ['Organic Meals', 'Garden', 'Solar Power', 'Valley View'],
  },
  {
    id: '3',
    name: 'Valley House',
    description: 'Spacious family home with modern amenities and stunning valley views.',
    location: 'Lower Damday',
    pricePerNight: 2000,
    maxGuests: 5,
    image: '/placeholder-homestay.jpg',
    rating: 4.7,
    reviewCount: 31,
    amenities: ['WiFi', 'Parking', 'Fireplace', 'Terrace'],
  },
];

const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Organic Honey',
    description: 'Pure Himalayan honey harvested from local bee farms',
    price: 450,
    stock: 25,
    inStock: true,
    image: '/placeholder-product.jpg',
    category: 'Food',
    locallySourced: true,
    carbonFootprint: 0.5,
  },
  {
    id: '2',
    name: 'Handwoven Shawl',
    description: 'Traditional Kumaoni wool shawl, handcrafted by local artisans',
    price: 1200,
    stock: 15,
    inStock: true,
    image: '/placeholder-product.jpg',
    category: 'Handicrafts',
    locallySourced: true,
    carbonFootprint: 1.2,
  },
  {
    id: '3',
    name: 'Herbal Tea Mix',
    description: 'Aromatic blend of mountain herbs',
    price: 250,
    stock: 50,
    inStock: true,
    image: '/placeholder-product.jpg',
    category: 'Food',
    locallySourced: true,
    carbonFootprint: 0.3,
  },
  {
    id: '4',
    name: 'Wooden Crafts',
    description: 'Hand-carved decorative items from local wood',
    price: 800,
    stock: 12,
    inStock: true,
    image: '/placeholder-product.jpg',
    category: 'Handicrafts',
    locallySourced: true,
    carbonFootprint: 0.8,
  },
];

/**
 * Get featured homestays for homepage display
 */
export async function getFeaturedHomestaysData(): Promise<ApiResponse<any[]>> {
  try {
    // Try to fetch from database
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
      data: formattedHomestays.length > 0 ? formattedHomestays : MOCK_HOMESTAYS,
    };
  } catch (error) {
    console.error('Error fetching featured homestays, using mock data:', error);
    // Return mock data if database is not available
    return {
      success: true,
      data: MOCK_HOMESTAYS,
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
      data: formattedProducts.length > 0 ? formattedProducts : MOCK_PRODUCTS,
    };
  } catch (error) {
    console.error('Error fetching featured products, using mock data:', error);
    // Return mock data if database is not available
    return {
      success: true,
      data: MOCK_PRODUCTS,
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
    console.error('Error fetching village stats, using mock data:', error);
    // Return mock data if database is not available
    return {
      success: true,
      data: {
        homestays: {
          total: 12,
          label: 'Total Homestays',
        },
        products: {
          total: 45,
          label: 'Total Products',
        },
        bookings: {
          total: 238,
          label: 'Total Bookings',
        },
        users: {
          total: 156,
          label: 'Registered Users',
        },
        reviews: {
          total: 89,
          label: 'Reviews & Ratings',
          avgRating: 4.7,
        },
        carbonOffset: {
          total: 12500,
          label: 'Carbon Offset (kg CO₂)',
        },
      },
    };
  }
}
