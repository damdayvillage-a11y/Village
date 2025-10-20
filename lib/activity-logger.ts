import { prisma } from './db';

export interface LogActivityParams {
  userId: string;
  action: string;
  entity?: string;
  entityId?: string;
  description?: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Log user activity to the database
 */
export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        description: params.description,
        metadata: params.metadata,
        ipAddress: params.ipAddress || 'unknown',
        userAgent: params.userAgent || 'unknown',
      },
    });
  } catch (error) {
    // Log error but don't throw to avoid breaking the main flow
    console.error('Failed to log activity:', error);
  }
}

/**
 * Common activity actions
 */
export const ActivityAction = {
  // Authentication
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  REGISTER: 'REGISTER',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  PASSWORD_RESET: 'PASSWORD_RESET',
  
  // CRUD operations
  CREATE: 'CREATE',
  READ: 'READ',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  
  // Specific actions
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  CANCEL: 'CANCEL',
  REFUND: 'REFUND',
  EXPORT: 'EXPORT',
  IMPORT: 'IMPORT',
  
  // User actions
  PROFILE_UPDATE: 'PROFILE_UPDATE',
  ROLE_CHANGE: 'ROLE_CHANGE',
  STATUS_CHANGE: 'STATUS_CHANGE',
} as const;

/**
 * Common entity types
 */
export const ActivityEntity = {
  USER: 'User',
  PRODUCT: 'Product',
  ORDER: 'Order',
  BOOKING: 'Booking',
  HOMESTAY: 'Homestay',
  PROJECT: 'Project',
  REVIEW: 'Review',
  ARTICLE: 'Article',
  DEVICE: 'Device',
} as const;
