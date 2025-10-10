import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';

export const dynamic = 'force-dynamic';

/**
 * Auth Service Status Endpoint
 * 
 * Checks if authentication service dependencies are working:
 * - Database connectivity
 * - Admin user exists
 * - Configuration is valid
 * 
 * This helps diagnose login issues in production
 */
export async function GET(request: NextRequest) {
  const checks = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    nextauth_url: {
      configured: !!process.env.NEXTAUTH_URL,
      value: process.env.NEXTAUTH_URL ? 
        (process.env.NEXTAUTH_URL.includes('$$cap_') ? 'INVALID - Contains placeholders' : 'OK') :
        'NOT SET',
    },
    nextauth_secret: {
      configured: !!process.env.NEXTAUTH_SECRET,
      length: process.env.NEXTAUTH_SECRET?.length || 0,
      valid: process.env.NEXTAUTH_SECRET && 
             process.env.NEXTAUTH_SECRET.length >= 32 &&
             !process.env.NEXTAUTH_SECRET.includes('dummy'),
    },
    database: {
      configured: false,
      connected: false,
      admin_exists: false,
      message: '',
    },
  };

  // Check database configuration
  if (!process.env.DATABASE_URL) {
    checks.database.message = 'DATABASE_URL not configured';
  } else if (process.env.DATABASE_URL.includes('dummy:dummy')) {
    checks.database.configured = true;
    checks.database.message = 'Using dummy database (build mode)';
  } else if (process.env.DATABASE_URL.includes('$$cap_')) {
    checks.database.configured = false;
    checks.database.message = 'DATABASE_URL contains placeholders - not replaced';
  } else {
    checks.database.configured = true;

    // Test database connection
    try {
      // Quick connection test with timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout')), 3000)
      );

      const queryPromise = db.$queryRaw`SELECT 1`;

      await Promise.race([queryPromise, timeoutPromise]);
      checks.database.connected = true;
      checks.database.message = 'Database connected';

      // Check if admin user exists
      try {
        const adminUser = await Promise.race([
          db.user.findUnique({
            where: { email: 'admin@damdayvillage.org' },
            select: { id: true, email: true, role: true, active: true, verified: true },
          }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Query timeout')), 2000)
          ),
        ]) as any;

        if (adminUser) {
          checks.database.admin_exists = true;
          checks.database.message = `Admin user found (role: ${adminUser.role}, active: ${adminUser.active}, verified: ${adminUser.verified})`;
        } else {
          checks.database.message = 'Admin user not found - run: npm run db:seed';
        }
      } catch (error) {
        // Admin check failed, but DB is connected
        checks.database.message = 'Database connected, but admin check failed';
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      checks.database.connected = false;
      
      if (errorMsg.includes('timeout')) {
        checks.database.message = 'Database connection timeout';
      } else if (errorMsg.includes('ECONNREFUSED')) {
        checks.database.message = 'Database connection refused - is PostgreSQL running?';
      } else if (errorMsg.includes('ENOTFOUND')) {
        checks.database.message = 'Database host not found - check DATABASE_URL';
      } else if (errorMsg.includes('authentication')) {
        checks.database.message = 'Database authentication failed - check credentials';
      } else {
        checks.database.message = `Database error: ${errorMsg}`;
      }
    }
  }

  // Determine overall status
  const allConfigured = 
    checks.nextauth_url.configured &&
    checks.nextauth_secret.valid &&
    checks.database.configured;

  const allHealthy = 
    allConfigured &&
    checks.database.connected &&
    checks.database.admin_exists;

  const status = allHealthy ? 'healthy' : 
                 allConfigured ? 'degraded' : 
                 'misconfigured';

  // Provide helpful recommendations
  const recommendations: string[] = [];

  if (!checks.nextauth_url.configured) {
    recommendations.push('Set NEXTAUTH_URL to your domain (e.g., https://damdayvillage.com)');
  } else if (checks.nextauth_url.value === 'INVALID - Contains placeholders') {
    recommendations.push('Replace $$cap_*$$ placeholders in NEXTAUTH_URL');
  }

  if (!checks.nextauth_secret.valid) {
    if (!checks.nextauth_secret.configured) {
      recommendations.push('Set NEXTAUTH_SECRET - generate with: openssl rand -base64 32');
    } else if (checks.nextauth_secret.length < 32) {
      recommendations.push(`NEXTAUTH_SECRET too short (${checks.nextauth_secret.length} chars, need 32+)`);
    }
  }

  if (!checks.database.configured) {
    recommendations.push('Configure DATABASE_URL with valid PostgreSQL connection string');
  } else if (!checks.database.connected) {
    recommendations.push('Fix database connection - see: docs/PRODUCTION_LOGIN_TROUBLESHOOTING.md');
  } else if (!checks.database.admin_exists) {
    recommendations.push('Create admin user - run: npm run db:seed');
  }

  const response = {
    status,
    healthy: allHealthy,
    checks,
    recommendations: recommendations.length > 0 ? recommendations : ['All checks passed!'],
    help: status !== 'healthy' ? 'See: docs/PRODUCTION_LOGIN_TROUBLESHOOTING.md' : null,
  };

  // Return appropriate status code
  const statusCode = status === 'healthy' ? 200 : 
                     status === 'degraded' ? 503 : 
                     500;

  return NextResponse.json(response, {
    status: statusCode,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
