"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  Home,
  Leaf,
  Activity,
  Download,
  Loader2,
} from "lucide-react";

interface AnalyticsData {
  users: {
    total: number;
    active: number;
    new: number;
    growth: number;
  };
  revenue: {
    total: number;
    bookings: number;
    marketplace: number;
    growth: number;
  };
  bookings: {
    total: number;
    confirmed: number;
    pending: number;
    growth: number;
  };
  marketplace: {
    products: number;
    orders: number;
    revenue: number;
    growth: number;
  };
  carbonCredits: {
    total: number;
    issued: number;
    retired: number;
    growth: number;
  };
  traffic: {
    visits: number;
    pageViews: number;
    bounceRate: number;
    avgDuration: number;
  };
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const exportData = () => {
    console.log("Exporting analytics data...");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </Select>
          <Button onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Users */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-3xl font-bold mt-2">
                {analytics?.users.total.toLocaleString() || 0}
              </p>
              <p className="text-sm text-green-600 mt-2">
                <TrendingUp className="h-4 w-4 inline mr-1" />
                +{analytics?.users.growth || 0}% vs last period
              </p>
            </div>
            <Users className="h-12 w-12 text-blue-500" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Active</p>
              <p className="font-semibold">{analytics?.users.active || 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground">New</p>
              <p className="font-semibold">{analytics?.users.new || 0}</p>
            </div>
          </div>
        </Card>

        {/* Revenue */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-3xl font-bold mt-2">
                ${analytics?.revenue.total.toLocaleString() || 0}
              </p>
              <p className="text-sm text-green-600 mt-2">
                <TrendingUp className="h-4 w-4 inline mr-1" />
                +{analytics?.revenue.growth || 0}% vs last period
              </p>
            </div>
            <DollarSign className="h-12 w-12 text-green-500" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Bookings</p>
              <p className="font-semibold">
                ${analytics?.revenue.bookings.toLocaleString() || 0}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Marketplace</p>
              <p className="font-semibold">
                ${analytics?.revenue.marketplace.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </Card>

        {/* Bookings */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
              <p className="text-3xl font-bold mt-2">
                {analytics?.bookings.total.toLocaleString() || 0}
              </p>
              <p className="text-sm text-green-600 mt-2">
                <TrendingUp className="h-4 w-4 inline mr-1" />
                +{analytics?.bookings.growth || 0}% vs last period
              </p>
            </div>
            <Home className="h-12 w-12 text-purple-500" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Confirmed</p>
              <p className="font-semibold">
                {analytics?.bookings.confirmed || 0}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Pending</p>
              <p className="font-semibold">
                {analytics?.bookings.pending || 0}
              </p>
            </div>
          </div>
        </Card>

        {/* Marketplace */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Marketplace</p>
              <p className="text-3xl font-bold mt-2">
                {analytics?.marketplace.orders.toLocaleString() || 0}
              </p>
              <p className="text-sm text-green-600 mt-2">
                <TrendingUp className="h-4 w-4 inline mr-1" />
                +{analytics?.marketplace.growth || 0}% orders
              </p>
            </div>
            <ShoppingCart className="h-12 w-12 text-orange-500" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Products</p>
              <p className="font-semibold">
                {analytics?.marketplace.products || 0}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Revenue</p>
              <p className="font-semibold">
                ${analytics?.marketplace.revenue.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </Card>

        {/* Carbon Credits */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Carbon Credits</p>
              <p className="text-3xl font-bold mt-2">
                {analytics?.carbonCredits.total.toLocaleString() || 0}
              </p>
              <p className="text-sm text-green-600 mt-2">
                <TrendingUp className="h-4 w-4 inline mr-1" />
                +{analytics?.carbonCredits.growth || 0}% issued
              </p>
            </div>
            <Leaf className="h-12 w-12 text-green-600" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Issued</p>
              <p className="font-semibold">
                {analytics?.carbonCredits.issued || 0}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Retired</p>
              <p className="font-semibold">
                {analytics?.carbonCredits.retired || 0}
              </p>
            </div>
          </div>
        </Card>

        {/* Traffic */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Site Traffic</p>
              <p className="text-3xl font-bold mt-2">
                {analytics?.traffic.visits.toLocaleString() || 0}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {analytics?.traffic.pageViews.toLocaleString() || 0} page views
              </p>
            </div>
            <Activity className="h-12 w-12 text-indigo-500" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Bounce Rate</p>
              <p className="font-semibold">
                {analytics?.traffic.bounceRate || 0}%
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Avg Duration</p>
              <p className="font-semibold">
                {analytics?.traffic.avgDuration || 0}m
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded">
            <p className="text-muted-foreground">Chart visualization here</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded">
            <p className="text-muted-foreground">Chart visualization here</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Booking Distribution</h3>
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded">
            <p className="text-muted-foreground">Chart visualization here</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Top Performing Categories
          </h3>
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded">
            <p className="text-muted-foreground">Chart visualization here</p>
          </div>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Conversion Funnel</h3>
        <div className="space-y-3">
          {[
            { stage: "Visitors", count: 10000, rate: 100 },
            { stage: "Product Views", count: 7500, rate: 75 },
            { stage: "Add to Cart", count: 3000, rate: 30 },
            { stage: "Checkout", count: 1500, rate: 15 },
            { stage: "Purchase", count: 1000, rate: 10 },
          ].map((step, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium">{step.stage}</div>
              <div className="flex-1">
                <div className="h-8 bg-primary/10 rounded relative overflow-hidden">
                  <div
                    className="h-full bg-primary rounded transition-all"
                    style={{ width: `${step.rate}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                    {step.count.toLocaleString()} ({step.rate}%)
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
