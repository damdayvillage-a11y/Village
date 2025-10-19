"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Server,
  Database,
  HardDrive,
  Cpu,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Loader2,
} from "lucide-react";

interface SystemHealth {
  status: "healthy" | "warning" | "critical";
  uptime: number;
  lastCheck: string;
}

interface PerformanceMetrics {
  cpu: number;
  memory: number;
  disk: number;
  database: number;
}

interface ErrorLog {
  id: string;
  level: "error" | "warning" | "info";
  message: string;
  timestamp: string;
  count: number;
}

export default function SystemMonitoring() {
  const [health, setHealth] = useState<SystemHealth>({
    status: "healthy",
    uptime: 0,
    lastCheck: new Date().toISOString(),
  });
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cpu: 0,
    memory: 0,
    disk: 0,
    database: 0,
  });
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemHealth();
    const interval = setInterval(fetchSystemHealth, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchSystemHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/monitoring");
      const data = await response.json();
      setHealth(data.health);
      setMetrics(data.metrics);
      setErrors(data.errors);
    } catch (error) {
      console.error("Failed to fetch system health:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-8 w-8 text-yellow-500" />;
      case "critical":
        return <XCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Activity className="h-8 w-8" />;
    }
  };

  const getMetricColor = (value: number) => {
    if (value < 60) return "text-green-600";
    if (value < 85) return "text-yellow-600";
    return "text-red-600";
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
          <h1 className="text-3xl font-bold">System Monitoring</h1>
          <p className="text-muted-foreground">
            Real-time system health and performance
          </p>
        </div>
        <Button onClick={fetchSystemHealth}>
          <Activity className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* System Health Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getStatusIcon(health.status)}
            <div>
              <h3 className="text-2xl font-bold capitalize">{health.status}</h3>
              <p className="text-sm text-muted-foreground">
                System Status • Uptime: {Math.floor(health.uptime / 3600)}h
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Last checked</p>
            <p className="text-sm font-medium">
              {new Date(health.lastCheck).toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Cpu className="h-8 w-8 text-blue-500" />
            <p className={`text-2xl font-bold ${getMetricColor(metrics.cpu)}`}>
              {metrics.cpu}%
            </p>
          </div>
          <p className="text-sm text-muted-foreground">CPU Usage</p>
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${metrics.cpu}%` }}
            />
          </div>
        </Card>

        {/* Memory */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Server className="h-8 w-8 text-purple-500" />
            <p className={`text-2xl font-bold ${getMetricColor(metrics.memory)}`}>
              {metrics.memory}%
            </p>
          </div>
          <p className="text-sm text-muted-foreground">Memory Usage</p>
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all"
              style={{ width: `${metrics.memory}%` }}
            />
          </div>
        </Card>

        {/* Disk */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <HardDrive className="h-8 w-8 text-orange-500" />
            <p className={`text-2xl font-bold ${getMetricColor(metrics.disk)}`}>
              {metrics.disk}%
            </p>
          </div>
          <p className="text-sm text-muted-foreground">Disk Usage</p>
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all"
              style={{ width: `${metrics.disk}%` }}
            />
          </div>
        </Card>

        {/* Database */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Database className="h-8 w-8 text-green-500" />
            <p className={`text-2xl font-bold ${getMetricColor(metrics.database)}`}>
              {metrics.database}%
            </p>
          </div>
          <p className="text-sm text-muted-foreground">Database Load</p>
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${metrics.database}%` }}
            />
          </div>
        </Card>
      </div>

      {/* API Usage Statistics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">API Usage Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Requests</p>
            <p className="text-2xl font-bold">45,230</p>
            <p className="text-sm text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 inline" /> +12% from yesterday
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg Response Time</p>
            <p className="text-2xl font-bold">124ms</p>
            <p className="text-sm text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 inline" /> -8% from yesterday
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Error Rate</p>
            <p className="text-2xl font-bold">0.3%</p>
            <p className="text-sm text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 inline" /> -0.2% from yesterday
            </p>
          </div>
        </div>
      </Card>

      {/* Recent Errors */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Errors & Warnings</h3>
        <div className="space-y-3">
          {errors.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No recent errors or warnings
            </p>
          ) : (
            errors.map((error) => (
              <div
                key={error.id}
                className="flex items-center justify-between p-3 border rounded"
              >
                <div className="flex items-center gap-3">
                  {error.level === "error" && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  {error.level === "warning" && (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  )}
                  {error.level === "info" && (
                    <Activity className="h-5 w-5 text-blue-500" />
                  )}
                  <div>
                    <p className="font-medium">{error.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(error.timestamp).toLocaleString()} • Occurred{" "}
                      {error.count} times
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    error.level === "error"
                      ? "destructive"
                      : error.level === "warning"
                      ? "secondary"
                      : "default"
                  }
                >
                  {error.level}
                </Badge>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Storage Usage */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Storage Usage</h3>
        <div className="space-y-4">
          {[
            { name: "Media Files", used: 45.2, total: 100, color: "bg-blue-500" },
            { name: "Database", used: 12.8, total: 50, color: "bg-purple-500" },
            { name: "Logs", used: 3.5, total: 10, color: "bg-orange-500" },
            { name: "Backups", used: 28.6, total: 100, color: "bg-green-500" },
          ].map((storage, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{storage.name}</span>
                <span className="text-sm text-muted-foreground">
                  {storage.used} GB / {storage.total} GB
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${storage.color} transition-all`}
                  style={{ width: `${(storage.used / storage.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
