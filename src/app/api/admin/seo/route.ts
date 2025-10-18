import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { UserRole } from '@prisma/client';
import prisma from '@/lib/db/prisma';

const DEFAULT_SEO = {
  '/': {
    title: 'Damday Village - Smart Carbon-Free Village',
    description: 'Experience sustainable living in the heart of the Himalayas. Book homestays, explore our digital twin, and join our journey towards a carbon-neutral future.',
    keywords: 'carbon-free, village, tourism, sustainability, Himalayas, eco-tourism, smart village',
    ogImage: '/og-image.jpg',
    canonical: 'https://village-app.captain.damdayvillage.com/',
  },
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || '/';

    const seoSetting = await prisma.appSettings.findUnique({
      where: {
        category_key: {
          category: 'seo',
          key: path,
        },
      },
    });

    if (seoSetting) {
      return NextResponse.json({ path, ...seoSetting.value });
    }

    // Return default if not found
    const defaultSEO = (DEFAULT_SEO as any)[path] || DEFAULT_SEO['/'];
    return NextResponse.json({ path, ...defaultSEO });
  } catch (error) {
    console.error('SEO fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch SEO' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { path, title, description, keywords, ogImage, canonical } = body;

    await prisma.appSettings.upsert({
      where: {
        category_key: {
          category: 'seo',
          key: path,
        },
      },
      update: {
        value: { title, description, keywords, ogImage, canonical },
      },
      create: {
        category: 'seo',
        key: path,
        value: { title, description, keywords, ogImage, canonical },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('SEO save error:', error);
    return NextResponse.json({ error: 'Failed to save SEO' }, { status: 500 });
  }
}
