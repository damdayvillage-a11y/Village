import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db';
import * as argon2 from 'argon2';

/**
 * POST /api/admin/users/create
 * Create a new user with enhanced features
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true },
    });

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      email,
      name,
      role,
      password,
      autoGeneratePassword = false,
      verified = false,
      active = true,
      sendWelcomeEmail = false,
      phone,
      avatar,
    } = body;

    // Validate required fields
    if (!email || !name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, role' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['ADMIN', 'VILLAGE_COUNCIL', 'HOST', 'SELLER', 'OPERATOR', 'GUEST', 'RESEARCHER'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Generate or use provided password
    let finalPassword = password;
    let generatedPassword = null;

    if (autoGeneratePassword || !password) {
      // Generate a random secure password
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      generatedPassword = Array.from({ length: 12 }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join('');
      finalPassword = generatedPassword;
    }

    // Hash password with argon2
    const hashedPassword = await argon2.hash(finalPassword);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        active,
        verified,
        phone: phone || null,
        avatar: avatar || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        verified: true,
        phone: true,
        avatar: true,
        createdAt: true,
      },
    });

    // TODO: Send welcome email if requested
    let emailSent = false;
    if (sendWelcomeEmail) {
      try {
        // Email sending logic would go here
        // For now, we'll just log it
        console.log(`Welcome email would be sent to ${email}`);
        emailSent = true;
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.active ? 'active' : 'inactive',
          verified: user.verified,
          phone: user.phone,
          avatar: user.avatar,
          createdAt: user.createdAt.toISOString(),
        },
        generatedPassword: generatedPassword || undefined,
        emailSent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
