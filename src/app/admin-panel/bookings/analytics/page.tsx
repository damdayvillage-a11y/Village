"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Badge } from '@/lib/components/ui/Badge';
import { Loader2, TrendingUp, DollarSign, Users, Home, Calendar } from 'lucide-react';

interface Analytics {
  totalBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  occupancyRate: number;
  topHomestays: Array<{ name: string; bookings: number; revenue: number }>;
  recentBookings: Array<any>;
}

export default function BookingAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalBookings: 0,
    totalRevenue: 0,
    averageBookingValue: 0,
    occupancyRate: 0,
    topHomestays: [],
    recentBookings: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/bookings/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Booking Analytics</h1>
        <p className="text-muted-foreground">View booking performance and revenue insights</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalBookings}</div>
            <p className="text-xs text-muted-foreground">All time bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Booking</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.averageBookingValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per booking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.occupancyRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              <CardTitle>Top Performing Homestays</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topHomestays.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No data available</div>
              ) : (
                analytics.topHomestays.map((homestay, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{homestay.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {homestay.bookings} bookings
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        ${homestay.revenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <CardTitle>Recent Bookings</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.recentBookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No recent bookings</div>
              ) : (
                analytics.recentBookings.map((booking: any) => (
                  <div key={booking.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium text-sm">{booking.homestayName}</div>
                      <div className="text-xs text-muted-foreground">{booking.guestName}</div>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">
                        {booking.status}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        ${booking.totalPrice}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
