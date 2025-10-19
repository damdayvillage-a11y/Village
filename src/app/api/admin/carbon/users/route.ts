import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db';

/**
 * GET /api/admin/carbon/users
 * Get users with carbon credits
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

    // Fetch users with carbon credits
    const carbonCredits = await prisma.carbonCredit.findMany({
      orderBy: { balance: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        transactions: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            createdAt: true,
          },
        },
      },
    });

    // Map to response format
    const users = carbonCredits.map((credit) => ({
      id: credit.user.id,
      name: credit.user.name,
      email: credit.user.email,
      balance: credit.balance,
      totalEarned: credit.totalEarned,
      totalSpent: credit.totalSpent,
      lastTransaction: credit.transactions[0]?.createdAt.toISOString(),
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching carbon users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
