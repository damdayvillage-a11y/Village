import NextAuth from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../../../../lib/auth/config';

const handler = NextAuth(authOptions);

// Wrap the handler with error handling
async function wrappedHandler(req: NextRequest) {
  try {
    return await handler(req as any);
  } catch (error) {
    console.error('NextAuth handler error:', error);
    
    // Return a proper error response instead of letting it crash
    const errorMessage = error instanceof Error ? error.message : 'Authentication error';
    
    // For API requests, return JSON error
    if (req.headers.get('accept')?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Authentication failed', details: errorMessage },
        { status: 500 }
      );
    }
    
    // For page requests, redirect to error page
    const url = new URL('/auth/error?error=Configuration', req.url);
    return NextResponse.redirect(url);
  }
}

export { wrappedHandler as GET, wrappedHandler as POST };