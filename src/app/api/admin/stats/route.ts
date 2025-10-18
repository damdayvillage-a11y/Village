import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { UserRole } from '@prisma/client';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get session with error handling
    let session;
    try {
      session = await getServerSession(authOptions);
    } catch (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ 
        error: 'Authentication service unavailable',
        details: 'Unable to verify session. Please try again.' 
      }, { status: 503 });
    }
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has admin permissions
    if (session.user?.role !== UserRole.ADMIN && session.user?.role !== UserRole.VILLAGE_COUNCIL) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // ✅ ACTUAL DATABASE QUERIES - No mock data!
    const [
      totalUsers,
      activeUsers,
      totalBookings,
      activeBookings,
      confirmedBookings,
      totalProducts,
      activeProducts,
      totalReviews,
      pendingReviews,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      onlineDevices,
      totalDevices,
      totalHomestays,
    ] = await Promise.all([
      // User statistics
      prisma.user.count(),
      prisma.user.count({ where: { active: true } }),
      
      // Booking statistics
      prisma.booking.count(),
      prisma.booking.count({ 
        where: { 
          status: { in: ['CONFIRMED', 'CHECKED_IN'] },
          checkOut: { gte: new Date() }
        } 
      }),
      prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      
      // Product statistics
      prisma.product.count(),
      prisma.product.count({ where: { active: true } }),
      
      // Review statistics
      prisma.review.count(),
      prisma.review.count({ 
        where: { 
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        } 
      }),
      
      // Order statistics
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ 
        where: { status: { in: ['DELIVERED', 'PROCESSING'] } }
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { in: ['CONFIRMED', 'DELIVERED', 'PROCESSING'] } }
      }),
      
      // Device statistics
      prisma.device.count({ where: { status: 'ONLINE' } }),
      prisma.device.count(),
      
      // Homestay statistics
      prisma.homestay.count(),
    ]);

    // Calculate system health based on device status
    const deviceHealthRatio = totalDevices > 0 ? onlineDevices / totalDevices : 1;
    let systemHealth: 'healthy' | 'warning' | 'error';
    if (deviceHealthRatio >= 0.8) systemHealth = 'healthy';
    else if (deviceHealthRatio >= 0.5) systemHealth = 'warning';
    else systemHealth = 'error';

    // Calculate occupancy rate from bookings
    const totalHomestayCapacity = totalHomestays > 0 ? totalHomestays : 1;
    const occupancyRate = Math.round((activeBookings / totalHomestayCapacity) * 100);

    const stats = {
      // User metrics
      totalUsers,
      activeUsers,
      
      // Booking metrics
      totalBookings,
      activeBookings,
      confirmedBookings,
      occupancyRate: Math.min(occupancyRate, 100), // Cap at 100%
      
      // Review metrics (complaints)
      pendingReviews,
      complaints: pendingReviews, // Reviews can serve as complaints
      totalReviews,
      
      // Product/Marketplace metrics
      totalProducts,
      activeProducts,
      
      // Order metrics
      totalOrders,
      pendingOrders,
      completedOrders,
      
      // Revenue
      revenue: totalRevenue._sum.total || 0,
      
      // Device/IoT metrics
      onlineDevices,
      totalDevices,
      systemHealth,
      
      // Content metrics
      articles: 0, // Will implement when ContentBlock type includes articles
      
      // Homestay metrics
      totalHomestays,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : 'An unexpected error occurred'
    }, { status: 500 });
  }
}