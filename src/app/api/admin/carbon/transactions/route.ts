import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/carbon/transactions
 * Fetch carbon credit transactions
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const type = searchParams.get('type');
    const userId = searchParams.get('userId');

    // Build filter
    const where: any = {};
    if (type) where.type = type;
    if (userId) where.userId = userId;

    // Fetch transactions
    const transactions = await prisma.carbonTransaction.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        credit: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Map to response format
    const mappedTransactions = transactions.map((trans) => ({
      id: trans.id,
      userId: trans.userId,
      userName: trans.credit.user.name,
      userEmail: trans.credit.user.email,
      type: trans.type,
      amount: trans.amount,
      reason: trans.reason,
      description: trans.description,
      metadata: trans.metadata,
      createdAt: trans.createdAt.toISOString(),
    }));

    return NextResponse.json({ transactions: mappedTransactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
