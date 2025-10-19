'use client';

import React, { useState } from 'react';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Leaf,
  ShoppingBag,
  Home,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';

interface AnalyticsData {
  bookingStats: {
    total: number;
    thisMonth: number;
    trend: 'up' | 'down' | 'stable';
    trendPercent: number;
  };
  spendingStats: {
    total: number;
    thisMonth: number;
    trend: 'up' | 'down' | 'stable';
    trendPercent: number;
  };
  carbonStats: {
    totalOffset: number;
    thisMonth: number;
    trend: 'up' | 'down' | 'stable';
    trendPercent: number;
  };
  activityStats: {
    totalActions: number;
    thisMonth: number;
    trend: 'up' | 'down' | 'stable';
    trendPercent: number;
  };
  monthlyData?: {
    month: string;
    bookings: number;
    spending: number;
    carbonCredits: number;
  }[];
}

interface PersonalAnalyticsProps {
  analyticsData: AnalyticsData;
}

export function PersonalAnalytics({ analyticsData }: PersonalAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-primary-600" />
          Personal Analytics
        </h2>
        <p className="text-gray-600 mt-1">Track your activity and engagement metrics</p>
      </div>

      {/* Time Range Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Time Range:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setTimeRange('week')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  timeRange === 'week'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Last Week
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  timeRange === 'month'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => setTimeRange('year')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  timeRange === 'year'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                This Year
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bookings */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
              {getTrendIcon(analyticsData.bookingStats.trend)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.bookingStats.total}</p>
              <div className="flex items-center gap-1 mt-2">
                <span className={`text-sm font-medium ${getTrendColor(analyticsData.bookingStats.trend)}`}>
                  {analyticsData.bookingStats.trendPercent}%
                </span>
                <span className="text-xs text-gray-500">vs last period</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spending */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              {getTrendIcon(analyticsData.spendingStats.trend)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Spending</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{analyticsData.spendingStats.total.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <span className={`text-sm font-medium ${getTrendColor(analyticsData.spendingStats.trend)}`}>
                  {analyticsData.spendingStats.trendPercent}%
                </span>
                <span className="text-xs text-gray-500">vs last period</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Carbon Offset */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              {getTrendIcon(analyticsData.carbonStats.trend)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Carbon Offset</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.carbonStats.totalOffset} kg
              </p>
              <div className="flex items-center gap-1 mt-2">
                <span className={`text-sm font-medium ${getTrendColor(analyticsData.carbonStats.trend)}`}>
                  {analyticsData.carbonStats.trendPercent}%
                </span>
                <span className="text-xs text-gray-500">vs last period</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
              {getTrendIcon(analyticsData.activityStats.trend)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Actions</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.activityStats.totalActions}</p>
              <div className="flex items-center gap-1 mt-2">
                <span className={`text-sm font-medium ${getTrendColor(analyticsData.activityStats.trend)}`}>
                  {analyticsData.activityStats.trendPercent}%
                </span>
                <span className="text-xs text-gray-500">vs last period</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Bookings</span>
                <span className="text-sm font-bold text-gray-900">
                  {analyticsData.bookingStats.thisMonth}
                </span>
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-blue-600 transition-all"
                  style={{ 
                    width: `${(analyticsData.bookingStats.thisMonth / analyticsData.bookingStats.total * 100) || 0}%` 
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Orders</span>
                <span className="text-sm font-bold text-gray-900">
                  {analyticsData.spendingStats.thisMonth}
                </span>
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-purple-600 transition-all"
                  style={{ 
                    width: `${(analyticsData.spendingStats.thisMonth / analyticsData.spendingStats.total * 100) || 0}%` 
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Carbon Actions</span>
                <span className="text-sm font-bold text-gray-900">
                  {analyticsData.carbonStats.thisMonth}
                </span>
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-green-600 transition-all"
                  style={{ 
                    width: `${(analyticsData.carbonStats.thisMonth / analyticsData.carbonStats.totalOffset * 100) || 0}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Chart (Placeholder) */}
      {analyticsData.monthlyData && analyticsData.monthlyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.monthlyData.map((data, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700 w-20">{data.month}</span>
                  <div className="flex-1 flex gap-2">
                    <div
                      className="h-8 bg-blue-500 rounded"
                      style={{ width: `${(data.bookings / 10) * 100}%` }}
                      title={`${data.bookings} bookings`}
                    />
                    <div
                      className="h-8 bg-purple-500 rounded"
                      style={{ width: `${(data.spending / 10000) * 100}%` }}
                      title={`₹${data.spending} spent`}
                    />
                    <div
                      className="h-8 bg-green-500 rounded"
                      style={{ width: `${(data.carbonCredits / 100) * 100}%` }}
                      title={`${data.carbonCredits} credits`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded" />
                <span>Bookings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded" />
                <span>Spending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span>Carbon Credits</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
