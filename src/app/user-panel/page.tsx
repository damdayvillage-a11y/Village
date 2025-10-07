'use client';

import { useState, useEffect } from 'react';

// Disable static generation for this page as it requires authentication
export const dynamic = 'force-dynamic';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  MessageSquare, 
  FileText, 
  Bell, 
  Settings, 
  Calendar,
  ShoppingBag,
  Heart,
  Award,
  BarChart3,
  Home,
  PlusCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Badge } from '@/lib/components/ui/Badge';
import { Avatar } from '@/lib/components/ui/Avatar';
import { ComplaintsForm } from '@/lib/components/user-panel/ComplaintsForm';
import { ArticleEditor } from '@/lib/components/user-panel/ArticleEditor';

interface UserStats {
  bookings: number;
  orders: number;
  articles: number;
  contributions: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

interface Article {
  id: string;
  title: string;
  status: 'draft' | 'published' | 'review';
  publishedAt?: string;
  views?: number;
  content?: string;
}

interface Complaint {
  id: string;
  type: 'complaint' | 'suggestion';
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'reviewed' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  adminResponse?: string;
}

export default function UserPanelPage() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const status = sessionResult?.status || 'loading';
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userStats, setUserStats] = useState<UserStats>({
    bookings: 0,
    orders: 0,
    articles: 0,
    contributions: 0
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/user-panel');
      return;
    }
    
    if (status === 'authenticated') {
      loadUserData();
    }
  }, [status, router]);

  const loadUserData = async () => {
    try {
      // Load user statistics
      const statsResponse = await fetch('/api/user/stats');
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        setUserStats(stats);
      }

      // Load notifications
      const notificationsResponse = await fetch('/api/user/notifications');
      if (notificationsResponse.ok) {
        const notifs = await notificationsResponse.json();
        setNotifications(notifs);
      }

      // Load user articles
      const articlesResponse = await fetch('/api/user/articles');
      if (articlesResponse.ok) {
        const userArticles = await articlesResponse.json();
        setArticles(userArticles);
      }

      // Load complaints and suggestions
      const complaintsResponse = await fetch('/api/user/complaints');
      if (complaintsResponse.ok) {
        const userComplaints = await complaintsResponse.json();
        setComplaints(userComplaints);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/user/notifications/${notificationId}/read`, {
        method: 'POST'
      });
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleArticleSubmit = async (data: {
    title: string;
    content: string;
    status: 'draft' | 'published' | 'review';
  }) => {
    try {
      const response = await fetch('/api/user/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newArticle = await response.json();
        setArticles(prev => [newArticle, ...prev]);
      } else {
        throw new Error('Failed to create article');
      }
    } catch (error) {
      console.error('Failed to submit article:', error);
      throw error;
    }
  };

  const handleArticleUpdate = async (id: string, data: {
    title: string;
    content: string;
    status: 'draft' | 'published' | 'review';
  }) => {
    // TODO: Implement article update endpoint
    console.log('Update article:', id, data);
  };

  const handleArticleDelete = async (id: string) => {
    // TODO: Implement article delete endpoint
    console.log('Delete article:', id);
  };

  const handleComplaintSubmit = async (data: {
    type: 'complaint' | 'suggestion';
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }) => {
    try {
      const response = await fetch('/api/user/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newComplaint = await response.json();
        setComplaints(prev => [newComplaint, ...prev]);
      } else {
        throw new Error('Failed to create complaint/suggestion');
      }
    } catch (error) {
      console.error('Failed to submit complaint/suggestion:', error);
      throw error;
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your panel...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'articles', label: 'My Articles', icon: FileText },
    { id: 'complaints', label: 'Complaints & Suggestions', icon: MessageSquare },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {session?.user?.name || 'User'}!
        </h2>
        <p className="text-gray-600">
          Here's what's happening with your Damday Village account
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Bookings</h3>
              <p className="text-2xl font-semibold text-gray-900">{userStats.bookings}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Orders</h3>
              <p className="text-2xl font-semibold text-gray-900">{userStats.orders}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Articles</h3>
              <p className="text-2xl font-semibold text-gray-900">{userStats.articles}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Award className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Contributions</h3>
              <p className="text-2xl font-semibold text-gray-900">{userStats.contributions}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Articles</CardTitle>
          </CardHeader>
          <CardContent>
            {articles.length > 0 ? (
              <div className="space-y-3">
                {articles.slice(0, 3).map((article) => (
                  <div key={article.id} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{article.title}</h4>
                      <p className="text-sm text-gray-500">
                        {article.status === 'published' ? `${article.views} views` : article.status}
                      </p>
                    </div>
                    <Badge 
                      className={
                        article.status === 'published' ? 'bg-green-100 text-green-800' :
                        article.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }
                    >
                      {article.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No articles yet</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setActiveTab('articles')}
                >
                  Write your first article
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.slice(0, 3).map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-3 rounded-lg border ${
                      !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <h4 className="font-medium text-gray-900">{notification.title}</h4>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No notifications</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h2>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6 mb-6">
            <Avatar 
              src={session?.user?.image} 
              alt={session?.user?.name || 'User'} 
              size="lg"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {session?.user?.name || 'User'}
              </h3>
              <p className="text-gray-600">{session?.user?.email}</p>
              <Button variant="outline" size="sm" className="mt-2">
                Change Photo
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                defaultValue={session?.user?.name || ''}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                defaultValue={session?.user?.email || ''}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="City, State"
              />
            </div>
          </div>

          <div className="mt-6">
            <Button variant="primary">Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'profile':
        return renderProfile();
      case 'bookings':
        return <div>Bookings content coming soon...</div>;
      case 'orders':
        return <div>Orders content coming soon...</div>;
      case 'articles':
        return (
          <ArticleEditor
            articles={articles}
            onSubmit={handleArticleSubmit}
            onUpdate={handleArticleUpdate}
            onDelete={handleArticleDelete}
          />
        );
      case 'complaints':
        return (
          <ComplaintsForm
            complaints={complaints}
            onSubmit={handleComplaintSubmit}
          />
        );
      case 'notifications':
        return <div>Notifications management coming soon...</div>;
      case 'settings':
        return <div>Settings content coming soon...</div>;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <Home className="h-6 w-6 text-primary-600" />
                <span className="text-xl font-display font-bold text-primary-900">
                  Damday Village
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  Back to Site
                </Button>
              </Link>
              <Avatar 
                src={session?.user?.image} 
                alt={session?.user?.name || 'User'} 
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
                    {item.badge && item.badge > 0 && (
                      <Badge className="ml-auto bg-red-100 text-red-800">
                        {item.badge}
                      </Badge>
                    )}
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