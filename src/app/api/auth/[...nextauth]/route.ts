import NextAuth from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../../../../lib/auth/config';

const handler = NextAuth(authOptions);

// Wrap the handler with error handling
async function wrappedHandler(
  req: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  try {
    // Pre-flight validation to catch configuration errors early
    // This prevents 500 errors from NextAuth initialization
    if (!process.env.NEXTAUTH_URL) {
      throw new Error('NEXTAUTH_URL is not configured. Please set it in your environment variables.');
    }
    
    if (!process.env.NEXTAUTH_SECRET) {
      throw new Error('NEXTAUTH_SECRET is not configured. Please generate a secret with: openssl rand -base64 32');
    }
    
    if (process.env.NEXTAUTH_SECRET.length < 32) {
      throw new Error('NEXTAUTH_SECRET is too short. It must be at least 32 characters long.');
    }
    
    // Check for CapRover placeholders that haven't been replaced
    if (process.env.NEXTAUTH_URL.includes('$$cap_')) {
      throw new Error('NEXTAUTH_URL contains unreplaced CapRover placeholders ($$cap_*$$). Please replace them with actual values.');
    }
    
    if (process.env.NEXTAUTH_SECRET.includes('$$cap_')) {
      throw new Error('NEXTAUTH_SECRET contains unreplaced CapRover placeholders ($$cap_*$$). Please replace with a secure secret.');
    }
    
    return await handler(req, context);
  } catch (error) {
    console.error('NextAuth handler error:', error);
    
    // Return a proper error response instead of letting it crash
    const errorMessage = error instanceof Error ? error.message : 'Authentication error';
    
    // Determine if this is a configuration error or a runtime error
    const isConfigError = errorMessage.includes('NEXTAUTH_URL') || 
                          errorMessage.includes('NEXTAUTH_SECRET') ||
                          errorMessage.includes('configuration') ||
                          errorMessage.includes('$$cap_') ||
                          errorMessage.includes('not configured');
    
    const isDbError = errorMessage.includes('database') ||
                      errorMessage.includes('DATABASE_URL') ||
                      errorMessage.includes('connection') ||
                      errorMessage.includes('connect') ||
                      errorMessage.includes('Prisma');
    
    // For API requests (like session/signin), return JSON error
    if (req.headers.get('accept')?.includes('application/json') || 
        req.url.includes('/api/auth/')) {
      
      let statusCode = 500;
      let errorType = 'AuthenticationError';
      
      if (isConfigError) {
        statusCode = 500;
        errorType = 'ConfigurationError';
      } else if (isDbError) {
        statusCode = 503;
        errorType = 'ServiceUnavailable';
      }
      
      return NextResponse.json(
        { 
          error: errorType,
          message: errorMessage,
          help: 'See /admin-panel/status for system diagnostics',
          recommendations: isConfigError 
            ? ['Check environment variables in your deployment platform', 'Replace all $$cap_*$$ placeholders', 'Visit /admin-panel/status for detailed checks']
            : ['Check database connection', 'Verify DATABASE_URL is correct', 'Ensure PostgreSQL is running']
        },
        { status: statusCode }
      );
    }
    
    // For page requests, redirect to error page with appropriate error code
    const errorType = isConfigError ? 'Configuration' : 
                      isDbError ? 'ServiceUnavailable' : 
                      'Default';
    const url = new URL(`/auth/error?error=${errorType}`, req.url);
    return NextResponse.redirect(url);
  }
}

export { wrappedHandler as GET, wrappedHandler as POST };