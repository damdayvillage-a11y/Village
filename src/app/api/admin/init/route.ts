import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';
import { hashPassword } from '../../../../../lib/auth/password';

export const dynamic = 'force-dynamic';

/**
 * Admin Initialization Endpoint
 * 
 * This endpoint attempts to create the default admin user if it doesn't exist.
 * Useful for automated recovery from missing admin user scenarios.
 * 
 * Security: This endpoint should be protected or disabled in production after initial setup.
 */
async function initializeAdmin() {
  // Check if database is configured
  if (!process.env.DATABASE_URL || 
      process.env.DATABASE_URL.includes('dummy:dummy') ||
      process.env.DATABASE_URL.includes('$$cap_')) {
    return NextResponse.json(
      { 
        error: 'Database not configured',
        message: 'DATABASE_URL is not properly configured',
        details: 'Replace $$cap_*$$ placeholders with actual values'
      },
      { status: 503 }
    );
  }

  // Check if admin user already exists
  const existingAdmin = await db.user.findUnique({
    where: { email: 'admin@damdayvillage.org' },
    select: { id: true, email: true, role: true },
  });

  if (existingAdmin) {
    return NextResponse.json({
      success: true,
      message: 'Admin user already exists',
      admin: {
        email: existingAdmin.email,
        role: existingAdmin.role,
      },
      credentials: {
        email: 'admin@damdayvillage.org',
        note: 'Use your configured password or default: Admin@123'
      }
    });
  }

  // Create admin user
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@123';
  const hashedPassword = await hashPassword(adminPassword);

  const adminUser = await db.user.create({
    data: {
      email: 'admin@damdayvillage.org',
      name: 'Village Administrator',
      role: 'ADMIN',
      password: hashedPassword,
      verified: true,
      active: true,
      preferences: {
        language: 'en',
        notifications: true,
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  return NextResponse.json({
    success: true,
    message: 'Admin user created successfully',
    admin: adminUser,
    credentials: {
      email: 'admin@damdayvillage.org',
      password: adminPassword,
      warning: '⚠️ IMPORTANT: Change this password immediately after first login!',
    },
  }, { status: 201 });
}

export async function GET(request: NextRequest) {
  try {
    return await initializeAdmin();
  } catch (error) {
    console.error('Admin initialization error (GET):', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Provide helpful error messages
    if (errorMessage.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { 
          error: 'Database connection refused',
          message: 'Cannot connect to PostgreSQL. Is the database running?',
          help: 'Check that DATABASE_URL points to a running PostgreSQL instance'
        },
        { status: 503 }
      );
    }
    
    if (errorMessage.includes('ENOTFOUND')) {
      return NextResponse.json(
        { 
          error: 'Database host not found',
          message: 'The database hostname could not be resolved. Check DATABASE_URL.',
          help: 'Verify the hostname in your DATABASE_URL is correct'
        },
        { status: 503 }
      );
    }

    if (errorMessage.includes('authentication')) {
      return NextResponse.json(
        { 
          error: 'Database authentication failed',
          message: 'Invalid database credentials. Check DATABASE_URL username and password.',
          help: 'Verify the username and password in your DATABASE_URL'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Admin initialization failed',
        message: errorMessage,
        help: 'Try running: npm run db:seed'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    return await initializeAdmin();
  } catch (error) {
    console.error('Admin initialization error (POST):', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Provide helpful error messages
    if (errorMessage.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { 
          error: 'Database connection refused',
          message: 'Cannot connect to PostgreSQL. Is the database running?',
          help: 'Check that DATABASE_URL points to a running PostgreSQL instance'
        },
        { status: 503 }
      );
    }
    
    if (errorMessage.includes('ENOTFOUND')) {
      return NextResponse.json(
        { 
          error: 'Database host not found',
          message: 'The database hostname could not be resolved. Check DATABASE_URL.',
          help: 'Verify the hostname in your DATABASE_URL is correct'
        },
        { status: 503 }
      );
    }

    if (errorMessage.includes('authentication')) {
      return NextResponse.json(
        { 
          error: 'Database authentication failed',
          message: 'Invalid database credentials. Check DATABASE_URL username and password.',
          help: 'Verify the username and password in your DATABASE_URL'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Admin initialization failed',
        message: errorMessage,
        help: 'Try running: npm run db:seed'
      },
      { status: 500 }
    );
  }
}
