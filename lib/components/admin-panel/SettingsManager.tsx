"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/lib/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Input } from '@/lib/components/ui/Input';
import { Label } from '@/lib/components/ui/label';
import { Switch } from '@/lib/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs';
import { Badge } from '@/lib/components/ui/Badge';
import { useToast } from '@/lib/hooks/use-toast';
import { 
  Save, 
  RefreshCw, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Eye,
  EyeOff,
  TestTube
} from 'lucide-react';

interface Setting {
  value: any;
  label: string;
  description: string;
  sensitive?: boolean;
  masked?: boolean;
  type?: 'boolean' | 'string' | 'number' | 'select';
  options?: string[];
}

interface Settings {
  features: Record<string, Setting>;
  email: Record<string, Setting>;
  payment: Record<string, Setting>;
  storage: Record<string, Setting>;
  sms: Record<string, Setting>;
  system: Record<string, Setting>;
}

interface ValidationResult {
  valid: boolean;
  message: string;
}

export default function SettingsManager() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('features');
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [validationResults, setValidationResults] = useState<Record<string, ValidationResult>>({});
  const [testingKeys, setTestingKeys] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (category: string, key: string, value: any) => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, key, value }),
      });

      if (!response.ok) throw new Error('Failed to update setting');
      
      // Update local state
      if (settings) {
        setSettings({
          ...settings,
          [category]: {
            ...settings[category as keyof Settings],
            [key]: {
              ...settings[category as keyof Settings][key],
              value,
            },
          },
        });
      }

      toast({
        title: 'Success',
        description: 'Setting updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update setting',
        variant: 'destructive',
      });
    }
  };

  const testApiKey = async (category: string, key: string) => {
    const testKey = `${category}.${key}`;
    setTestingKeys(prev => ({ ...prev, [testKey]: true }));

    try {
      const response = await fetch('/api/admin/settings/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          category, 
          key,
          value: settings?.[category as keyof Settings]?.[key]?.value 
        }),
      });

      const result = await response.json();
      
      setValidationResults(prev => ({
        ...prev,
        [testKey]: {
          valid: result.valid,
          message: result.message || (result.valid ? 'Validation successful' : 'Validation failed'),
        },
      }));

      toast({
        title: result.valid ? 'Success' : 'Validation Failed',
        description: result.message,
        variant: result.valid ? 'default' : 'destructive',
      });
    } catch (error) {
      setValidationResults(prev => ({
        ...prev,
        [testKey]: {
          valid: false,
          message: 'Failed to validate API key',
        },
      }));
      toast({
        title: 'Error',
        description: 'Failed to validate API key',
        variant: 'destructive',
      });
    } finally {
      setTestingKeys(prev => ({ ...prev, [testKey]: false }));
    }
  };

  const resetCategory = async (category: string) => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/settings/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
      });

      if (!response.ok) throw new Error('Failed to reset settings');
      
      await fetchSettings();
      toast({
        title: 'Success',
        description: `${category} settings reset to defaults`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const exportSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings/export');
      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `settings-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Success',
        description: 'Settings exported successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export settings',
        variant: 'destructive',
      });
    }
  };

  const togglePasswordVisibility = (key: string) => {
    setVisiblePasswords(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderFeatureToggles = () => {
    if (!settings?.features) return null;

    return (
      <div className="space-y-4">
        {Object.entries(settings.features).map(([key, setting]) => (
          <Card key={key}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium">{setting.label}</CardTitle>
                  <CardDescription className="text-xs">{setting.description}</CardDescription>
                </div>
                <Switch
                  checked={setting.value}
                  onCheckedChange={(checked) => updateSetting('features', key, checked)}
                />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  };

  const renderApiKeyInput = (category: string, key: string, setting: Setting) => {
    const inputKey = `${category}.${key}`;
    const isVisible = visiblePasswords[inputKey];
    const validation = validationResults[inputKey];
    const isTesting = testingKeys[inputKey];

    return (
      <div className="space-y-2">
        <Label htmlFor={inputKey}>{setting.label}</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id={inputKey}
              type={isVisible || !setting.sensitive ? 'text' : 'password'}
              value={setting.masked ? '••••••••' : setting.value || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (!setting.masked) {
                  const newSettings = { ...settings };
                  const categorySettings = newSettings[category as keyof Settings];
                  if (categorySettings && key in categorySettings) {
                    (categorySettings as any)[key].value = e.target.value;
                  }
                  setSettings(newSettings as Settings);
                }
              }}
              onBlur={() => {
                if (!setting.masked) {
                  updateSetting(category, key, settings?.[category as keyof Settings]?.[key]?.value);
                }
              }}
              disabled={setting.masked}
              className="pr-10"
            />
            {setting.sensitive && (
              <button
                type="button"
                onClick={() => togglePasswordVisibility(inputKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
          </div>
          {setting.sensitive && !setting.masked && (
            <Button
              onClick={() => testApiKey(category, key)}
              disabled={isTesting || !setting.value}
              variant="outline"
              size="sm"
              className="shrink-0"
            >
              {isTesting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4" />
              )}
              <span className="ml-2">Test</span>
            </Button>
          )}
        </div>
        {validation && (
          <div className={`flex items-center gap-2 text-sm ${validation.valid ? 'text-green-600' : 'text-red-600'}`}>
            {validation.valid ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span>{validation.message}</span>
          </div>
        )}
        <p className="text-xs text-gray-500">{setting.description}</p>
      </div>
    );
  };

  const renderCategorySettings = (category: string) => {
    if (!settings || !settings[category as keyof Settings]) return null;

    const categorySettings = settings[category as keyof Settings];

    return (
      <div className="space-y-6">
        {Object.entries(categorySettings).map(([key, setting]) => (
          <Card key={key}>
            <CardContent className="pt-6">
              {setting.type === 'boolean' ? (
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{setting.label}</Label>
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  </div>
                  <Switch
                    checked={setting.value}
                    onCheckedChange={(checked) => updateSetting(category, key, checked)}
                  />
                </div>
              ) : setting.type === 'select' ? (
                <div className="space-y-2">
                  <Label htmlFor={`${category}-${key}`}>{setting.label}</Label>
                  <select
                    id={`${category}-${key}`}
                    value={setting.value || ''}
                    onChange={(e) => updateSetting(category, key, e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select...</option>
                    {setting.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500">{setting.description}</p>
                </div>
              ) : (
                renderApiKeyInput(category, key, setting)
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings Manager</h1>
          <p className="text-gray-500 mt-1">Manage all system settings and configurations</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchSettings} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportSettings} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="features">
            Features
            <Badge variant="default" className="ml-2">
              {Object.values(settings?.features || {}).filter(s => s.value).length}/{Object.keys(settings?.features || {}).length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Enable or disable features across the platform</p>
            <Button 
              onClick={() => resetCategory('features')} 
              variant="outline" 
              size="sm"
              disabled={saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Reset to Defaults
            </Button>
          </div>
          {renderFeatureToggles()}
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Configure email provider settings</p>
            <Button 
              onClick={() => resetCategory('email')} 
              variant="outline" 
              size="sm"
              disabled={saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Reset to Defaults
            </Button>
          </div>
          {renderCategorySettings('email')}
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Configure payment gateway settings</p>
            <Button 
              onClick={() => resetCategory('payment')} 
              variant="outline" 
              size="sm"
              disabled={saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Reset to Defaults
            </Button>
          </div>
          {renderCategorySettings('payment')}
        </TabsContent>

        <TabsContent value="storage" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Configure cloud storage settings</p>
            <Button 
              onClick={() => resetCategory('storage')} 
              variant="outline" 
              size="sm"
              disabled={saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Reset to Defaults
            </Button>
          </div>
          {renderCategorySettings('storage')}
        </TabsContent>

        <TabsContent value="sms" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Configure SMS provider settings</p>
            <Button 
              onClick={() => resetCategory('sms')} 
              variant="outline" 
              size="sm"
              disabled={saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Reset to Defaults
            </Button>
          </div>
          {renderCategorySettings('sms')}
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Configure system-wide settings</p>
            <Button 
              onClick={() => resetCategory('system')} 
              variant="outline" 
              size="sm"
              disabled={saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Reset to Defaults
            </Button>
          </div>
          {renderCategorySettings('system')}
        </TabsContent>
      </Tabs>
    </div>
  );
}
