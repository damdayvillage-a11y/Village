import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

// GET /api/user/carbon-credits - Get user's carbon credit balance and summary
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

    // Get or create carbon credit record
    let carbonCredit = await prisma.carbonCredit.findUnique({
      where: { userId: user.id }
    });

    if (!carbonCredit) {
      // Create initial carbon credit record for user
      carbonCredit = await prisma.carbonCredit.create({
        data: {
          userId: user.id,
          balance: 0,
          totalEarned: 0,
          totalSpent: 0,
        }
      });
    }

    return NextResponse.json({
      balance: carbonCredit.balance,
      totalEarned: carbonCredit.totalEarned,
      totalSpent: carbonCredit.totalSpent,
      createdAt: carbonCredit.createdAt.toISOString(),
      updatedAt: carbonCredit.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Failed to fetch carbon credits:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/user/carbon-credits - Process carbon credit transaction (earn or spend)
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { amount, reason, description, type = 'EARN' } = body;

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json({ 
        error: 'Amount must be greater than 0' 
      }, { status: 400 });
    }

    // Validate reason
    if (!reason) {
      return NextResponse.json({ 
        error: 'Reason is required' 
      }, { status: 400 });
    }

    // Validate type
    const validTypes = ['EARN', 'SPEND', 'TRANSFER', 'BONUS', 'REFUND'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ 
        error: 'Invalid transaction type' 
      }, { status: 400 });
    }

    // Get or create carbon credit record
    let carbonCredit = await prisma.carbonCredit.findUnique({
      where: { userId: user.id }
    });

    if (!carbonCredit) {
      carbonCredit = await prisma.carbonCredit.create({
        data: {
          userId: user.id,
          balance: 0,
          totalEarned: 0,
          totalSpent: 0,
        }
      });
    }

    // Update balance based on transaction type
    const isEarning = type === 'EARN' || type === 'BONUS' || type === 'REFUND';
    const newBalance = isEarning 
      ? carbonCredit.balance + amount 
      : carbonCredit.balance - amount;

    if (!isEarning && newBalance < 0) {
      return NextResponse.json({ 
        error: 'Insufficient balance' 
      }, { status: 400 });
    }

    // Update carbon credit balance in a transaction
    const [updatedCredit, transaction] = await prisma.$transaction([
      prisma.carbonCredit.update({
        where: { id: carbonCredit.id },
        data: {
          balance: newBalance,
          totalEarned: isEarning ? carbonCredit.totalEarned + amount : carbonCredit.totalEarned,
          totalSpent: !isEarning ? carbonCredit.totalSpent + amount : carbonCredit.totalSpent,
        }
      }),
      prisma.carbonTransaction.create({
        data: {
          creditId: carbonCredit.id,
          userId: user.id,
          type,
          amount,
          reason,
          description,
        }
      })
    ]);

    // Create notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: isEarning ? 'Credits Earned!' : 'Credits Spent',
        message: isEarning 
          ? `You earned ${amount} carbon credits for ${reason}`
          : `You spent ${amount} carbon credits on ${reason}`,
        type: 'SUCCESS',
      }
    });

    return NextResponse.json({
      success: true,
      balance: updatedCredit.balance,
      transaction: {
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        reason: transaction.reason,
        createdAt: transaction.createdAt.toISOString(),
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to process carbon credit transaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
