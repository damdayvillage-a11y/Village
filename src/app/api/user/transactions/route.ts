import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const transactions = await prisma.payment.findMany({
      where: {
        OR: [
          {
            booking: {
              guestId: session.user.id,
            },
          },
          {
            order: {
              customerId: session.user.id,
            },
          },
        ],
      },
      include: {
        booking: {
          select: {
            id: true,
            homestay: {
              select: {
                name: true,
              },
            },
          },
        },
        order: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to last 50 transactions
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Fetch transactions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
