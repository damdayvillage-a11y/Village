import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/cms/theme - Get active theme or all themes
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'VILLAGE_COUNCIL')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';

    if (activeOnly) {
      const theme = await prisma.theme.findFirst({
        where: { active: true },
      });

      return NextResponse.json({ theme });
    }

    const themes = await prisma.theme.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ themes });
  } catch (error) {
    console.error('Error fetching theme:', error);
    return NextResponse.json({ error: 'Failed to fetch theme' }, { status: 500 });
  }
}

// POST /api/admin/cms/theme - Create new theme
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, config, active } = body;

    if (!name || !config) {
      return NextResponse.json(
        { error: 'Name and config are required' },
        { status: 400 }
      );
    }

    // If this theme should be active, deactivate others
    if (active) {
      await prisma.theme.updateMany({
        where: { active: true },
        data: { active: false },
      });
    }

    const theme = await prisma.theme.create({
      data: {
        name,
        config,
        active: active || false,
      },
    });

    return NextResponse.json(theme, { status: 201 });
  } catch (error) {
    console.error('Error creating theme:', error);
    return NextResponse.json({ error: 'Failed to create theme' }, { status: 500 });
  }
}

// PATCH /api/admin/cms/theme - Update theme
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Theme ID is required' }, { status: 400 });
    }

    // If activating this theme, deactivate others
    if (updates.active === true) {
      await prisma.theme.updateMany({
        where: { active: true, NOT: { id } },
        data: { active: false },
      });
    }

    const theme = await prisma.theme.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(theme);
  } catch (error) {
    console.error('Error updating theme:', error);
    return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 });
  }
}

// DELETE /api/admin/cms/theme - Delete theme
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Theme ID is required' }, { status: 400 });
    }

    // Check if this is the active theme
    const theme = await prisma.theme.findUnique({
      where: { id },
    });

    if (theme?.active) {
      return NextResponse.json(
        { error: 'Cannot delete the active theme. Activate another theme first.' },
        { status: 400 }
      );
    }

    await prisma.theme.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Theme deleted successfully' });
  } catch (error) {
    console.error('Error deleting theme:', error);
    return NextResponse.json({ error: 'Failed to delete theme' }, { status: 500 });
  }
}
