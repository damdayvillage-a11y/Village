/**
 * Email Template types
 * Shared across email template editor and management pages
 */

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  category: string;
  variables: string[];
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export const TEMPLATE_CATEGORIES = [
  'Welcome',
  'Booking Confirmation',
  'Order Update',
  'Notification',
  'Password Reset',
  'Custom',
] as const;

export type TemplateCategory = typeof TEMPLATE_CATEGORIES[number];
