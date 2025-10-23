import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db';

/**
 * POST /api/admin/carbon/adjust
 * Manually adjust user carbon credits
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true, role: true, name: true },
    });

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { userId, amount, reason, description } = body;

    // Validate
    if (!userId || amount === undefined || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, amount, reason' },
        { status: 400 }
      );
    }

    const adjustAmount = parseFloat(amount);
    if (isNaN(adjustAmount)) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Get or create carbon credit record
    let carbonCredit = await prisma.carbonCredit.findUnique({
      where: { userId },
    });

    if (!carbonCredit) {
      carbonCredit = await prisma.carbonCredit.create({
        data: {
          userId,
          balance: 0,
          totalEarned: 0,
          totalSpent: 0,
        },
      });
    }

    // Calculate new balance
    const newBalance = carbonCredit.balance + adjustAmount;

    if (newBalance < 0) {
      return NextResponse.json(
        { error: 'Insufficient balance. Adjustment would result in negative balance.' },
        { status: 400 }
      );
    }

    // Update carbon credit balance
    const transactionType = adjustAmount > 0 ? 'BONUS' : 'SPEND';
    const updateData: any = {
      balance: newBalance,
    };

    if (adjustAmount > 0) {
      updateData.totalEarned = carbonCredit.totalEarned + adjustAmount;
    } else {
      updateData.totalSpent = carbonCredit.totalSpent + Math.abs(adjustAmount);
    }

    const updatedCredit = await prisma.carbonCredit.update({
      where: { id: carbonCredit.id },
      data: updateData,
    });

    // Create transaction record
    await prisma.carbonTransaction.create({
      data: {
        creditId: carbonCredit.id,
        userId,
        type: transactionType,
        amount: adjustAmount,
        reason,
        description: description || `Manual adjustment by ${currentUser.name}`,
        metadata: {
          adjustedBy: currentUser.id,
          adjustedByName: currentUser.name,
          timestamp: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({
      success: true,
      carbonCredit: {
        userId: updatedCredit.userId,
        balance: updatedCredit.balance,
        totalEarned: updatedCredit.totalEarned,
        totalSpent: updatedCredit.totalSpent,
      },
    });
  } catch (error) {
    console.error('Error adjusting credits:', error);
    return NextResponse.json(
      { error: 'Failed to adjust credits' },
      { status: 500 }
    );
  }
}
