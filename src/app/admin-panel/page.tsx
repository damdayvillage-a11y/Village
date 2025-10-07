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
  Activity
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
  const { data: session, status } = useSession();
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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/admin-panel');
      return;
    }
    
    if (status === 'authenticated') {
      // Check if user has admin permissions
      if (!session.user?.role || (!hasPermission(session.user, 'manage_users') && !hasPermission(session.user, 'manage_content'))) {
        router.push('/auth/unauthorized');
        return;
      }
      
      loadAdminData();
    }
  }, [status, router, session]);

  const loadAdminData = async () => {
    try {
      // Load admin statistics
      const statsResponse = await fetch('/api/admin/stats');
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        setAdminStats(stats);
      }
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
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
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">New user registration</span>
                <span className="text-xs text-gray-400">2 min ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Booking confirmed</span>
                <span className="text-xs text-gray-400">15 min ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">New complaint submitted</span>
                <span className="text-xs text-gray-400">1 hour ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Article published</span>
                <span className="text-xs text-gray-400">3 hours ago</span>
              </div>
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-primary-600" />
                <span className="text-xl font-display font-bold text-primary-900">
                  Admin Panel
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-red-100 text-red-800">
                <Shield className="h-3 w-3 mr-1" />
                Admin Access
              </Badge>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Back to Site
                </Button>
              </Link>
              <Avatar 
                src={session.user?.image} 
                alt={session.user?.name || 'Admin'} 
                size="sm"
              />
            </div>
          </div>
        </div>
      </header>

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