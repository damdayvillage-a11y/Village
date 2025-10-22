/**
 * Public data fetching functions for homepage and public pages
 */

import { prisma } from '@/lib/db';
import type { ProjectStatus } from '@prisma/client';

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
        available: true,
      },
      take: 6,
      orderBy: [
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        basePrice: true,
        maxGuests: true,
        photos: true,
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
        location: homestay.address,
        pricePerNight: homestay.basePrice,
        maxGuests: homestay.maxGuests,
        image: Array.isArray(homestay.photos) && homestay.photos.length > 0 
          ? homestay.photos[0] 
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
        active: true,
        stock: {
          gt: 0,
        },
      },
      take: 8,
      orderBy: [
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
  // During build time or when database is unavailable, return mock data immediately
  if (process.env.NODE_ENV === 'production' && process.env.SKIP_DB_AT_BUILD === 'true') {
    return {
      success: true,
      data: getMockVillageStats(),
    };
  }

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
        where: { available: true },
      }).catch(() => 0),
      prisma.product.count({
        where: { active: true },
      }).catch(() => 0),
      prisma.booking.count({
        where: { status: { not: 'CANCELLED' } },
      }).catch(() => 0),
      prisma.user.count().catch(() => 0),
      prisma.review.findMany({
        select: { rating: true },
      }).catch(() => []),
      prisma.carbonCredit.aggregate({
        _sum: { totalEarned: true },
      }).catch(() => ({ _sum: { totalEarned: 0 } })),
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
        total: Math.round(carbonOffset._sum.totalEarned || 0),
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
      data: getMockVillageStats(),
    };
  }
}

function getMockVillageStats() {
  return {
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
  };
}

/**
 * Get village leaders data for homepage display
 */
export async function getVillageLeadersData(): Promise<ApiResponse<any[]>> {
  // During build time or when database is unavailable, return mock data
  if (process.env.NODE_ENV === 'production' && process.env.SKIP_DB_AT_BUILD === 'true') {
    return {
      success: true,
      data: getMockVillageLeaders(),
    };
  }

  try {
    const leaders = await prisma.villageLeader.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        priority: 'asc',
      },
    });

    return {
      success: true,
      data: leaders.length > 0 ? leaders : getMockVillageLeaders(),
    };
  } catch (error) {
    console.error('Error fetching village leaders, using mock data:', error);
    return {
      success: true,
      data: getMockVillageLeaders(),
    };
  }
}

function getMockVillageLeaders() {
  return [
    {
      id: '1',
      name: 'श्री नरेंद्र मोदी',
      position: 'प्रधान मंत्री',
      photo: '/images/leaders/pm.jpg',
      message: null,
      priority: 1,
      isActive: true,
    },
    {
      id: '2',
      name: 'श्री पुष्कर सिंह धामी',
      position: 'मुख्यमंत्री उत्तराखंड',
      photo: '/images/leaders/cm.jpg',
      message: null,
      priority: 2,
      isActive: true,
    },
    {
      id: '3',
      name: 'श्री राजेंद्र सिंह',
      position: 'ग्राम प्रधान',
      photo: '/images/leaders/pradhan.jpg',
      message: 'हमारे गांव में आपका स्वागत है। हम एक स्वच्छ, हरित और आत्मनिर्भर गांव बनाने के लिए प्रतिबद्ध हैं।',
      priority: 3,
      isActive: true,
    },
  ];
}

/**
 * Get projects data for homepage display
 */
export async function getProjectsData(limit: number = 6): Promise<ApiResponse<any>> {
  // During build time or when database is unavailable, return mock data
  if (process.env.NODE_ENV === 'production' && process.env.SKIP_DB_AT_BUILD === 'true') {
    return {
      success: true,
      data: getMockProjects(),
    };
  }

  try {
    const [completed, inProgress, upcoming] = await Promise.all([
      prisma.project.findMany({
        where: {
          status: 'COMPLETED' as ProjectStatus,
        },
        take: 3,
        orderBy: {
          updatedAt: 'desc',
        },
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          fundingGoal: true,
          currentFunding: true,
          startDate: true,
          endDate: true,
          photos: true,
        },
      }).catch(() => []),
      prisma.project.findMany({
        where: {
          status: 'IN_PROGRESS' as ProjectStatus,
        },
        take: 2,
        orderBy: {
          updatedAt: 'desc',
        },
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          fundingGoal: true,
          currentFunding: true,
          startDate: true,
          endDate: true,
          photos: true,
        },
      }).catch(() => []),
      prisma.project.findMany({
        where: {
          status: {
            in: ['PLANNING', 'VOTING', 'FUNDED'] as ProjectStatus[],
          },
        },
        take: 1,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          fundingGoal: true,
          currentFunding: true,
          startDate: true,
          endDate: true,
          photos: true,
        },
      }).catch(() => []),
    ]);

    const projects = {
      completed,
      inProgress,
      upcoming,
    };

    // If no data, return mock data
    const hasData = completed.length > 0 || inProgress.length > 0 || upcoming.length > 0;
    
    return {
      success: true,
      data: hasData ? projects : getMockProjects(),
    };
  } catch (error) {
    console.error('Error fetching projects, using mock data:', error);
    return {
      success: true,
      data: getMockProjects(),
    };
  }
}

function getMockProjects() {
  return {
    completed: [
      {
        id: '1',
        name: 'सोलर पावर ग्रिड',
        description: 'पूरे गांव के लिए 45kW सोलर पावर सिस्टम स्थापित किया गया',
        status: 'COMPLETED',
        fundingGoal: 5000000,
        currentFunding: 5000000,
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        photos: ['/images/projects/solar.jpg'],
      },
      {
        id: '2',
        name: 'जल संरक्षण प्रणाली',
        description: 'वर्षा जल संचयन और जल शोधन प्रणाली',
        status: 'COMPLETED',
        fundingGoal: 2000000,
        currentFunding: 2000000,
        startDate: new Date('2023-06-01'),
        endDate: new Date('2024-03-31'),
        photos: ['/images/projects/water.jpg'],
      },
    ],
    inProgress: [
      {
        id: '3',
        name: 'ऑर्गेनिक फार्मिंग सेंटर',
        description: 'जैविक खेती प्रशिक्षण और उत्पादन केंद्र',
        status: 'IN_PROGRESS',
        fundingGoal: 3000000,
        currentFunding: 1800000,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        photos: ['/images/projects/farming.jpg'],
      },
    ],
    upcoming: [
      {
        id: '4',
        name: 'डिजिटल लर्निंग सेंटर',
        description: 'आधुनिक डिजिटल शिक्षा केंद्र की स्थापना',
        status: 'PLANNING',
        fundingGoal: 4000000,
        currentFunding: 500000,
        startDate: new Date('2025-01-01'),
        endDate: null,
        photos: [],
      },
    ],
  };
}
