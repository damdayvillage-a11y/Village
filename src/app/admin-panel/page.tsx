'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Shield, 
  Users, 
  FileText, 
  Settings, 
  BarChart3,
  Home,
  Edit3,
  Eye,
  Palette,
  Database,
  MessageSquare,
  ShoppingBag,
  Calendar,
  Camera,
  Globe,
  Activity,
  AlertTriangle,
  RefreshCw,
  LogOut,
  ChevronRight,
  Bell,
  Search,
  Menu,
  X,
  Package,
  Cpu,
  TrendingUp,
  DollarSign,
  Leaf
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Badge } from '@/lib/components/ui/Badge';
import { Avatar } from '@/lib/components/ui/Avatar';
import { hasPermission } from '@/lib/auth/rbac';
import { ContentEditor } from '@/lib/components/admin-panel/ContentEditor';
import { UserManagement } from '@/lib/components/admin-panel/UserManagement';
import { BookingManagement } from '@/lib/components/admin-panel/BookingManagement';
import { ReviewManagement } from '@/lib/components/admin-panel/ReviewManagement';
import { ProductManagement } from '@/lib/components/admin-panel/ProductManagement';
import { OrderManagement } from '@/lib/components/admin-panel/OrderManagement';
import { MediaManager } from '@/lib/components/admin-panel/MediaManager';
import SystemSettings from '@/lib/components/admin-panel/SystemSettings';
import IoTDeviceManagement from '@/lib/components/admin-panel/IoTDeviceManagement';
import AnalyticsDashboard from '@/lib/components/admin-panel/AnalyticsDashboard';
import ThemeCustomizer from '@/lib/components/admin-panel/ThemeCustomizer';
import { signOut } from 'next-auth/react';

// Disable static generation for this page as it requires authentication
export const dynamic = 'force-dynamic';

interface AdminStats {
  totalUsers: number;
  activeBookings: number;
  pendingReviews: number;
  systemHealth: 'healthy' | 'warning' | 'error';
  complaints: number;
  articles: number;
  revenue?: number;
  totalProducts?: number;
  pendingOrders?: number;
  onlineDevices?: number;
}

