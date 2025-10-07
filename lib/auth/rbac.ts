import { UserRole } from '@prisma/client';
import { Session } from 'next-auth';

export type Permission = 
  | 'manage_users'
  | 'manage_villages' 
  | 'manage_homestays'
  | 'manage_products'
  | 'manage_projects'
  | 'manage_devices'
  | 'view_admin_dashboard'
  | 'manage_system_settings'
  | 'view_analytics'
  | 'manage_payments'
  | 'manage_content'
  | 'manage_village_content'
  | 'approve_homestays'
  | 'view_village_analytics'
  | 'manage_community_events'
  | 'moderate_reviews'
  | 'manage_own_homestays'
  | 'view_bookings'
  | 'manage_booking_calendar'
  | 'respond_to_reviews'
  | 'view_hosting_analytics'
  | 'manage_own_products'
  | 'view_orders'
  | 'manage_inventory'
  | 'view_sales_analytics'
  | 'view_telemetry'
  | 'manage_maintenance'
  | 'view_operational_dashboard'
  | 'view_homestays'
  | 'make_bookings'
  | 'view_products'
  | 'make_purchases'
  | 'write_reviews'
  | 'view_public_content'
  | 'view_public_data'
  | 'view_environmental_data'
  | 'export_anonymized_data'
  | 'view_research_dashboard';

// Define permissions for each role
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    'manage_users',
    'manage_villages', 
    'manage_homestays',
    'manage_products',
    'manage_projects',
    'manage_devices',
    'view_admin_dashboard',
    'manage_system_settings',
    'view_analytics',
    'manage_payments',
    'manage_content',
  ],
  [UserRole.VILLAGE_COUNCIL]: [
    'manage_village_content',
    'manage_projects',
    'approve_homestays',
    'view_village_analytics',
    'manage_community_events',
    'moderate_reviews',
  ],
  [UserRole.HOST]: [
    'manage_own_homestays',
    'view_bookings',
    'manage_booking_calendar',
    'respond_to_reviews',
    'view_hosting_analytics',
  ],
  [UserRole.SELLER]: [
    'manage_own_products',
    'view_orders',
    'manage_inventory',
    'view_sales_analytics',
    'respond_to_reviews',
  ],
  [UserRole.OPERATOR]: [
    'manage_devices',
    'view_telemetry',
    'manage_maintenance',
    'view_operational_dashboard',
  ],
  [UserRole.GUEST]: [
    'view_homestays',
    'make_bookings',
    'view_products',
    'make_purchases',
    'write_reviews',
    'view_public_content',
  ],
  [UserRole.RESEARCHER]: [
    'view_public_data',
    'view_environmental_data',
    'export_anonymized_data',
    'view_research_dashboard',
  ],
};

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  user: { role: UserRole } | null,
  permission: Permission
): boolean {
  if (!user) return false;
  
  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  return userPermissions.includes(permission);
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(
  user: { role: UserRole } | null,
  permissions: Permission[]
): boolean {
  if (!user) return false;
  
  return permissions.some(permission => hasPermission(user, permission));
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(
  user: { role: UserRole } | null,
  permissions: Permission[]
): boolean {
  if (!user) return false;
  
  return permissions.every(permission => hasPermission(user, permission));
}

/**
 * Get all permissions for a user role
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if a role is higher than another role (for hierarchical permissions)
 */
export function isRoleHigherThan(role1: UserRole, role2: UserRole): boolean {
  const roleHierarchy = [
    UserRole.GUEST,
    UserRole.RESEARCHER,
    UserRole.SELLER,
    UserRole.HOST,
    UserRole.OPERATOR,
    UserRole.VILLAGE_COUNCIL,
    UserRole.ADMIN,
  ];
  
  const index1 = roleHierarchy.indexOf(role1);
  const index2 = roleHierarchy.indexOf(role2);
  
  return index1 > index2;
}

/**
 * Middleware function to check permissions
 */
export function requirePermission(permission: Permission) {
  return (user: { role: UserRole } | null) => {
    if (!hasPermission(user, permission)) {
      throw new Error(`Access denied. Required permission: ${permission}`);
    }
    return true;
  };
}

/**
 * Middleware function to check role
 */
export function requireRole(allowedRoles: UserRole[]) {
  return (user: { role: UserRole } | null) => {
    if (!user || !allowedRoles.includes(user.role)) {
      throw new Error(`Access denied. Required role: ${allowedRoles.join(' or ')}`);
    }
    return true;
  };
}

/**
 * Check if user can manage a specific resource
 */
export function canManageResource(
  user: { id: string; role: UserRole } | null,
  resourceOwnerId?: string
): boolean {
  if (!user) return false;
  
  // Admins can manage everything
  if (user.role === UserRole.ADMIN) return true;
  
  // Village council can manage village resources
  if (user.role === UserRole.VILLAGE_COUNCIL) return true;
  
  // Users can manage their own resources
  if (resourceOwnerId && user.id === resourceOwnerId) return true;
  
  return false;
}