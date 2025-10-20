import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db';
import { UserRole } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user?.role !== UserRole.ADMIN && session.user?.role !== UserRole.VILLAGE_COUNCIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// PUT update product by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user?.role !== UserRole.ADMIN && session.user?.role !== UserRole.VILLAGE_COUNCIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { 
      name, 
      description, 
      price, 
      category, 
      sellerId, 
      images, 
      stock, 
      unlimited, 
      currency,
      carbonFootprint,
      locallySourced,
      active 
    } = body;

    // Validation
    if (name !== undefined && !name.trim()) {
      return NextResponse.json({ error: 'Product name cannot be empty' }, { status: 400 });
    }

    if (price !== undefined && price <= 0) {
      return NextResponse.json({ error: 'Price must be greater than 0' }, { status: 400 });
    }

    if (stock !== undefined && !unlimited && stock < 0) {
      return NextResponse.json({ error: 'Stock cannot be negative' }, { status: 400 });
    }

    // Build update data object
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (category !== undefined) updateData.category = category;
    if (sellerId !== undefined) updateData.sellerId = sellerId;
    if (images !== undefined) updateData.images = images;
    if (stock !== undefined) updateData.stock = stock;
    if (unlimited !== undefined) updateData.unlimited = unlimited;
    if (currency !== undefined) updateData.currency = currency;
    if (carbonFootprint !== undefined) updateData.carbonFootprint = carbonFootprint;
    if (locallySourced !== undefined) updateData.locallySourced = locallySourced;
    if (active !== undefined) updateData.active = active;

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// PATCH partial update product by ID
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user?.role !== UserRole.ADMIN && session.user?.role !== UserRole.VILLAGE_COUNCIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    const product = await prisma.product.update({
      where: { id: params.id },
      data: body,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to patch product:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// DELETE product by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user?.role !== UserRole.ADMIN && session.user?.role !== UserRole.VILLAGE_COUNCIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if product has any related orders before deleting
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        orderItems: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (product.orderItems && product.orderItems.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete product with existing orders. Consider marking it as inactive instead.' },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
