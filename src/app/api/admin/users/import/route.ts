import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db';
import { UserRole } from '@prisma/client';
import { hashPassword } from '@/lib/auth/password';
import { logActivity, ActivityAction, ActivityEntity } from '@/lib/activity-logger';

export const dynamic = 'force-dynamic';

interface ImportUser {
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  password?: string;
}

interface ImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: Array<{ row: number; email: string; error: string }>;
}

// Import users from CSV
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user?.role !== UserRole.ADMIN && session.user?.role !== UserRole.VILLAGE_COUNCIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { users, preview = false } = body;

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ error: 'Users array is required' }, { status: 400 });
    }

    const result: ImportResult = {
      success: true,
      imported: 0,
      failed: 0,
      errors: [],
    };

    // Validate and import users
    for (let i = 0; i < users.length; i++) {
      const userData = users[i];
      const rowNumber = i + 1;

      try {
        // Validation
        if (!userData.email || !userData.name) {
          result.errors.push({
            row: rowNumber,
            email: userData.email || 'unknown',
            error: 'Email and name are required',
          });
          result.failed++;
          continue;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
          result.errors.push({
            row: rowNumber,
            email: userData.email,
            error: 'Invalid email format',
          });
          result.failed++;
          continue;
        }

        // Validate role
        const validRoles = Object.values(UserRole);
        if (userData.role && !validRoles.includes(userData.role)) {
          result.errors.push({
            row: rowNumber,
            email: userData.email,
            error: `Invalid role: ${userData.role}`,
          });
          result.failed++;
          continue;
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: userData.email },
        });

        if (existingUser) {
          result.errors.push({
            row: rowNumber,
            email: userData.email,
            error: 'User with this email already exists',
          });
          result.failed++;
          continue;
        }

        // Preview mode - don't actually import
        if (preview) {
          result.imported++;
          continue;
        }

        // Hash password if provided, otherwise generate random one
        const password = userData.password || Math.random().toString(36).slice(-12);
        const hashedPassword = await hashPassword(password);

        // Create user
        await prisma.user.create({
          data: {
            email: userData.email,
            name: userData.name,
            role: userData.role || UserRole.GUEST,
            phone: userData.phone,
            password: hashedPassword,
            active: true,
            verified: false,
          },
        });

        result.imported++;
      } catch (error) {
        result.errors.push({
          row: rowNumber,
          email: userData.email,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        result.failed++;
      }
    }

    // Log activity
    if (session.user?.id && !preview) {
      await logActivity({
        userId: session.user.id,
        action: ActivityAction.IMPORT,
        entity: ActivityEntity.USER,
        description: `Imported ${result.imported} users from CSV`,
        metadata: { imported: result.imported, failed: result.failed, totalRows: users.length },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      });
    }

    result.success = result.failed === 0;

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to import users:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
