"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Label } from '@/lib/components/ui/label';
import { Badge } from '@/lib/components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/lib/components/ui/select';
import { Loader2, Bell, Plus, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

interface AlertRule {
  id: string;
  name: string;
  deviceId: string;
  deviceName: string;
  metric: string;
  condition: string;
  threshold: number;
  enabled: boolean;
  createdAt: string;
}

interface Alert {
  id: string;
  ruleId: string;
  ruleName: string;
  deviceName: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export default function AlertsPage() {
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    deviceId: '',
    metric: '',
    condition: 'greater_than',
    threshold: 0,
  });

  const fetchAlertRules = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/iot/alert-rules');
      if (res.ok) {
        const data = await res.json();
        setAlertRules(data.rules || []);
      }
    } catch (error) {
      console.error('Failed to fetch alert rules:', error);
    }
  }, []);

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/iot/alerts?limit=50');
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlertRules();
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchAlertRules, fetchAlerts]);

  const handleCreateRule = async () => {
    if (!newRule.name || !newRule.deviceId || !newRule.metric) return;

    try {
      const res = await fetch('/api/admin/iot/alert-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRule),
      });

      if (res.ok) {
        await fetchAlertRules();
        setShowCreateForm(false);
        setNewRule({
          name: '',
          deviceId: '',
          metric: '',
          condition: 'greater_than',
          threshold: 0,
        });
      }
    } catch (error) {
      console.error('Failed to create alert rule:', error);
    }
  };

  const handleToggleRule = async (ruleId: string, enabled: boolean) => {
    try {
      await fetch(`/api/admin/iot/alert-rules/${ruleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      await fetchAlertRules();
    } catch (error) {
      console.error('Failed to toggle alert rule:', error);
    }
  };

  const handleAcknowledge = async (alertId: string) => {
    try {
      await fetch(`/api/admin/iot/alerts/${alertId}/acknowledge`, {
        method: 'POST',
      });
      await fetchAlerts();
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'INFO':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800';
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800';
      case 'INFO':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

  if (loading) {
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
          <h1 className="text-3xl font-bold">Alert Management</h1>
          <p className="text-muted-foreground">
            Configure alert rules and monitor system notifications
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Rule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {alertRules.filter((r) => r.enabled).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unacknowledged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{unacknowledgedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {alerts.filter((a) => a.severity === 'CRITICAL').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Rule Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Alert Rule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Rule Name</Label>
              <Input
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                placeholder="e.g., High Temperature Alert"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Metric</Label>
                <Input
                  value={newRule.metric}
                  onChange={(e) => setNewRule({ ...newRule, metric: e.target.value })}
                  placeholder="e.g., temperature"
                />
              </div>
              <div>
                <Label>Condition</Label>
                <Select
                  value={newRule.condition}
                  onValueChange={(value) => setNewRule({ ...newRule, condition: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="greater_than">Greater than</SelectItem>
                    <SelectItem value="less_than">Less than</SelectItem>
                    <SelectItem value="equals">Equals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Threshold Value</Label>
              <Input
                type="number"
                value={newRule.threshold}
                onChange={(e) => setNewRule({ ...newRule, threshold: parseFloat(e.target.value) })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateRule}>Create Rule</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alert Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Rules</CardTitle>
        </CardHeader>
        <CardContent>
          {alertRules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No alert rules configured</p>
            </div>
          ) : (
            <div className="space-y-2">
              {alertRules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{rule.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {rule.deviceName} • {rule.metric} {rule.condition.replace('_', ' ')}{' '}
                      {rule.threshold}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={rule.enabled ? 'default' : 'default'}>
                      {rule.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleRule(rule.id, !rule.enabled)}
                    >
                      {rule.enabled ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No alerts triggered</p>
            </div>
          ) : (
            <div className="space-y-2">
              {alerts.slice(0, 20).map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start justify-between p-4 border rounded-lg ${
                    !alert.acknowledged ? 'bg-muted/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{alert.ruleName}</span>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        {!alert.acknowledged && (
                          <Badge variant="default">New</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {alert.deviceName} • {alert.message}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                        <Clock className="w-3 h-3" />
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {!alert.acknowledged && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAcknowledge(alert.id)}
                    >
                      Acknowledge
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
