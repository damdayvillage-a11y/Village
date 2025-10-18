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
  PlusCircle,
  Leaf
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Badge } from '@/lib/components/ui/Badge';
import { Avatar } from '@/lib/components/ui/Avatar';
import { ComplaintsForm } from '@/lib/components/user-panel/ComplaintsForm';
import { ArticleEditor } from '@/lib/components/user-panel/ArticleEditor';
import { EnhancedDashboard } from '@/lib/components/user-panel/EnhancedDashboard';
import { ProfileManagement } from '@/lib/components/user-panel/ProfileManagement';
import { BookingManagement } from '@/lib/components/user-panel/BookingManagement';
import { CarbonCreditWallet } from '@/lib/components/user-panel/CarbonCreditWallet';
import { NotificationCenter } from '@/lib/components/user-panel/NotificationCenter';
import { Achievements } from '@/lib/components/user-panel/Achievements';
import { PersonalAnalytics } from '@/lib/components/user-panel/PersonalAnalytics';

interface UserStats {
  bookings: number;
  orders: number;
  articles: number;
  carbonCredits: number;
  achievements: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'BOOKING' | 'ORDER' | 'ACHIEVEMENT' | 'SYSTEM';
  read: boolean;
  actionUrl?: string;
  createdAt: string;
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

interface Booking {
  id: string;
  homestayId: string;
  homestayName: string;
  homestayAddress: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'NO_SHOW';
  pricing: {
    basePrice: number;
    taxes: number;
    fees: number;
    total: number;
  };
  createdAt: string;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  image?: string;
  preferences?: {
    language?: string;
    notifications?: boolean;
  };
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
    carbonCredits: 0,
    achievements: 0
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [carbonCredits, setCarbonCredits] = useState<any>(null);
  const [carbonTransactions, setCarbonTransactions] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/user-panel');
      return;
    }
    
