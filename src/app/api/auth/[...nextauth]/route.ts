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
    
    // Determine if this is a configuration error or a runtime error
    const isConfigError = errorMessage.includes('NEXTAUTH_URL') || 
                          errorMessage.includes('NEXTAUTH_SECRET') ||
                          errorMessage.includes('configuration');
    
    const isDbError = errorMessage.includes('database') ||
                      errorMessage.includes('connection') ||
                      errorMessage.includes('connect');
    
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
          help: 'See /api/auth/status for system diagnostics'
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