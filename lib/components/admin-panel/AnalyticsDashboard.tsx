'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Package,
  MessageSquare,
  Activity,
  Download,
  RefreshCw,
  CalendarIcon
} from 'lucide-react';
import { Card } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';

interface MonthlyData {
  month: string;
  value: number;
}

interface MetricData {
  total: number;
  trend: 'up' | 'down' | 'neutral';
  change: number;
}

interface HomestayRanking {
  id: string;
  name: string;
  location: string;
  bookings: number;
  revenue: number;
  rating: number;
}

interface AnalyticsData {
  metrics: {
    revenue: MetricData;
    bookings: MetricData;
    users: MetricData;
    reviews: { pending: number };
    products: { sold: number };
    health: { score: number; status: 'healthy' | 'warning' | 'error' };
  };
  charts: {
    userGrowth: MonthlyData[];
    bookingTrends: MonthlyData[];
    revenueTrends: MonthlyData[];
  };
  topHomestays: HomestayRanking[];
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from API
      // For now, using mock data that simulates real analytics
      const mockData: AnalyticsData = {
        metrics: {
          revenue: {
            total: 1250000,
            trend: 'up',
            change: 15.3
          },
          bookings: {
            total: 342,
            trend: 'up',
            change: 8.7
          },
          users: {
            total: 1567,
            trend: 'up',
            change: 12.4
          },
          reviews: {
            pending: 23
          },
          products: {
            sold: 456
          },
          health: {
            score: 98.5,
            status: 'healthy'
          }
        },
        charts: {
          userGrowth: generateMonthlyData(150, 250, 12),
          bookingTrends: generateMonthlyData(20, 40, 12),
          revenueTrends: generateMonthlyData(80000, 120000, 12)
        },
        topHomestays: [
          { id: '1', name: 'Mountain View Villa', location: 'Shimla', bookings: 45, revenue: 125000, rating: 4.8 },
          { id: '2', name: 'Lake Side Cottage', location: 'Nainital', bookings: 38, revenue: 98000, rating: 4.7 },
          { id: '3', name: 'Forest Retreat', location: 'Manali', bookings: 35, revenue: 92000, rating: 4.6 },
          { id: '4', name: 'Valley Paradise', location: 'Kullu', bookings: 32, revenue: 85000, rating: 4.5 },
          { id: '5', name: 'River View Home', location: 'Rishikesh', bookings: 28, revenue: 76000, rating: 4.4 },
          { id: '6', name: 'Hillside Haven', location: 'Mussoorie', bookings: 25, revenue: 68000, rating: 4.3 },
          { id: '7', name: 'Sunrise Cottage', location: 'Darjeeling', bookings: 22, revenue: 62000, rating: 4.2 },
          { id: '8', name: 'Peaceful Retreat', location: 'Kasauli', bookings: 20, revenue: 55000, rating: 4.1 },
          { id: '9', name: 'Garden Villa', location: 'Ooty', bookings: 18, revenue: 48000, rating: 4.0 },
          { id: '10', name: 'Cozy Cabin', location: 'Dehradun', bookings: 15, revenue: 42000, rating: 3.9 }
        ]
      };

