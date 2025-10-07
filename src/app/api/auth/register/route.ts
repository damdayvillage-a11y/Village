import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';
import { hashPassword, validatePasswordStrength } from '../../../../../lib/auth/password';
import { UserRole } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
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

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          error: 'Password does not meet requirements',
          details: passwordValidation.errors
        },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['GUEST', 'HOST', 'SELLER', 'RESEARCHER'];
    const userRole = validRoles.includes(role) ? role as UserRole : UserRole.GUEST;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await db.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
        role: userRole,
        verified: false, // Require email verification for credentials users
        active: true,
        preferences: {
          language: 'en',
          notifications: true,
          marketing: false,
        },
      },
    });

    // Don't return sensitive information
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: userWithoutPassword,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}