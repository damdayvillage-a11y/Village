import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

// GET /api/user/carbon-credits/transactions - Get user's carbon credit transaction history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build where clause
    const where: any = { userId: user.id };
    if (type) {
      where.type = type;
    }

    // Fetch transactions
    const transactions = await prisma.carbonTransaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100), // Max 100 transactions
    });

    // Format response
    const formattedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      type: transaction.type,
      amount: transaction.amount,
      reason: transaction.reason,
      description: transaction.description,
      createdAt: transaction.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedTransactions);
  } catch (error) {
    console.error('Failed to fetch carbon credit transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
