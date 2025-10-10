import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';

export const dynamic = 'force-dynamic';

/**
 * Admin Setup Verification Endpoint
 * 
 * Checks if the admin user exists in the database.
 * This endpoint is publicly accessible for diagnostic purposes.
 */
export async function GET(request: NextRequest) {
  try {
    // Check if database is configured
    if (!process.env.DATABASE_URL || 
        process.env.DATABASE_URL.includes('dummy:dummy') ||
        process.env.DATABASE_URL.includes('$$cap_')) {
      return NextResponse.json(
        { 
          adminExists: false,
          message: 'Database not configured',
          details: 'DATABASE_URL contains placeholder or invalid value'
        },
        { status: 503 }
      );
    }

    // Try to find the admin user
    try {
      const adminUser = await db.user.findUnique({
        where: { email: 'admin@damdayvillage.org' },
        select: { 
          id: true, 
          email: true, 
          role: true,
          verified: true,
          active: true,
          password: true
        },
      });

      if (!adminUser) {
        return NextResponse.json({
          adminExists: false,
          message: 'Admin user not found',
          details: 'Run: npm run db:seed to create the default admin user',
          defaultCredentials: {
            email: 'admin@damdayvillage.org',
            password: 'Admin@123'
          }
        });
      }

      // Check if admin user is properly configured
      const issues: string[] = [];
      
      if (!adminUser.password) {
        issues.push('Admin user has no password set');
      }
      if (!adminUser.verified) {
        issues.push('Admin user is not verified');
      }
      if (!adminUser.active) {
        issues.push('Admin user account is not active');
      }
      if (adminUser.role !== 'ADMIN') {
        issues.push(`Admin user has incorrect role: ${adminUser.role}`);
      }

      if (issues.length > 0) {
        return NextResponse.json({
          adminExists: true,
          configured: false,
          email: adminUser.email,
          issues,
          message: 'Admin user exists but has configuration issues',
        });
      }

      return NextResponse.json({
        adminExists: true,
        configured: true,
        email: adminUser.email,
        role: adminUser.role,
        message: 'Admin user is properly configured',
      });
    } catch (dbError) {
      const errorMsg = dbError instanceof Error ? dbError.message : 'Unknown database error';
      console.error('Database query error:', errorMsg);
      
      return NextResponse.json(
        { 
          adminExists: false,
          message: 'Database connection failed',
          details: errorMsg,
          help: 'Check that DATABASE_URL is correct and PostgreSQL is running'
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Admin verification error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        adminExists: false,
        message: 'Verification failed',
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}
