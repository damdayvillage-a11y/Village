"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Switch } from '@/lib/components/ui/switch';
import { Badge } from '@/lib/components/ui/Badge';
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface Feature {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  requiresConfig?: boolean;
  configKeys?: string[];
  prNumber?: string;
  status: 'active' | 'planned' | 'beta';
}

export const FeatureToggleDashboard: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await fetch('/api/admin/features');
      if (response.ok) {
        const data = await response.json();
        setFeatures(data);
      }
    } catch (error) {
      console.error('Failed to fetch features:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = async (featureKey: string, enabled: boolean) => {
    setUpdating({ ...updating, [featureKey]: true });

    try {
      const response = await fetch('/api/admin/features', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featureKey, enabled }),
      });

      if (response.ok) {
        setFeatures(features.map(f => 
          f.key === featureKey ? { ...f, enabled } : f
        ));
      }
    } catch (error) {
      console.error('Failed to toggle feature:', error);
    } finally {
      setUpdating({ ...updating, [featureKey]: false });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'beta':
        return <Badge className="bg-blue-100 text-blue-800">Beta</Badge>;
      case 'planned':
        return <Badge className="bg-gray-100 text-gray-800">Planned</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Feature Toggle Dashboard</h2>
        <p className="text-gray-600">Enable or disable features across your platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature) => (
          <Card key={feature.key} className={feature.enabled ? 'border-green-200' : ''}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {feature.name}
                    {feature.prNumber && (
                      <Badge variant="default" className="text-xs">
                        PR{feature.prNumber}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {feature.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(feature.status)}
                  {updating[feature.key] ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Switch
                      checked={feature.enabled}
                      onCheckedChange={(checked) => toggleFeature(feature.key, checked)}
                      disabled={feature.status === 'planned'}
                    />
                  )}
                </div>
              </div>
            </CardHeader>
            {feature.requiresConfig && (
              <CardContent>
                <div className="flex items-start gap-2 text-sm">
                  {feature.enabled ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">Configuration Required:</p>
                    <ul className="list-disc list-inside text-gray-600 mt-1">
                      {feature.configKeys?.map((key) => (
                        <li key={key}>{key}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Feature Toggle Guidelines</p>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• Disabling a feature will hide it from users immediately</li>
                <li>• Some features require API keys to be configured before enabling</li>
                <li>• Planned features will be available in future updates</li>
                <li>• Beta features are functional but may have minor issues</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
