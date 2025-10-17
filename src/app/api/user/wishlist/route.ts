import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

// GET /api/user/wishlist - Get user wishlist
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

    // Fetch wishlist items with product details
    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId: user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            images: true,
            stock: true,
            unlimited: true,
            category: true,
          }
        }
      },
      orderBy: { addedAt: 'desc' }
    });

    // Transform data for frontend
    const formattedItems = wishlistItems.map(item => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      productDescription: item.product.description,
      productPrice: item.product.price,
      productImage: Array.isArray(item.product.images) && item.product.images.length > 0 
        ? item.product.images[0] 
        : undefined,
      productStock: item.product.stock,
      productCategory: item.product.category,
      inStock: item.product.unlimited || item.product.stock > 0,
      addedAt: item.addedAt.toISOString(),
    }));

    return NextResponse.json(formattedItems);
  } catch (error) {
    console.error('Failed to fetch wishlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/user/wishlist - Add item to wishlist
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
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if already in wishlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId
        }
      }
    });

    if (existing) {
      return NextResponse.json({ 
        error: 'Product already in wishlist' 
      }, { status: 400 });
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: user.id,
        productId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            images: true,
            stock: true,
            unlimited: true,
            category: true,
          }
        }
      }
    });

    // Send notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Item Added to Wishlist',
        message: `${product.name} has been added to your wishlist.`,
        type: 'INFO',
      }
    });

    // Format response
    const formattedItem = {
      id: wishlistItem.id,
      productId: wishlistItem.productId,
      productName: wishlistItem.product.name,
      productDescription: wishlistItem.product.description,
      productPrice: wishlistItem.product.price,
      productImage: Array.isArray(wishlistItem.product.images) && wishlistItem.product.images.length > 0 
        ? wishlistItem.product.images[0] 
        : undefined,
      productStock: wishlistItem.product.stock,
      productCategory: wishlistItem.product.category,
      inStock: wishlistItem.product.unlimited || wishlistItem.product.stock > 0,
      addedAt: wishlistItem.addedAt.toISOString(),
    };

    return NextResponse.json(formattedItem, { status: 201 });
  } catch (error) {
    console.error('Failed to add to wishlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/user/wishlist/[id] - Remove item from wishlist
export async function DELETE(request: NextRequest) {
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

    // Get item ID from URL
    const url = new URL(request.url);
    const itemId = url.pathname.split('/').pop();

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    // Delete item (only if it belongs to the user)
    const deleted = await prisma.wishlist.deleteMany({
      where: {
        id: itemId,
        userId: user.id
      }
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Item removed from wishlist' 
    });
  } catch (error) {
    console.error('Failed to remove from wishlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
