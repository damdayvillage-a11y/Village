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

    const brandingSettings = await prisma.appSettings.findMany({
      where: { category: 'branding' },
    });

    const branding = {
      siteName: 'Damday Village',
      tagline: 'Smart Carbon-Free Village',
      logo: '',
      favicon: '',
      primaryColor: '#061335',
      secondaryColor: '#1E40AF',
      accentColor: '#10B981',
    };

    brandingSettings.forEach((setting) => {
      if (setting.key in branding) {
        (branding as any)[setting.key] = setting.value;
      }
    });

    return NextResponse.json(branding);
  } catch (error) {
    console.error('Branding fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch branding' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    for (const [key, value] of Object.entries(body)) {
      await prisma.appSettings.upsert({
        where: {
          category_key: {
            category: 'branding',
            key,
          },
        },
        update: { value: value as any },
        create: {
          category: 'branding',
          key,
          value: value as any,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Branding save error:', error);
    return NextResponse.json({ error: 'Failed to save branding' }, { status: 500 });
  }
}