export default function AdminPanelPage() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const status = sessionResult?.status || 'loading';
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 0,
    activeBookings: 0,
    pendingReviews: 0,
    systemHealth: 'healthy',
    complaints: 0,
    articles: 0
  });
  const [loading, setLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds
  const [activities, setActivities] = useState<any[]>([]);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());

  useEffect(() => {
    if (status === 'unauthenticated') {
      // Redirect to admin-specific login page
      router.push('/admin-panel/login');
      return;
    }
    
    if (status === 'authenticated' && session) {
      // Check if user has admin permissions
      if (!session.user?.role || (!hasPermission(session.user, 'manage_users') && !hasPermission(session.user, 'manage_content'))) {
        router.push('/auth/unauthorized?error=AdminRequired');
        return;
      }
      
      loadAdminData();
      loadActivities();
    }
  }, [status, router, session]);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      loadAdminData();
      loadActivities();
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const loadAdminData = async () => {
    try {
      setStatsError(null);
      // Load admin statistics
      const statsResponse = await fetch('/api/admin/stats');
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        setAdminStats(stats);
        setLastRefreshTime(new Date());
      } else {
        const errorData = await statsResponse.json().catch(() => ({}));
        const errorMsg = errorData.details || errorData.error || 'Failed to load statistics';
        setStatsError(errorMsg);
        console.error('Failed to load admin stats:', errorMsg);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Network error loading statistics';
      setStatsError(errorMsg);
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadActivities = async () => {
    try {
      const response = await fetch('/api/admin/activity');
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities);
      }
    } catch (error) {
      console.error('Failed to load activities:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, section: 'main' },
    { id: 'users', label: 'User Management', icon: Users, section: 'main', href: '/admin-panel/users' },
    { id: 'bookings', label: 'Booking Management', icon: Calendar, section: 'operations' },
    { id: 'complaints', label: 'Reviews & Complaints', icon: MessageSquare, section: 'operations' },
    { id: 'carbon-credits', label: 'Carbon Credits', icon: Leaf, section: 'operations', href: '/admin-panel/carbon-credits' },
    { id: 'marketplace', label: 'Marketplace Admin', icon: ShoppingBag, section: 'commerce', href: '/admin-panel/marketplace/orders' },
    { id: 'products', label: 'Product Management', icon: Package, section: 'commerce', href: '/admin-panel/marketplace/products' },
    { id: 'content', label: 'Content Editor', icon: Edit3, section: 'content' },
    { id: 'pages', label: 'Page Manager', icon: FileText, section: 'content' },
    { id: 'media', label: 'Media Manager', icon: Camera, section: 'content', href: '/admin-panel/media' },
    { id: 'devices', label: 'IoT Devices', icon: Cpu, section: 'monitoring' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, section: 'monitoring' },
    { id: 'control-center', label: 'Control Center', icon: Settings, section: 'settings', href: '/admin-panel/control-center' },
    { id: 'theme', label: 'Theme Customizer', icon: Palette, section: 'settings' },
    { id: 'system', label: 'System Settings', icon: Database, section: 'settings' }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h2>
        <p className="text-gray-600">
          Manage and monitor your Damday Village platform
        </p>
      </div>

      {/* Stats Error Alert */}
      {statsError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">Statistics Unavailable</h3>
              <p className="text-sm text-yellow-700 mt-1">{statsError}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => loadAdminData()}
                className="mt-2 text-yellow-800 hover:text-yellow-900 underline font-medium p-0 h-auto"
              >
                Retry Loading Statistics
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
              <p className="text-2xl font-semibold text-gray-900">{adminStats.totalUsers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Bookings</h3>
              <p className="text-2xl font-semibold text-gray-900">{adminStats.activeBookings}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
              <p className="text-2xl font-semibold text-gray-900">₹{adminStats.revenue || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${
              adminStats.systemHealth === 'healthy' ? 'bg-green-100' :
              adminStats.systemHealth === 'warning' ? 'bg-yellow-100' :
              'bg-red-100'
            }`}>
              <Activity className={`h-6 w-6 ${
                adminStats.systemHealth === 'healthy' ? 'text-green-600' :
                adminStats.systemHealth === 'warning' ? 'text-yellow-600' :
                'text-red-600'
              }`} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">System Health</h3>
              <p className="text-lg font-semibold text-gray-900 capitalize">{adminStats.systemHealth}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Products</p>
              <p className="text-xl font-bold text-gray-900">{adminStats.totalProducts || 0}</p>
            </div>
            <Package className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Pending Orders</p>
              <p className="text-xl font-bold text-gray-900">{adminStats.pendingOrders || 0}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Pending Reviews</p>
              <p className="text-xl font-bold text-gray-900">{adminStats.pendingReviews}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Online Devices</p>
              <p className="text-xl font-bold text-gray-900">{adminStats.onlineDevices || 0}</p>
            </div>
            <Cpu className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setActiveTab('content')}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Homepage Content
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setActiveTab('users')}
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setActiveTab('complaints')}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Review Complaints
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setActiveTab('theme')}
              >
                <Palette className="h-4 w-4 mr-2" />
                Customize Theme
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-2 text-xs">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="rounded"
                  />
                  <span>Auto-refresh</span>
                </label>
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  disabled={!autoRefresh}
                  className="text-xs px-2 py-1 border rounded"
                >
                  <option value={10000}>10s</option>
                  <option value={30000}>30s</option>
                  <option value={60000}>1m</option>
                  <option value={300000}>5m</option>
                </select>
                <button
                  onClick={() => {
                    loadAdminData();
                    loadActivities();
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Refresh now"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {lastRefreshTime.toLocaleTimeString()}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activities.length > 0 ? (
                activities.map((activity, index) => {
                  const colorMap: Record<string, string> = {
                    green: 'bg-green-500',
                    blue: 'bg-blue-500',
                    yellow: 'bg-yellow-500',
                    purple: 'bg-purple-500',
                    red: 'bg-red-500',
                  };
                  
                  const bgColor = colorMap[activity.color] || 'bg-gray-500';
                  
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${bgColor}`}></div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-gray-600 block truncate">{activity.message}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Activity className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const handleContentSave = async (blocks: any[]) => {
    try {
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blocks }),
      });

      if (!response.ok) {
        throw new Error('Failed to save content');
      }

      alert('Content saved successfully!');
    } catch (error) {
      console.error('Failed to save content:', error);
      alert('Failed to save content. Please try again.');
    }
  };

  const handleUserUpdate = async (userId: string, updates: any) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, updates }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  };

  const renderContentEditor = () => (
    <ContentEditor
      page="homepage"
      onSave={handleContentSave}
    />
  );

  const renderUserManagement = () => (
    <UserManagement
      onUserUpdate={handleUserUpdate}
    />
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'content':
        return renderContentEditor();
      case 'users':
        return renderUserManagement();
      case 'bookings':
        return <BookingManagement />;
      case 'complaints':
        return <ReviewManagement />;
      case 'marketplace':
        return <OrderManagement />;
      case 'products':
        return <ProductManagement />;
      case 'devices':
        return <IoTDeviceManagement />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'pages':
        return (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Page Manager</h3>
            <p className="text-gray-500 mb-4">Manage static pages and content blocks</p>
            <p className="text-sm text-gray-400">Available in Phase 3</p>
          </div>
        );
      case 'media':
        return <MediaManager />;
      case 'theme':
        return <ThemeCustomizer />;
      case 'system':
        return <SystemSettings />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
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
              <Shield className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">Damday Village</p>
              </div>
            </div>

            {/* Right side - User menu and logout */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative">
                <Bell className="h-5 w-5" />
                {adminStats.pendingReviews > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                  <p className="text-xs text-gray-500">{session?.user?.role}</p>
                </div>
                <Avatar 
                  initials={session?.user?.name?.charAt(0) || 'A'}
                  className="h-10 w-10 bg-primary-100 text-primary-700 font-semibold"
                />
                <button
                  onClick={() => signOut({ callbackUrl: '/admin-panel/login' })}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Enhanced Sidebar */}
        <aside className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          fixed lg:sticky top-16 left-0 z-40
          w-64 h-[calc(100vh-4rem)]
          bg-white border-r border-gray-200
          transition-transform duration-300 ease-in-out
          overflow-y-auto
        `}>
          <nav className="p-4 space-y-6">
            {/* Group sections */}
            {[
              { title: 'Main', items: sidebarItems.filter(i => i.section === 'main') },
              { title: 'Operations', items: sidebarItems.filter(i => i.section === 'operations') },
              { title: 'Commerce', items: sidebarItems.filter(i => i.section === 'commerce') },
              { title: 'Content', items: sidebarItems.filter(i => i.section === 'content') },
              { title: 'Monitoring', items: sidebarItems.filter(i => i.section === 'monitoring') },
              { title: 'Settings', items: sidebarItems.filter(i => i.section === 'settings') },
            ].map((group) => (
              <div key={group.title}>
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {group.title}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isCurrentPage = item.href ? false : activeTab === item.id;
                    
                    if (item.href) {
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900`}
                          onClick={() => {
                            if (window.innerWidth < 1024) setSidebarOpen(false);
                          }}
                        >
                          <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    }
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          if (window.innerWidth < 1024) setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isCurrentPage
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                        {isCurrentPage && (
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex items-center text-sm text-gray-500">
              <Home className="h-4 w-4 mr-2" />
              <span>Admin</span>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-gray-900 font-medium">
                {sidebarItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
              </span>
            </nav>
          </div>

          {/* Content */}
          {renderContent()}
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