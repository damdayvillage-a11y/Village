import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/cms/menus - List all menus
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'VILLAGE_COUNCIL')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const location = searchParams.get('location');

    const where: any = {};
    if (location) {
      where.location = location;
    }

    const menus = await prisma.menu.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ menus });
  } catch (error) {
    console.error('Error fetching menus:', error);
    return NextResponse.json({ error: 'Failed to fetch menus' }, { status: 500 });
  }
}

// POST /api/admin/cms/menus - Create new menu
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'VILLAGE_COUNCIL')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, location, items, active } = body;

    if (!name || !location) {
      return NextResponse.json(
        { error: 'Name and location are required' },
        { status: 400 }
      );
    }

    // Check if menu for this location already exists
    const existing = await prisma.menu.findUnique({
      where: { location },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A menu for this location already exists' },
        { status: 400 }
      );
    }

    const menu = await prisma.menu.create({
      data: {
        name,
        location,
        items: items || [],
        active: active !== undefined ? active : true,
      },
    });

    return NextResponse.json(menu, { status: 201 });
  } catch (error) {
    console.error('Error creating menu:', error);
    return NextResponse.json({ error: 'Failed to create menu' }, { status: 500 });
  }
}

// PATCH /api/admin/cms/menus - Update menu
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'VILLAGE_COUNCIL')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Menu ID is required' }, { status: 400 });
    }

    // If location is being updated, check for duplicates
    if (updates.location) {
      const existing = await prisma.menu.findFirst({
        where: {
          location: updates.location,
          NOT: { id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'A menu for this location already exists' },
          { status: 400 }
        );
      }
    }

    const menu = await prisma.menu.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.error('Error updating menu:', error);
    return NextResponse.json({ error: 'Failed to update menu' }, { status: 500 });
  }
}

// DELETE /api/admin/cms/menus - Delete menu
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Menu ID is required' }, { status: 400 });
    }

    await prisma.menu.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Menu deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu:', error);
    return NextResponse.json({ error: 'Failed to delete menu' }, { status: 500 });
  }
}
