import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db';
import { UserRole } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin permissions
    if (session.user?.role !== UserRole.ADMIN && session.user?.role !== UserRole.VILLAGE_COUNCIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Advanced filtering
    const category = searchParams.get('category');
    const active = searchParams.get('active');
    const sellerId = searchParams.get('sellerId');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause
    const where: any = {};
    
    if (category) {
      where.category = category;
    }
    
    if (active !== null && active !== undefined) {
      where.active = active === 'true';
    }
    
    if (sellerId) {
      where.sellerId = sellerId;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Build orderBy
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take: limit,
        skip,
        orderBy,
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              orderItems: true,
              wishlists: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      );
    }

    if (!price || price <= 0) {
      return NextResponse.json(
        { error: 'Valid price is required' },
        { status: 400 }
      );
    }

    if (!sellerId) {
      return NextResponse.json(
        { error: 'Seller ID is required' },
        { status: 400 }
      );
    }

    // Verify seller exists and has SELLER role
    const seller = await prisma.user.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      return NextResponse.json(
        { error: 'Seller not found' },
        { status: 404 }
      );
    }

    if (seller.role !== UserRole.SELLER && seller.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'User must have SELLER or ADMIN role' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description || '',
        price,
        category: category || 'Other',
        sellerId,
        images: images || [],
        stock: unlimited ? 0 : (stock || 0),
        unlimited: unlimited || false,
        currency: currency || 'INR',
        carbonFootprint: carbonFootprint || 0,
        locallySourced: locallySourced || false,
        active: active !== undefined ? active : true,
      },
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

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user?.role !== UserRole.ADMIN && session.user?.role !== UserRole.VILLAGE_COUNCIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { productId, ...updates } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: updates,
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

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user?.role !== UserRole.ADMIN && session.user?.role !== UserRole.VILLAGE_COUNCIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id: productId },
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
