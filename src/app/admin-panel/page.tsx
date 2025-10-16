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
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Badge } from '@/lib/components/ui/Badge';
import { Avatar } from '@/lib/components/ui/Avatar';
import { hasPermission } from '@/lib/auth/rbac';
import { ContentEditor } from '@/lib/components/admin-panel/ContentEditor';
import { UserManagement } from '@/lib/components/admin-panel/UserManagement';

// Disable static generation for this page as it requires authentication
export const dynamic = 'force-dynamic';

interface AdminStats {
  totalUsers: number;
  activeBookings: number;
  pendingReviews: number;
  systemHealth: 'healthy' | 'warning' | 'error';
  complaints: number;
  articles: number;
}

export default function AdminPanelPage() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const status = sessionResult?.status || 'loading';
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
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
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'content', label: 'Content Editor', icon: Edit3 },
    { id: 'pages', label: 'Page Manager', icon: FileText },
    { id: 'complaints', label: 'Complaints & Reviews', icon: MessageSquare },
    { id: 'bookings', label: 'Booking Management', icon: Calendar },
    { id: 'marketplace', label: 'Marketplace Admin', icon: ShoppingBag },
    { id: 'media', label: 'Media Manager', icon: Camera },
    { id: 'theme', label: 'Theme Customizer', icon: Palette },
    { id: 'system', label: 'System Settings', icon: Settings }
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
        <Card className="p-6">
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

        <Card className="p-6">
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

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pending Reviews</h3>
              <p className="text-2xl font-semibold text-gray-900">{adminStats.pendingReviews}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
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
      // TODO: Save to actual API endpoint
      console.log('Saving content blocks:', blocks);
      // Mock save delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Content saved successfully!');
    } catch (error) {
      console.error('Failed to save content:', error);
      alert('Failed to save content');
    }
  };

  const handleUserUpdate = async (userId: string, updates: any) => {
    try {
      // TODO: Call actual API endpoint
      console.log('Updating user:', userId, updates);
      // Mock update delay
      await new Promise(resolve => setTimeout(resolve, 500));
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
      case 'pages':
        return <div>Page Manager coming soon...</div>;
      case 'complaints':
        return <div>Complaints & Reviews management coming soon...</div>;
      case 'bookings':
        return <div>Booking Management coming soon...</div>;
      case 'marketplace':
        return <div>Marketplace Admin coming soon...</div>;
      case 'media':
        return <div>Media Manager coming soon...</div>;
      case 'theme':
        return <div>Theme Customizer coming soon...</div>;
      case 'system':
        return <div>System Settings coming soon...</div>;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}