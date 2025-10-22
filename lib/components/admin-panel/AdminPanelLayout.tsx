'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield,
  Users,
  FileText,
  Settings,
  BarChart3,
  Home,
  Edit3,
  Camera,
  Menu,
  X,
  ChevronRight,
  Bell,
  LogOut,
  Package,
  Cpu,
  Calendar,
  MessageSquare,
  ShoppingBag,
  Leaf,
  Globe,
  Palette,
  Activity,
  Database,
  TrendingUp,
  UserCog,
  LayoutDashboard,
  FolderTree,
  Search,
} from 'lucide-react';
import { Avatar } from '@/lib/components/ui/Avatar';

interface AdminPanelLayoutProps {
  children: ReactNode;
  session?: any;
  title?: string;
  subtitle?: string;
  showBreadcrumb?: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  href: string;
  section: string;
  description?: string;
}

export function AdminPanelLayout({
  children,
  session,
  title,
  subtitle,
  showBreadcrumb = true,
}: AdminPanelLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    // Main
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      href: '/admin-panel',
      section: 'main',
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      href: '/admin-panel/users',
      section: 'main',
    },
    {
      id: 'leadership',
      label: 'Leadership',
      icon: UserCog,
      href: '/admin-panel/leadership',
      section: 'main',
      description: 'Manage village leaders',
    },
    // Operations
    {
      id: 'bookings-calendar',
      label: 'Booking Calendar',
      icon: Calendar,
      href: '/admin-panel/bookings/calendar',
      section: 'operations',
    },
    {
      id: 'bookings-availability',
      label: 'Availability',
      icon: Calendar,
      href: '/admin-panel/bookings/availability',
      section: 'operations',
    },
    {
      id: 'carbon-credits',
      label: 'Carbon Credits',
      icon: Leaf,
      href: '/admin-panel/carbon-credits',
      section: 'operations',
    },
    // Commerce
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      href: '/admin-panel/marketplace/orders',
      section: 'commerce',
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      href: '/admin-panel/marketplace/products',
      section: 'commerce',
    },
    {
      id: 'sellers',
      label: 'Sellers',
      icon: Users,
      href: '/admin-panel/marketplace/sellers',
      section: 'commerce',
    },
    // Content Management
    {
      id: 'homepage-editor',
      label: 'Homepage Editor',
      icon: Home,
      href: '/admin-panel/homepage-editor',
      section: 'content',
      description: 'Customize homepage layout',
    },
    {
      id: 'page-builder',
      label: 'Page Builder',
      icon: FileText,
      href: '/admin-panel/cms/page-builder',
      section: 'content',
      description: 'Create and edit pages',
    },
    {
      id: 'navigation',
      label: 'Navigation',
      icon: FolderTree,
      href: '/admin-panel/cms/navigation',
      section: 'content',
    },
    {
      id: 'seo',
      label: 'SEO Settings',
      icon: Search,
      href: '/admin-panel/cms/seo',
      section: 'content',
    },
    {
      id: 'media',
      label: 'Media Library',
      icon: Camera,
      href: '/admin-panel/media',
      section: 'content',
    },
    // Monitoring
    {
      id: 'iot-devices',
      label: 'IoT Devices',
      icon: Cpu,
      href: '/admin-panel/iot/devices',
      section: 'monitoring',
    },
    {
      id: 'iot-telemetry',
      label: 'Telemetry',
      icon: Activity,
      href: '/admin-panel/iot/telemetry',
      section: 'monitoring',
    },
    {
      id: 'monitoring',
      label: 'System Monitor',
      icon: Activity,
      href: '/admin-panel/monitoring',
      section: 'monitoring',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
      href: '/admin-panel/analytics',
      section: 'monitoring',
    },
    {
      id: 'activity-logs',
      label: 'Activity Logs',
      icon: FileText,
      href: '/admin-panel/activity-logs',
      section: 'monitoring',
    },
    // Projects
    {
      id: 'projects',
      label: 'Projects',
      icon: FolderTree,
      href: '/admin-panel/projects',
      section: 'projects',
    },
    {
      id: 'project-funds',
      label: 'Project Funds',
      icon: TrendingUp,
      href: '/admin-panel/projects/funds',
      section: 'projects',
    },
    // Settings
    {
      id: 'control-center',
      label: 'Control Center',
      icon: LayoutDashboard,
      href: '/admin-panel/control-center',
      section: 'settings',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      href: '/admin-panel/settings',
      section: 'settings',
    },
    {
      id: 'theme',
      label: 'Theme',
      icon: Palette,
      href: '/admin-panel/cms/theme',
      section: 'settings',
    },
    {
      id: 'branding',
      label: 'Branding',
      icon: Palette,
      href: '/admin-panel/settings/branding',
      section: 'settings',
    },
    {
      id: 'status',
      label: 'System Status',
      icon: Database,
      href: '/admin-panel/status',
      section: 'settings',
    },
  ];

  const sections = [
    { title: 'Main', key: 'main' },
    { title: 'Operations', key: 'operations' },
    { title: 'Commerce', key: 'commerce' },
    { title: 'Content', key: 'content' },
    { title: 'Monitoring', key: 'monitoring' },
    { title: 'Projects', key: 'projects' },
    { title: 'Settings', key: 'settings' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin-panel') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  const getCurrentPageTitle = () => {
    if (title) return title;
    const currentItem = menuItems.find((item) => isActive(item.href));
    return currentItem?.label || 'Admin Panel';
  };

  const getBreadcrumbs = () => {
    if (!pathname) return [];
    const parts = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Admin', href: '/admin-panel' }];
    
    let currentPath = '';
    for (let i = 1; i < parts.length; i++) {
      currentPath += '/' + parts[i];
      const item = menuItems.find((m) => m.href === `/admin-panel${currentPath}`);
      if (item) {
        breadcrumbs.push({ label: item.label, href: item.href });
      } else {
        // Capitalize and format the slug
        const label = parts[i]
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        breadcrumbs.push({ label, href: `/admin-panel${currentPath}` });
      }
    }
    
    return breadcrumbs;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 mr-2"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Link href="/admin-panel" className="flex items-center">
                <Shield className="h-8 w-8 text-primary-600 mr-3" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                  <p className="text-xs text-gray-500">Damday Village</p>
                </div>
              </Link>
            </div>

            {/* Right side - User menu */}
            <div className="flex items-center space-x-4">
              {/* View Site Link */}
              <Link
                href="/"
                target="_blank"
                className="text-sm text-gray-600 hover:text-gray-900 hidden sm:block"
              >
                <Globe className="h-5 w-5" />
              </Link>

              {/* Notifications */}
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative">
                <Bell className="h-5 w-5" />
              </button>

              {/* User Profile */}
              {session?.user && (
                <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-gray-500">{session.user.role}</p>
                  </div>
                  <Avatar
                    initials={session.user.name?.charAt(0) || 'A'}
                    className="h-10 w-10 bg-primary-100 text-primary-700 font-semibold"
                  />
                  <Link
                    href="/api/auth/signout"
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          fixed lg:sticky top-16 left-0 z-40
          w-64 h-[calc(100vh-4rem)]
          bg-white border-r border-gray-200
          transition-transform duration-300 ease-in-out
          overflow-y-auto
        `}
        >
          <nav className="p-4 space-y-6">
            {sections.map((section) => {
              const items = menuItems.filter((item) => item.section === section.key);
              if (items.length === 0) return null;

              return (
                <div key={section.key}>
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);

                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            active
                              ? 'bg-primary-100 text-primary-700'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                          onClick={() => {
                            if (window.innerWidth < 1024) setSidebarOpen(false);
                          }}
                          title={item.description}
                        >
                          <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                          <span className="truncate">{item.label}</span>
                          {active && <ChevronRight className="h-4 w-4 ml-auto" />}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {/* Breadcrumb */}
          {showBreadcrumb && (
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <nav className="flex items-center text-sm text-gray-500">
                <Home className="h-4 w-4 mr-2" />
                {getBreadcrumbs().map((crumb, index) => (
                  <div key={crumb.href} className="flex items-center">
                    {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
                    {index === getBreadcrumbs().length - 1 ? (
                      <span className="text-gray-900 font-medium">{crumb.label}</span>
                    ) : (
                      <Link href={crumb.href} className="hover:text-gray-900">
                        {crumb.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          )}

          {/* Page Header */}
          {(title || subtitle) && (
            <div className="bg-white border-b border-gray-200 px-6 py-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {title || getCurrentPageTitle()}
              </h2>
              {subtitle && <p className="text-gray-600">{subtitle}</p>}
            </div>
          )}

          {/* Page Content */}
          <div className="p-6">{children}</div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