      setData(mockData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate realistic monthly data with some variance
  function generateMonthlyData(min: number, max: number, months: number): MonthlyData[] {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data: MonthlyData[] = [];
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthIndex = date.getMonth();
      const value = Math.floor(Math.random() * (max - min) + min);
      data.push({
        month: monthNames[monthIndex],
        value
      });
    }
    return data;
  }

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-IN');
  };

  const exportAnalytics = () => {
    if (!data) return;

    const csvContent = [
      ['Analytics Report', `Generated: ${new Date().toLocaleString()}`],
      [''],
      ['Metrics'],
      ['Metric', 'Value', 'Trend', 'Change %'],
      ['Total Revenue', formatCurrency(data.metrics.revenue.total), data.metrics.revenue.trend, data.metrics.revenue.change.toString()],
      ['Total Bookings', data.metrics.bookings.total.toString(), data.metrics.bookings.trend, data.metrics.bookings.change.toString()],
      ['Active Users', data.metrics.users.total.toString(), data.metrics.users.trend, data.metrics.users.change.toString()],
      ['Pending Reviews', data.metrics.reviews.pending.toString(), '-', '-'],
      ['Products Sold', data.metrics.products.sold.toString(), '-', '-'],
      ['System Health', `${data.metrics.health.score}%`, data.metrics.health.status, '-'],
      [''],
      ['Top Homestays'],
      ['Rank', 'Name', 'Location', 'Bookings', 'Revenue', 'Rating'],
      ...data.topHomestays.map((h, i) => [
        (i + 1).toString(),
        h.name,
        h.location,
        h.bookings.toString(),
        formatCurrency(h.revenue),
        h.rating.toString()
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderLineChart = (chartData: MonthlyData[], color: string = '#3b82f6') => {
    if (!chartData || chartData.length === 0) return null;

    const maxValue = Math.max(...chartData.map(d => d.value));
    const points = chartData.map((d, i) => {
      const x = (i / (chartData.length - 1)) * 100;
      const y = 100 - (d.value / maxValue) * 80;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#e5e7eb" strokeWidth="0.2" />
        ))}
        
        {/* Area fill */}
        <polygon
          points={`0,100 ${points} 100,100`}
          fill={`${color}20`}
          stroke="none"
        />
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {chartData.map((d, i) => {
          const x = (i / (chartData.length - 1)) * 100;
          const y = 100 - (d.value / maxValue) * 80;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="0.8"
              fill={color}
              className="hover:r-1.5 transition-all cursor-pointer"
            >
              <title>{`${d.month}: ${formatNumber(d.value)}`}</title>
            </circle>
          );
        })}
      </svg>
    );
  };

  const renderBarChart = (chartData: MonthlyData[], color: string = '#3b82f6') => {
    if (!chartData || chartData.length === 0) return null;

    const maxValue = Math.max(...chartData.map(d => d.value));
    const barWidth = 100 / chartData.length;

    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#e5e7eb" strokeWidth="0.2" />
        ))}
        
        {/* Bars */}
        {chartData.map((d, i) => {
          const height = (d.value / maxValue) * 80;
          const x = i * barWidth + barWidth * 0.1;
          const y = 100 - height;
          const width = barWidth * 0.8;
          
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={width}
              height={height}
              fill={color}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            >
              <title>{`${d.month}: ${formatNumber(d.value)}`}</title>
            </rect>
          );
        })}
      </svg>
    );
  };

  const renderAreaChart = (chartData: MonthlyData[], color: string = '#10b981') => {
    if (!chartData || chartData.length === 0) return null;

    const maxValue = Math.max(...chartData.map(d => d.value));
    const points = chartData.map((d, i) => {
      const x = (i / (chartData.length - 1)) * 100;
      const y = 100 - (d.value / maxValue) * 80;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#e5e7eb" strokeWidth="0.2" />
        ))}
        
        {/* Area */}
        <polygon
          points={`0,100 ${points} 100,100`}
          fill={`${color}30`}
          stroke={color}
          strokeWidth="0.5"
        />
        
        {/* Data points */}
        {chartData.map((d, i) => {
          const x = (i / (chartData.length - 1)) * 100;
          const y = 100 - (d.value / maxValue) * 80;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="0.8"
              fill={color}
              className="hover:r-1.5 transition-all cursor-pointer"
            >
              <title>{`${d.month}: ${formatCurrency(d.value)}`}</title>
            </circle>
          );
        })}
      </svg>
    );
  };

  const renderStars = (rating: number) => {
    return (
      <span className="text-yellow-400">
        {'⭐'.repeat(Math.floor(rating))}
        {rating % 1 >= 0.5 && '½'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
          <p className="text-gray-600">Track performance metrics and trends</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={loadAnalytics}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            onClick={exportAnalytics}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card className="p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon className="h-4 w-4 inline mr-1" />
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon className="h-4 w-4 inline mr-1" />
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button onClick={loadAnalytics} className="px-6">
            Apply Filter
          </Button>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Revenue */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            {data.metrics.revenue.trend === 'up' ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
          </div>
          <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {formatCurrency(data.metrics.revenue.total)}
          </p>
          <p className={`text-sm mt-2 ${data.metrics.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {data.metrics.revenue.trend === 'up' ? '+' : '-'}{data.metrics.revenue.change}% from last month
          </p>
        </Card>

        {/* Bookings */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            {data.metrics.bookings.trend === 'up' ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
          </div>
          <h3 className="text-sm font-medium text-gray-600">Total Bookings</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {formatNumber(data.metrics.bookings.total)}
          </p>
          <p className={`text-sm mt-2 ${data.metrics.bookings.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {data.metrics.bookings.trend === 'up' ? '+' : '-'}{data.metrics.bookings.change}% from last month
          </p>
        </Card>

        {/* Users */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            {data.metrics.users.trend === 'up' ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
          </div>
          <h3 className="text-sm font-medium text-gray-600">Active Users</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {formatNumber(data.metrics.users.total)}
          </p>
          <p className={`text-sm mt-2 ${data.metrics.users.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {data.metrics.users.trend === 'up' ? '+' : '-'}{data.metrics.users.change}% from last month
          </p>
        </Card>

        {/* Pending Reviews */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Pending Reviews</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {formatNumber(data.metrics.reviews.pending)}
          </p>
          <p className="text-sm mt-2 text-gray-500">
            Awaiting moderation
          </p>
        </Card>

        {/* Products Sold */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Package className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Products Sold</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {formatNumber(data.metrics.products.sold)}
          </p>
          <p className="text-sm mt-2 text-gray-500">
            Total marketplace sales
          </p>
        </Card>

        {/* System Health */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${
              data.metrics.health.status === 'healthy' ? 'bg-green-100' :
              data.metrics.health.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <Activity className={`h-6 w-6 ${
                data.metrics.health.status === 'healthy' ? 'text-green-600' :
                data.metrics.health.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
              }`} />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600">System Health</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {data.metrics.health.score}%
          </p>
          <p className={`text-sm mt-2 ${
            data.metrics.health.status === 'healthy' ? 'text-green-600' :
            data.metrics.health.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            Status: {data.metrics.health.status}
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            User Growth
          </h3>
          <div className="h-64">
            {renderLineChart(data.charts.userGrowth, '#3b82f6')}
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-600">
            {data.charts.userGrowth.slice(0, 6).map((d, i) => (
              <span key={i}>{d.month}</span>
            ))}
          </div>
        </Card>

        {/* Booking Trends Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Booking Trends
          </h3>
          <div className="h-64">
            {renderBarChart(data.charts.bookingTrends, '#3b82f6')}
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-600">
            {data.charts.bookingTrends.slice(0, 6).map((d, i) => (
              <span key={i}>{d.month}</span>
            ))}
          </div>
        </Card>
      </div>

      {/* Revenue Analytics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-500" />
          Revenue Analytics
        </h3>
        <div className="h-64">
          {renderAreaChart(data.charts.revenueTrends, '#10b981')}
        </div>
        <div className="flex justify-between mt-4 text-sm text-gray-600">
          {data.charts.revenueTrends.map((d, i) => (
            <span key={i}>{d.month}</span>
          ))}
        </div>
      </Card>

      {/* Top Performing Homestays */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Top Performing Homestays
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rank</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Homestay</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Location</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Bookings</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Revenue</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rating</th>
              </tr>
            </thead>
            <tbody>
              {data.topHomestays.map((homestay, index) => (
                <tr
                  key={homestay.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    index < 3 ? 'bg-yellow-50' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-300 text-gray-900' :
                      index === 2 ? 'bg-orange-300 text-orange-900' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">{homestay.name}</td>
                  <td className="py-3 px-4 text-gray-600">{homestay.location}</td>
                  <td className="py-3 px-4 text-gray-900">{formatNumber(homestay.bookings)}</td>
                  <td className="py-3 px-4 text-gray-900">{formatCurrency(homestay.revenue)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {renderStars(homestay.rating)}
                      <span className="text-sm text-gray-600">{homestay.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
