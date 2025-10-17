'use client';

import React from 'react';
import { 
  Calendar, 
  ShoppingBag, 
  FileText, 
  Award, 
  TrendingUp,
  Leaf,
  Star,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Badge } from '@/lib/components/ui/Badge';

interface DashboardStats {
  bookings: number;
  orders: number;
  articles: number;
  carbonCredits: number;
  achievements: number;
}

interface RecentActivity {
  id: string;
  type: 'booking' | 'order' | 'article' | 'achievement' | 'carbon';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

interface EnhancedDashboardProps {
  userName: string;
  stats: DashboardStats;
  recentActivities?: RecentActivity[];
}

export function EnhancedDashboard({ 
  userName, 
  stats,
  recentActivities = []
}: EnhancedDashboardProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="h-5 w-5 text-blue-600" />;
      case 'order':
        return <ShoppingBag className="h-5 w-5 text-green-600" />;
      case 'article':
        return <FileText className="h-5 w-5 text-purple-600" />;
      case 'achievement':
        return <Award className="h-5 w-5 text-orange-600" />;
      case 'carbon':
        return <Leaf className="h-5 w-5 text-emerald-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getActivityBadgeColor = (status?: string) => {
    switch (status) {
      case 'completed':
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {userName}! 👋
        </h2>
        <p className="text-gray-600">
          Here's your activity summary for Damday Village
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Bookings Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Bookings</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.bookings}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">Active</span>
            </div>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.orders}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">All Time</span>
            </div>
          </CardContent>
        </Card>

        {/* Articles Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Articles</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.articles}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Star className="h-4 w-4 text-purple-600 mr-1" />
              <span className="text-purple-600 font-medium">Published</span>
            </div>
          </CardContent>
        </Card>

        {/* Carbon Credits Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Carbon Credits</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.carbonCredits}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <Leaf className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-emerald-600 mr-1" />
              <span className="text-emerald-600 font-medium">Balance</span>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Achievements</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.achievements}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Star className="h-4 w-4 text-orange-600 mr-1" />
              <span className="text-orange-600 font-medium">Unlocked</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {recentActivities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div 
                  key={activity.id}
                  className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      {activity.status && (
                        <Badge className={getActivityBadgeColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
              <Calendar className="h-5 w-5 mr-2 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Book Homestay</span>
            </button>
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
              <ShoppingBag className="h-5 w-5 mr-2 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Browse Marketplace</span>
            </button>
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
              <FileText className="h-5 w-5 mr-2 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Write Article</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
