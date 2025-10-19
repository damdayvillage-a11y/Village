import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/carbon/stats
 * Get carbon credit statistics
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true },
    });

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Get all carbon credits
    const carbonCredits = await prisma.carbonCredit.findMany({
      select: {
        balance: true,
        totalEarned: true,
        totalSpent: true,
      },
    });

    // Calculate statistics
    const totalCredits = carbonCredits.reduce((sum, c) => sum + c.balance, 0);
    const totalEarned = carbonCredits.reduce((sum, c) => sum + c.totalEarned, 0);
    const totalSpent = carbonCredits.reduce((sum, c) => sum + c.totalSpent, 0);
    const totalUsers = carbonCredits.length;
    const avgCreditsPerUser = totalUsers > 0 ? totalCredits / totalUsers : 0;

    // Total CO2 offset (1 credit = 1 kg CO2)
    const totalOffset = totalSpent;

    return NextResponse.json({
      totalCredits,
      totalUsers,
      totalEarned,
      totalSpent,
      totalOffset,
      avgCreditsPerUser,
    });
  } catch (error) {
    console.error('Error fetching carbon stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
