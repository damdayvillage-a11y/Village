import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { UserRole } from '@prisma/client';
import prisma from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const themeSettings = await prisma.appSettings.findMany({
      where: { category: 'theme' },
    });

    const theme = {
      fonts: {
        heading: 'Inter',
        body: 'Inter',
      },
      layout: {
        maxWidth: '1280px',
        spacing: 'normal',
        borderRadius: 'md',
      },
      colors: {
        primary: '#061335',
        secondary: '#1E40AF',
        accent: '#10B981',
        background: '#FFFFFF',
        text: '#1F2937',
      },
    };

    themeSettings.forEach((setting) => {
      const keys = setting.key.split('.');
      if (keys.length === 2) {
        const [category, key] = keys;
        if (category in theme) {
          (theme as any)[category][key] = setting.value;
        }
      }
    });

    return NextResponse.json(theme);
  } catch (error) {
    console.error('Theme fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch theme' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Save fonts
    for (const [key, value] of Object.entries(body.fonts || {})) {
      await prisma.appSettings.upsert({
        where: {
          category_key: {
            category: 'theme',
            key: `fonts.${key}`,
          },
        },
        update: { value: value as any },
        create: {
          category: 'theme',
          key: `fonts.${key}`,
          value: value as any,
        },
      });
    }

    // Save layout
    for (const [key, value] of Object.entries(body.layout || {})) {
      await prisma.appSettings.upsert({
        where: {
          category_key: {
            category: 'theme',
            key: `layout.${key}`,
          },
        },
        update: { value: value as any },
        create: {
          category: 'theme',
          key: `layout.${key}`,
          value: value as any,
        },
      });
    }

    // Save colors
    for (const [key, value] of Object.entries(body.colors || {})) {
      await prisma.appSettings.upsert({
        where: {
          category_key: {
            category: 'theme',
            key: `colors.${key}`,
          },
        },
        update: { value: value as any },
        create: {
          category: 'theme',
          key: `colors.${key}`,
          value: value as any,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Theme save error:', error);
    return NextResponse.json({ error: 'Failed to save theme' }, { status: 500 });
  }
}
