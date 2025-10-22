/**
 * Shared Admin Panel Navigation Configuration
 * Single source of truth for admin menu items
 * 
 * This consolidates navigation configuration to prevent duplication
 * between AdminPanelLayout and main dashboard page.
 */

export interface AdminMenuItem {
  id: string;
  label: string;
  icon: string; // Icon name (to be imported dynamically)
  href: string;
  section: string;
  description?: string;
  tabView?: string; // For dashboard SPA mode
}

export const ADMIN_MENU_SECTIONS = {
  main: 'Main',
  operations: 'Operations',
  commerce: 'Commerce',
  content: 'Content Management',
  monitoring: 'Monitoring',
  projects: 'Projects',
  settings: 'Settings',
} as const;

export const adminMenuItems: AdminMenuItem[] = [
  // Main Section
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'BarChart3',
    href: '/admin-panel',
    section: 'main',
    tabView: 'dashboard',
  },
  {
    id: 'users',
    label: 'User Management',
    icon: 'Users',
    href: '/admin-panel/users',
    section: 'main',
    tabView: 'users',
  },
  {
    id: 'leadership',
    label: 'Leadership',
    icon: 'UserCog',
    href: '/admin-panel/leadership',
    section: 'main',
    description: 'Manage village leaders',
  },
  
  // Operations Section
  {
    id: 'bookings-calendar',
    label: 'Booking Calendar',
    icon: 'Calendar',
    href: '/admin-panel/bookings/calendar',
    section: 'operations',
  },
  {
    id: 'bookings-availability',
    label: 'Availability',
    icon: 'Calendar',
    href: '/admin-panel/bookings/availability',
    section: 'operations',
  },
  {
    id: 'bookings-analytics',
    label: 'Booking Analytics',
    icon: 'TrendingUp',
    href: '/admin-panel/bookings/analytics',
    section: 'operations',
  },
  {
    id: 'carbon-credits',
    label: 'Carbon Credits',
    icon: 'Leaf',
    href: '/admin-panel/carbon-credits',
    section: 'operations',
  },
  
  // Commerce Section
  {
    id: 'orders',
    label: 'Orders',
    icon: 'ShoppingBag',
    href: '/admin-panel/marketplace/orders',
    section: 'commerce',
  },
  {
    id: 'products',
    label: 'Products',
    icon: 'Package',
    href: '/admin-panel/marketplace/products',
    section: 'commerce',
  },
  {
    id: 'categories',
    label: 'Categories',
    icon: 'FolderTree',
    href: '/admin-panel/marketplace/categories',
    section: 'commerce',
  },
  {
    id: 'sellers',
    label: 'Sellers',
    icon: 'Users',
    href: '/admin-panel/marketplace/sellers',
    section: 'commerce',
  },
  
  // Content Management Section
  {
    id: 'homepage-editor',
    label: 'Homepage Editor',
    icon: 'Home',
    href: '/admin-panel/homepage-editor',
    section: 'content',
    description: 'Customize homepage layout',
  },
  {
    id: 'page-builder',
    label: 'Page Builder',
    icon: 'FileText',
    href: '/admin-panel/cms/page-builder',
    section: 'content',
    description: 'Create and edit pages',
  },
  {
    id: 'navigation',
    label: 'Navigation',
    icon: 'FolderTree',
    href: '/admin-panel/cms/navigation',
    section: 'content',
  },
  {
    id: 'seo',
    label: 'SEO Settings',
    icon: 'Search',
    href: '/admin-panel/cms/seo',
    section: 'content',
  },
  {
    id: 'media',
    label: 'Media Library',
    icon: 'Camera',
    href: '/admin-panel/media',
    section: 'content',
  },
  
  // Monitoring Section
  {
    id: 'iot-devices',
    label: 'IoT Devices',
    icon: 'Cpu',
    href: '/admin-panel/iot/devices',
    section: 'monitoring',
  },
  {
    id: 'iot-telemetry',
    label: 'Telemetry',
    icon: 'Activity',
    href: '/admin-panel/iot/telemetry',
    section: 'monitoring',
  },
  {
    id: 'iot-alerts',
    label: 'IoT Alerts',
    icon: 'Bell',
    href: '/admin-panel/iot/alerts',
    section: 'monitoring',
  },
  {
    id: 'monitoring',
    label: 'System Monitor',
    icon: 'Activity',
    href: '/admin-panel/monitoring',
    section: 'monitoring',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'TrendingUp',
    href: '/admin-panel/analytics',
    section: 'monitoring',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'FileText',
    href: '/admin-panel/reports',
    section: 'monitoring',
  },
  {
    id: 'activity-logs',
    label: 'Activity Logs',
    icon: 'FileText',
    href: '/admin-panel/activity-logs',
    section: 'monitoring',
  },
  
  // Projects Section
  {
    id: 'projects',
    label: 'Projects',
    icon: 'FolderTree',
    href: '/admin-panel/projects',
    section: 'projects',
  },
  {
    id: 'project-funds',
    label: 'Project Funds',
    icon: 'TrendingUp',
    href: '/admin-panel/projects/funds',
    section: 'projects',
  },
  
  // Settings Section
  {
    id: 'control-center',
    label: 'Control Center',
    icon: 'LayoutDashboard',
    href: '/admin-panel/control-center',
    section: 'settings',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    href: '/admin-panel/settings',
    section: 'settings',
  },
  {
    id: 'features',
    label: 'Features',
    icon: 'Settings',
    href: '/admin-panel/settings/features',
    section: 'settings',
  },
  {
    id: 'email-templates',
    label: 'Email Templates',
    icon: 'MessageSquare',
    href: '/admin-panel/settings/email-templates',
    section: 'settings',
  },
  {
    id: 'theme',
    label: 'Theme',
    icon: 'Palette',
    href: '/admin-panel/cms/theme',
    section: 'settings',
  },
  {
    id: 'theme-advanced',
    label: 'Advanced Theme',
    icon: 'Palette',
    href: '/admin-panel/settings/theme/advanced',
    section: 'settings',
  },
  {
    id: 'branding',
    label: 'Branding',
    icon: 'Palette',
    href: '/admin-panel/settings/branding',
    section: 'settings',
  },
  {
    id: 'status',
    label: 'System Status',
    icon: 'Database',
    href: '/admin-panel/status',
    section: 'settings',
  },
];

/**
 * Get menu items grouped by section
 */
export function getMenuItemsBySection() {
  const grouped: Record<string, AdminMenuItem[]> = {};
  
  adminMenuItems.forEach(item => {
    if (!grouped[item.section]) {
      grouped[item.section] = [];
    }
    grouped[item.section].push(item);
  });
  
  return grouped;
}

/**
 * Get a single menu item by ID
 */
export function getMenuItemById(id: string): AdminMenuItem | undefined {
  return adminMenuItems.find(item => item.id === id);
}

/**
 * Get menu items for a specific section
 */
export function getMenuItemsForSection(section: string): AdminMenuItem[] {
  return adminMenuItems.filter(item => item.section === section);
}
