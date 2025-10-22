import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * GET /api/admin/homepage
 * Get current homepage configuration
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get active homepage config (fallback to defaults if DB not available)
    try {
      const config = await prisma.homepageConfig.findFirst({
        where: { active: true },
        orderBy: { createdAt: 'desc' },
      });

      if (config) {
        return NextResponse.json({
          success: true,
          data: config,
        });
      }
    } catch (dbError) {
      console.log('Database not available, using defaults');
    }

    // Return default config
    return NextResponse.json({
      success: true,
      data: {
        id: null,
        heroTitle: 'Damday Village',
        heroSubtitle: 'स्मार्ट कार्बन-मुक्त ग्राम पंचायत',
        heroDescription: 'Experience Damday Village in Pithoragarh - a pioneering carbon-neutral, culturally-rich, and technologically progressive model village nestled at 2,100m elevation in the pristine Kumaon Himalayas.',
        heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070',
        heroImageAlt: 'Himalayan Village Landscape',
        layoutType: 'vertical-sidebar',
        showStatistics: true,
        showEnvironment: true,
        showHomestays: true,
        showProducts: true,
        statsPosition: 'left',
        statsStyle: 'vertical-cards',
        maxHomestays: 3,
        maxProducts: 4,
        ctaButtons: [
          { id: '1', text: '🏔️ Explore Digital Twin', link: '/digital-twin', variant: 'primary' },
          { id: '2', text: '🌐 360° Village Tour', link: '/village-tour', variant: 'outline' },
          { id: '3', text: '🏠 Browse Homestays', link: '/homestays', variant: 'outline' }
        ],
        emblemText: 'DV',
        primaryColor: '#1e40af',
        accentColor: '#f59e0b',
      }
    });
  } catch (error) {
    console.error('Error fetching homepage config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage configuration' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/homepage
 * Create or update homepage configuration
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Try to save to database
    try {
      // Deactivate all existing configs
      await prisma.homepageConfig.updateMany({
        where: { active: true },
        data: { active: false },
      });

      // Create new config
      const config = await prisma.homepageConfig.create({
        data: {
          ...body,
          active: true,
          createdBy: session.user.id,
          updatedBy: session.user.id,
        },
      });

      return NextResponse.json({
        success: true,
        data: config,
        message: 'Homepage configuration saved successfully',
      });
    } catch (dbError) {
      console.log('Database not available:', dbError);
      return NextResponse.json({
        success: false,
        error: 'Database not configured. Configuration cannot be saved.',
        message: 'Please configure the database to save homepage settings.',
      }, { status: 503 });
    }
  } catch (error) {
    console.error('Error saving homepage config:', error);
    return NextResponse.json(
      { error: 'Failed to save homepage configuration' },
      { status: 500 }
    );
  }
}
