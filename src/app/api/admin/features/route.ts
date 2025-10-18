import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { UserRole } from '@prisma/client';
import prisma from '@/lib/db/prisma';

const FEATURES = [
  {
    key: 'homestaysEnabled',
    name: 'Homestays & Bookings',
    description: 'Enable homestay listings and booking functionality',
    enabled: true,
    requiresConfig: true,
    configKeys: ['Razorpay API keys or Stripe keys'],
    prNumber: '12',
    status: 'active',
  },
  {
    key: 'marketplaceEnabled',
    name: 'Marketplace',
    description: 'Enable product marketplace and orders',
    enabled: true,
    requiresConfig: true,
    configKeys: ['Payment gateway configuration'],
    prNumber: '12',
    status: 'active',
  },
  {
    key: 'toursEnabled',
    name: 'Tours & Experiences',
    description: 'Enable tour booking and guide management system',
    enabled: false,
    requiresConfig: false,
    prNumber: '15',
    status: 'planned',
  },
  {
    key: 'blogEnabled',
    name: 'Community Blog',
    description: 'Enable blog and content management system',
    enabled: false,
    requiresConfig: false,
    prNumber: '16',
    status: 'planned',
  },
  {
    key: 'projectsEnabled',
    name: 'Community Projects',
    description: 'Enable volunteering, donations, and project tracking',
    enabled: false,
    requiresConfig: true,
    configKeys: ['Payment gateway for donations'],
    prNumber: '17',
    status: 'planned',
  },
  {
    key: 'carbonCreditsEnabled',
    name: 'Carbon Credits (Blockchain)',
    description: 'Enable tree NFTs and carbon credit marketplace',
    enabled: false,
    requiresConfig: true,
    configKeys: ['Polygon/Solana wallet', 'IPFS configuration'],
    prNumber: '18-19',
    status: 'planned',
  },
  {
    key: 'iotEnabled',
    name: 'IoT Monitoring',
    description: 'Enable environmental sensor dashboard and device management',
    enabled: true,
    requiresConfig: false,
    prNumber: '2',
    status: 'active',
  },
  {
    key: 'analyticsEnabled',
    name: 'Analytics Dashboard',
    description: 'Enable admin analytics and insights',
    enabled: true,
    requiresConfig: false,
    prNumber: '10',
    status: 'active',
  },
];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const featureSettings = await prisma.appSettings.findMany({
      where: { category: 'features' },
    });

    const featuresWithStatus = FEATURES.map((feature) => {
      const dbSetting = featureSettings.find((s) => s.key === feature.key);
      return {
        ...feature,
        enabled: dbSetting ? dbSetting.value === true : feature.enabled,
      };
    });

    return NextResponse.json(featuresWithStatus);
  } catch (error) {
    console.error('Features fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch features' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { featureKey, enabled } = await request.json();

    await prisma.appSettings.upsert({
      where: {
        category_key: {
          category: 'features',
          key: featureKey,
        },
      },
      update: { value: enabled },
      create: {
        category: 'features',
        key: featureKey,
        value: enabled,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feature toggle error:', error);
    return NextResponse.json({ error: 'Failed to toggle feature' }, { status: 500 });
  }
}
