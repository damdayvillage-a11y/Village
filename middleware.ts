import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserRole } from '@prisma/client';

// Define protected routes and their required roles/permissions
const PROTECTED_ROUTES = {
  // Admin routes
  '/admin': [UserRole.ADMIN],
  '/admin/*': [UserRole.ADMIN],
  
  // Dashboard routes (authenticated users only)
  '/dashboard': [
    UserRole.ADMIN,
    UserRole.VILLAGE_COUNCIL,
    UserRole.HOST,
    UserRole.SELLER,
    UserRole.OPERATOR,
    UserRole.GUEST,
    UserRole.RESEARCHER,
  ],
  
  // Village council routes
  '/village/manage': [UserRole.ADMIN, UserRole.VILLAGE_COUNCIL],
  
  // Host routes
  '/host': [UserRole.ADMIN, UserRole.VILLAGE_COUNCIL, UserRole.HOST],
  '/host/*': [UserRole.ADMIN, UserRole.VILLAGE_COUNCIL, UserRole.HOST],
  
  // Seller routes
  '/seller': [UserRole.ADMIN, UserRole.VILLAGE_COUNCIL, UserRole.SELLER],
  '/seller/*': [UserRole.ADMIN, UserRole.VILLAGE_COUNCIL, UserRole.SELLER],
  
  // Operator routes
  '/operator': [UserRole.ADMIN, UserRole.OPERATOR],
  '/operator/*': [UserRole.ADMIN, UserRole.OPERATOR],
  
  // API routes that require authentication
  '/api/users': [UserRole.ADMIN],
  '/api/admin/*': [UserRole.ADMIN],
  '/api/host/*': [UserRole.ADMIN, UserRole.VILLAGE_COUNCIL, UserRole.HOST],
  '/api/seller/*': [UserRole.ADMIN, UserRole.VILLAGE_COUNCIL, UserRole.SELLER],
} as const;

function matchRoute(path: string, pattern: string): boolean {
  if (pattern === path) return true;
  if (pattern.endsWith('/*')) {
    const basePath = pattern.slice(0, -2);
    return path.startsWith(basePath);
  }
  return false;
}

function getRequiredRoles(path: string): UserRole[] | null {
  for (const [pattern, roles] of Object.entries(PROTECTED_ROUTES)) {
    if (matchRoute(path, pattern)) {
      return [...roles]; // Create a mutable copy
    }
  }
  return null;
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;
    
    // Check if the route requires specific roles
    const requiredRoles = getRequiredRoles(pathname);
    
    if (requiredRoles) {
      // Check if user has required role
      const userRole = token?.role as UserRole;
      
      if (!userRole || !requiredRoles.includes(userRole)) {
        // Redirect to unauthorized page
        const url = req.nextUrl.clone();
        url.pathname = '/auth/unauthorized';
        url.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(url);
      }
      
      // Check if user is verified (except for OAuth users)
      if (token?.provider === 'credentials' && !token?.verified) {
        const url = req.nextUrl.clone();
        url.pathname = '/auth/verify-email';
        url.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(url);
      }
    }
    
    // Security headers
    const response = NextResponse.next();
    
    // Add security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    // CSP header
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https:",
        "connect-src 'self'",
      ].join('; ')
    );
    
    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Public routes that don't require authentication
        const publicRoutes = [
          '/',
          '/about',
          '/contact',
          '/auth/signin',
          '/auth/signup',
          '/auth/error',
          '/auth/verify-request',
          '/auth/unauthorized',
          '/api/health',
          '/api/public/*',
        ];
        
        // Check if route is public
        const isPublicRoute = publicRoutes.some(route => {
          if (route === pathname) return true;
          if (route.endsWith('/*')) {
            const basePath = route.slice(0, -2);
            return pathname.startsWith(basePath);
          }
          return false;
        });
        
        if (isPublicRoute) return true;
        
        // All other routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};