import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

// GET /api/user/reviews - Get all user reviews
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

    // Fetch reviews
    const reviews = await prisma.review.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/user/reviews - Create a new review
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
    const { productId, homestayId, rating, comment } = body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ 
        error: 'Rating must be between 1 and 5' 
      }, { status: 400 });
    }

    // Must have either productId or homestayId
    if (!productId && !homestayId) {
      return NextResponse.json({ 
        error: 'Product ID or Homestay ID is required' 
      }, { status: 400 });
    }

    // Verify product or homestay exists
    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId }
      });
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
    }

    if (homestayId) {
      const homestay = await prisma.homestay.findUnique({
        where: { id: homestayId }
      });
      if (!homestay) {
        return NextResponse.json({ error: 'Homestay not found' }, { status: 404 });
      }
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId: user.id,
        ...(productId && { productId }),
        ...(homestayId && { homestayId }),
        rating,
        comment,
      }
    });

    // Send notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Review Submitted',
        message: 'Your review has been submitted successfully.',
        type: 'SUCCESS',
      }
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Failed to create review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