    if (status === 'authenticated') {
      loadUserData();
    }
  }, [status, router]);

  const loadUserData = async () => {
    try {
      // Load user profile
      const profileResponse = await fetch('/api/user/profile');
      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        setUserProfile(profile);
      }

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

      // Load bookings
      const bookingsResponse = await fetch('/api/user/bookings');
      if (bookingsResponse.ok) {
        const userBookings = await bookingsResponse.json();
        setBookings(userBookings);
      }

      // Load carbon credits
      const carbonCreditsResponse = await fetch('/api/user/carbon-credits');
      if (carbonCreditsResponse.ok) {
        const credits = await carbonCreditsResponse.json();
        setCarbonCredits(credits);
      }

      // Load carbon transactions
      const carbonTransactionsResponse = await fetch('/api/user/carbon-credits/transactions');
      if (carbonTransactionsResponse.ok) {
        const transactions = await carbonTransactionsResponse.json();
        setCarbonTransactions(transactions);
      }

      // Load achievements
      const achievementsResponse = await fetch('/api/user/achievements');
      if (achievementsResponse.ok) {
        const achievementsData = await achievementsResponse.json();
        setAchievements(achievementsData);
      }

      // Load analytics
      const analyticsResponse = await fetch('/api/user/analytics');
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData);
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
      throw error;
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      // Mark all unread notifications
      const unreadNotifications = notifications.filter(n => !n.read);
      await Promise.all(
        unreadNotifications.map(n => 
          fetch(`/api/user/notifications/${n.id}/read`, { method: 'POST' })
        )
      );
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleProfileUpdate = async (data: Partial<UserProfile>) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setUserProfile(updatedProfile);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  const handleAvatarUpload = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/user/profile/avatar', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        return result.avatarUrl;
      } else {
        throw new Error('Failed to upload avatar');
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      throw error;
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

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/user/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh bookings list
        const bookingsResponse = await fetch('/api/user/bookings');
        if (bookingsResponse.ok) {
          const userBookings = await bookingsResponse.json();
          setBookings(userBookings);
        }
        // Refresh stats
        const statsResponse = await fetch('/api/user/stats');
        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          setUserStats(stats);
        }
      } else {
        throw new Error('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      throw error;
    }
  };

  const handleRescheduleBooking = (bookingId: string) => {
    // TODO: Implement reschedule modal
    console.log('Reschedule booking:', bookingId);
  };

  const handleEarnCredits = async (opportunityId: string) => {
    // In a real implementation, this would fetch the opportunity details
    // For now, we'll simulate earning credits
    try {
      const response = await fetch('/api/user/carbon-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 10, // Default amount
          reason: `Completed opportunity ${opportunityId}`,
          type: 'EARN',
        }),
      });

      if (response.ok) {
        // Refresh carbon credits and transactions
        const [creditsResponse, transactionsResponse] = await Promise.all([
          fetch('/api/user/carbon-credits'),
          fetch('/api/user/carbon-credits/transactions'),
        ]);

        if (creditsResponse.ok) {
          const credits = await creditsResponse.json();
          setCarbonCredits(credits);
        }

        if (transactionsResponse.ok) {
          const transactions = await transactionsResponse.json();
          setCarbonTransactions(transactions);
        }

        // Refresh stats
        const statsResponse = await fetch('/api/user/stats');
        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          setUserStats(stats);
        }
      } else {
        throw new Error('Failed to earn credits');
      }
    } catch (error) {
      console.error('Failed to earn credits:', error);
      throw error;
    }
  };

  const handleSpendCredits = async (amount: number, reason: string) => {
    try {
      const response = await fetch('/api/user/carbon-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          reason,
          type: 'SPEND',
        }),
      });

      if (response.ok) {
        // Refresh carbon credits and transactions
        const [creditsResponse, transactionsResponse] = await Promise.all([
          fetch('/api/user/carbon-credits'),
          fetch('/api/user/carbon-credits/transactions'),
        ]);

        if (creditsResponse.ok) {
          const credits = await creditsResponse.json();
          setCarbonCredits(credits);
        }

        if (transactionsResponse.ok) {
          const transactions = await transactionsResponse.json();
          setCarbonTransactions(transactions);
        }

        // Refresh stats
        const statsResponse = await fetch('/api/user/stats');
        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          setUserStats(stats);
        }
      } else {
        throw new Error('Failed to spend credits');
      }
    } catch (error) {
      console.error('Failed to spend credits:', error);
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
    { id: 'carbon', label: 'Carbon Credits', icon: Leaf },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'articles', label: 'My Articles', icon: FileText },
    { id: 'complaints', label: 'Complaints & Suggestions', icon: MessageSquare },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderDashboard = () => (
    <EnhancedDashboard
      userName={session?.user?.name || 'User'}
      stats={userStats}
      recentActivities={[]}
    />
  );

  const renderProfile = () => {
    if (!userProfile) {
      return <div>Loading profile...</div>;
    }

    return (
      <ProfileManagement
        profile={userProfile}
        onUpdate={handleProfileUpdate}
        onAvatarUpload={handleAvatarUpload}
      />
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'profile':
        return renderProfile();
      case 'bookings':
        return (
          <BookingManagement
            bookings={bookings}
            onCancel={handleCancelBooking}
            onReschedule={handleRescheduleBooking}
          />
        );
      case 'orders':
        return <div>Orders content coming soon...</div>;
      case 'carbon':
        if (!carbonCredits) {
          return <div>Loading carbon credits...</div>;
        }
        return (
          <CarbonCreditWallet
            creditBalance={carbonCredits}
            transactions={carbonTransactions}
            earningOpportunities={[]}
            onEarnCredits={handleEarnCredits}
            onSpendCredits={handleSpendCredits}
          />
        );
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
        return (
          <NotificationCenter
            notifications={notifications}
            onMarkAsRead={markNotificationAsRead}
            onMarkAllAsRead={markAllNotificationsAsRead}
          />
        );
      case 'achievements':
        if (!achievements) {
          return <div>Loading achievements...</div>;
        }
        return (
          <Achievements
            userAchievements={achievements.userAchievements || []}
            totalPoints={achievements.totalPoints || 0}
            rank={achievements.rank}
          />
        );
      case 'analytics':
        if (!analytics) {
          return <div>Loading analytics...</div>;
        }
        return (
          <PersonalAnalytics
            analyticsData={analytics}
          />
        );
      case 'settings':
        return <div>Settings content coming soon...</div>;
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