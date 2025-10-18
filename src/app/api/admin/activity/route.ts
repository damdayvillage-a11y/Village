import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db';
import { UserRole } from '@prisma/client';

export const dynamic = 'force-dynamic';

interface Activity {
  type: string;
  message: string;
  timestamp: Date;
  color: string;
  status?: string;
  icon?: string;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin permissions
    if (session.user?.role !== UserRole.ADMIN && session.user?.role !== UserRole.VILLAGE_COUNCIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get recent activities from various tables
    const [recentUsers, recentBookings, recentOrders, recentReviews, recentProducts] = await Promise.all([
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: { 
          id: true, 
          name: true, 
          email: true,
          role: true,
          createdAt: true 
        },
      }),
      prisma.booking.findMany({
        take: 10,
        orderBy: { updatedAt: 'desc' },
        select: { 
          id: true, 
          status: true, 
          updatedAt: true,
          guest: { select: { name: true } },
          homestay: { select: { name: true } }
        },
      }),
      prisma.order.findMany({
        take: 10,
        orderBy: { updatedAt: 'desc' },
        select: { 
          id: true, 
          status: true, 
          total: true,
          updatedAt: true,
          customer: { select: { name: true } }
        },
      }),
      prisma.review.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: { 
          id: true, 
          rating: true, 
          createdAt: true,
          user: { select: { name: true } }
        },
      }),
      prisma.product.findMany({
        take: 5,
        where: { active: true },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          createdAt: true,
          seller: { select: { name: true } }
        },
      }),
    ]);

    // Combine and format activities
    const activities: Activity[] = [
      ...recentUsers.map(u => ({
        type: 'user_registration',
        message: `${u.name} registered as ${u.role}`,
        timestamp: u.createdAt,
        color: 'green',
        icon: 'UserPlus',
      })),
      ...recentBookings.map(b => ({
        type: 'booking',
        message: `${b.guest.name} booked ${b.homestay.name} - ${b.status}`,
        timestamp: b.updatedAt,
        color: b.status === 'CONFIRMED' ? 'blue' : b.status === 'CANCELLED' ? 'red' : 'yellow',
        status: b.status,
        icon: 'Calendar',
      })),
      ...recentOrders.map(o => ({
        type: 'order',
        message: `${o.customer.name} ${o.status === 'DELIVERED' ? 'received' : 'placed'} order (₹${o.total})`,
        timestamp: o.updatedAt,
        color: o.status === 'DELIVERED' ? 'green' : 'purple',
        status: o.status,
        icon: 'ShoppingBag',
      })),
      ...recentReviews.map(r => ({
        type: 'review',
        message: `${r.user.name} left a ${r.rating}-star review`,
        timestamp: r.createdAt,
        color: r.rating >= 4 ? 'green' : r.rating >= 3 ? 'yellow' : 'red',
        icon: 'Star',
      })),
      ...recentProducts.map(p => ({
        type: 'product',
        message: `New product: ${p.name} by ${p.seller.name}`,
        timestamp: p.createdAt,
        color: 'purple',
        icon: 'Package',
      })),
    ]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 20); // Return top 20 most recent activities

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Failed to fetch activities:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
