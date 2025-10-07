import { getServerSession } from 'next-auth/next';
import { authOptions } from './config';
import { UserRole } from '@prisma/client';
import { hasPermission, Permission } from './rbac';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  verified: boolean;
  avatar?: string;
  provider: string;
};

/**
 * Get the current session on the server side
 */
export async function getAuthSession() {
  const session = await getServerSession(authOptions);
  return session;
}

/**
 * Get the current user from session
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getAuthSession();
  
  if (!session?.user) return null;
  
  return {
    id: session.user.id,
    email: session.user.email!,
    name: session.user.name!,
    role: session.user.role,
    verified: session.user.verified,
    avatar: session.user.image || undefined,
    provider: session.user.provider,
  };
}

/**
 * Require authentication (throws error if not authenticated)
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

/**
 * Require specific permission (throws error if not authorized)
 */
export async function requirePermission(permission: Permission): Promise<AuthUser> {
  const user = await requireAuth();
  
  if (!hasPermission(user, permission)) {
    throw new Error(`Access denied. Required permission: ${permission}`);
  }
  
  return user;
}

/**
 * Require specific role (throws error if not authorized)
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<AuthUser> {
  const user = await requireAuth();
  
  if (!allowedRoles.includes(user.role)) {
    throw new Error(`Access denied. Required role: ${allowedRoles.join(' or ')}`);
  }
  
  return user;
}

/**
 * Check if current user is admin
 */
export async function requireAdmin(): Promise<AuthUser> {
  return await requireRole([UserRole.ADMIN]);
}

/**
 * Check if current user can manage a resource
 */
export async function requireResourceAccess(resourceOwnerId?: string): Promise<AuthUser> {
  const user = await requireAuth();
  
  // Admins can access everything
  if (user.role === UserRole.ADMIN) {
    return user;
  }
  
  // Village council can access village resources
  if (user.role === UserRole.VILLAGE_COUNCIL) {
    return user;
  }
  
  // Users can access their own resources
  if (resourceOwnerId && user.id === resourceOwnerId) {
    return user;
  }
  
  throw new Error('Access denied. Insufficient permissions to access this resource.');
}