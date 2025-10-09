import { NextRequest, NextResponse } from 'next/server';
import { checkDatabaseHealth } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const dbHealth = await checkDatabaseHealth();
    
    // Check if database is healthy or skipped (during build)
    const dbHealthy = dbHealth.status === 'healthy' || dbHealth.status === 'skip';
    
    const health = {
      status: dbHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      services: {
        database: dbHealth,
        api: { status: 'healthy', message: 'API is responding' }
      },
      deployment: {
        platform: process.env.CAPROVER_BUILD === 'true' ? 'CapRover' : 'Unknown',
        region: process.env.REGION || 'Unknown'
      }
    };

    // Return 200 even if database is skipped (build time)
    // Return 503 only if database is actually unhealthy
    const statusCode = dbHealth.status === 'unhealthy' ? 503 : 200;
    
    return NextResponse.json(health, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.message : 'Unknown error')
        : 'Health check failed'
    }, { status: 503 });
  }
}