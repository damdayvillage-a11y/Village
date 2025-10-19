"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/lib/components/ui/select';
import { Loader2, Activity, Download, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';

interface TelemetryData {
  id: string;
  deviceId: string;
  timestamp: string;
  metrics: Record<string, number>;
}

interface Device {
  id: string;
  name: string;
  type: string;
  status: string;
}

export default function TelemetryMonitoringPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [telemetryData, setTelemetryData] = useState<TelemetryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<string>('1h');

  const fetchDevices = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/devices');
      if (res.ok) {
        const data = await res.json();
        setDevices(data.devices || []);
        if (data.devices?.length > 0 && !selectedDevice) {
          setSelectedDevice(data.devices[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    }
  }, [selectedDevice]);

  const fetchTelemetry = useCallback(async () => {
    if (!selectedDevice) return;
    
    setLoading(true);
    try {
      const res = await fetch(
        `/api/telemetry?deviceId=${selectedDevice}&limit=50&timeRange=${timeRange}`
      );
      if (res.ok) {
        const data = await res.json();
        setTelemetryData(data.readings || []);
      }
    } catch (error) {
      console.error('Failed to fetch telemetry:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedDevice, timeRange]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [fetchTelemetry]);

  const getLatestMetrics = () => {
    if (telemetryData.length === 0) return {};
    return telemetryData[0].metrics;
  };

  const calculateTrend = (metricKey: string) => {
    if (telemetryData.length < 2) return 0;
    const latest = telemetryData[0].metrics[metricKey] || 0;
    const previous = telemetryData[1].metrics[metricKey] || 0;
    return ((latest - previous) / (previous || 1)) * 100;
  };

  const latestMetrics = getLatestMetrics();

  if (loading && telemetryData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Telemetry Monitoring</h1>
          <p className="text-muted-foreground">
            Real-time sensor data visualization and analysis
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchTelemetry} disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Device & Time Range Selection */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Device</label>
              <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a device..." />
                </SelectTrigger>
                <SelectContent>
                  {devices.map((device) => (
                    <SelectItem key={device.id} value={device.id}>
                      {device.name} ({device.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Time Range</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15m">Last 15 minutes</SelectItem>
                  <SelectItem value="1h">Last 1 hour</SelectItem>
                  <SelectItem value="6h">Last 6 hours</SelectItem>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedDevice ? (
        <>
          {/* Current Metrics */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Current Readings</h2>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(latestMetrics).map(([key, value]) => {
                const trend = calculateTrend(key);
                const isPositive = trend > 0;
                
                return (
                  <Card key={key}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium capitalize">
                        {key.replace(/_/g, ' ')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline justify-between">
                        <div className="text-2xl font-bold">
                          {typeof value === 'number' ? value.toFixed(2) : value}
                        </div>
                        {telemetryData.length > 1 && (
                          <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {Math.abs(trend).toFixed(1)}%
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Historical Data Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                <CardTitle>Historical Data</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {telemetryData.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No telemetry data available</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Timestamp</th>
                        {Object.keys(latestMetrics).map((key) => (
                          <th key={key} className="text-left p-3 font-medium capitalize">
                            {key.replace(/_/g, ' ')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {telemetryData.slice(0, 20).map((reading) => (
                        <tr key={reading.id} className="border-b hover:bg-muted/50">
                          <td className="p-3 text-sm text-muted-foreground">
                            {new Date(reading.timestamp).toLocaleString()}
                          </td>
                          {Object.keys(latestMetrics).map((key) => (
                            <td key={key} className="p-3">
                              {reading.metrics[key]?.toFixed(2) || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center min-h-[400px]">
            <div className="text-center text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a device to view telemetry data</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
