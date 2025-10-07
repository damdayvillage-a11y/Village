'use client';

import { useSession } from 'next-auth/react';
import { UserRole } from '@prisma/client';
import { hasPermission, Permission, canManageResource } from './rbac';

/**
 * Hook to get the current authenticated user
 */
export function useAuth() {
  const { data: session, status } = useSession();
  
  const user = session?.user ? {
    id: session.user.id,
    email: session.user.email!,
    name: session.user.name!,
    role: session.user.role,
    verified: session.user.verified,
    avatar: session.user.image,
    provider: session.user.provider,
  } : null;

  return {
    user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    isUnauthenticated: status === 'unauthenticated',
  };
}

/**
 * Hook to check if user has a specific permission
 */
export function usePermission(permission: Permission) {
  const { user } = useAuth();
  return hasPermission(user, permission);
}

/**
 * Hook to check if user has a specific role
 */
export function useRole(allowedRoles: UserRole | UserRole[]) {
  const { user } = useAuth();
  
  if (!user) return false;
  
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.includes(user.role);
}

/**
 * Hook to check if user is admin
 */
export function useIsAdmin() {
  return useRole(UserRole.ADMIN);
}

/**
 * Hook to check if user is village council member
 */
export function useIsVillageCouncil() {
  return useRole([UserRole.ADMIN, UserRole.VILLAGE_COUNCIL]);
}

/**
 * Hook to check if user is a host
 */
export function useIsHost() {
  return useRole([UserRole.ADMIN, UserRole.VILLAGE_COUNCIL, UserRole.HOST]);
}

/**
 * Hook to check if user is a seller
 */
export function useIsSeller() {
  return useRole([UserRole.ADMIN, UserRole.VILLAGE_COUNCIL, UserRole.SELLER]);
}

/**
 * Hook to check if user can manage a specific resource
 */
export function useCanManageResource(resourceOwnerId?: string) {
  const { user } = useAuth();
  return canManageResource(user, resourceOwnerId);
}

/**
 * Hook to require authentication with redirect
 */
export function useRequireAuth(redirectTo: string = '/auth/signin') {
  const { user, isLoading, isUnauthenticated } = useAuth();

  if (isLoading) return { user: null, isLoading: true, redirect: null };
  
  if (isUnauthenticated) {
    return { 
      user: null, 
      isLoading: false, 
      redirect: `${redirectTo}?callbackUrl=${encodeURIComponent(window.location.pathname)}` 
    };
  }
  
  return { user, isLoading: false, redirect: null };
}

/**
 * Hook to require specific permission with redirect
 */
export function useRequirePermission(permission: Permission, redirectTo: string = '/auth/unauthorized') {
  const { user, isLoading } = useAuth();
  const hasRequiredPermission = hasPermission(user, permission);

  if (isLoading) return { user: null, isLoading: true, redirect: null };
  
  if (!user) {
    return { 
      user: null, 
      isLoading: false, 
      redirect: `/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}` 
    };
  }
  
  if (!hasRequiredPermission) {
    return { 
      user: null, 
      isLoading: false, 
      redirect: `${redirectTo}?callbackUrl=${encodeURIComponent(window.location.pathname)}` 
    };
  }
  
  return { user, isLoading: false, redirect: null };
}

/**
 * Hook to require specific role with redirect
 */
export function useRequireRole(allowedRoles: UserRole[], redirectTo: string = '/auth/unauthorized') {
  const { user, isLoading } = useAuth();

  if (isLoading) return { user: null, isLoading: true, redirect: null };
  
  if (!user) {
    return { 
      user: null, 
      isLoading: false, 
      redirect: `/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}` 
    };
  }
  
  if (!allowedRoles.includes(user.role)) {
    return { 
      user: null, 
      isLoading: false, 
      redirect: `${redirectTo}?callbackUrl=${encodeURIComponent(window.location.pathname)}` 
    };
  }
  
  return { user, isLoading: false, redirect: null };
}