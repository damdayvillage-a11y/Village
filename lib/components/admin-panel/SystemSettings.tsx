'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import {
  Settings,
  Mail,
  CreditCard,
  Key,
  ToggleLeft,
  ToggleRight,
  Save,
  Database,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

interface EmailConfig {
  provider: 'smtp' | 'sendgrid';
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  sendgridApiKey: string;
  fromEmail: string;
  fromName: string;
}

interface PaymentConfig {
  provider: 'razorpay' | 'stripe';
  razorpayKeyId: string;
  razorpayKeySecret: string;
  stripePublishableKey: string;
  stripeSecretKey: string;
  currency: string;
}

interface FeatureFlags {
  bookingEnabled: boolean;
  marketplaceEnabled: boolean;
  reviewsEnabled: boolean;
  iotEnabled: boolean;
  analyticsEnabled: boolean;
}

interface SystemStatus {
  maintenanceMode: boolean;
  lastBackup: string;
  databaseSize: string;
  storageUsed: string;
}

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState<'email' | 'payment' | 'api' | 'features' | 'system'>('email');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Email configuration
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    provider: 'smtp',
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    sendgridApiKey: '',
    fromEmail: '',
    fromName: 'Village Admin',
  });
  const [showEmailPassword, setShowEmailPassword] = useState(false);

  // Payment configuration
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>({
    provider: 'razorpay',
    razorpayKeyId: '',
    razorpayKeySecret: '',
    stripePublishableKey: '',
    stripeSecretKey: '',
    currency: 'INR',
  });
  const [showPaymentKeys, setShowPaymentKeys] = useState(false);

  // API Keys
  const [apiKeys, setApiKeys] = useState({
    googleMapsKey: '',
    weatherApiKey: '',
    smsApiKey: '',
  });
  const [showApiKeys, setShowApiKeys] = useState(false);

  // Feature flags
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>({
    bookingEnabled: true,
    marketplaceEnabled: true,
    reviewsEnabled: true,
    iotEnabled: true,
    analyticsEnabled: true,
  });

  // System status
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    maintenanceMode: false,
    lastBackup: 'Never',
    databaseSize: '0 MB',
    storageUsed: '0 MB',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would load from the API
      // For now, we'll use mock data that can be saved
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        if (data.email) setEmailConfig(data.email);
        if (data.payment) setPaymentConfig(data.payment);
        if (data.apiKeys) setApiKeys(data.apiKeys);
        if (data.features) setFeatureFlags(data.features);
        if (data.system) setSystemStatus(data.system);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (type: string, data: any) => {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const performBackup = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Backup started successfully!' });
        loadSettings(); // Reload to update last backup time
      } else {
        throw new Error('Backup failed');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to start backup.' });
    } finally {
      setSaving(false);
    }
  };

  const renderEmailSettings = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Provider</label>
        <select
          value={emailConfig.provider}
          onChange={(e) => setEmailConfig({ ...emailConfig, provider: e.target.value as 'smtp' | 'sendgrid' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="smtp">SMTP</option>
          <option value="sendgrid">SendGrid</option>
        </select>
      </div>

      {emailConfig.provider === 'smtp' ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
              <input
                type="text"
                value={emailConfig.smtpHost}
                onChange={(e) => setEmailConfig({ ...emailConfig, smtpHost: e.target.value })}
                placeholder="smtp.gmail.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
              <input
                type="number"
                value={emailConfig.smtpPort}
                onChange={(e) => setEmailConfig({ ...emailConfig, smtpPort: parseInt(e.target.value) })}
                placeholder="587"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
            <input
              type="text"
              value={emailConfig.smtpUser}
              onChange={(e) => setEmailConfig({ ...emailConfig, smtpUser: e.target.value })}
              placeholder="your-email@gmail.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
            <div className="relative">
              <input
                type={showEmailPassword ? 'text' : 'password'}
                value={emailConfig.smtpPassword}
                onChange={(e) => setEmailConfig({ ...emailConfig, smtpPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowEmailPassword(!showEmailPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                {showEmailPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SendGrid API Key</label>
          <input
            type={showEmailPassword ? 'text' : 'password'}
            value={emailConfig.sendgridApiKey}
            onChange={(e) => setEmailConfig({ ...emailConfig, sendgridApiKey: e.target.value })}
            placeholder="SG.••••••••"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
          <input
            type="email"
            value={emailConfig.fromEmail}
            onChange={(e) => setEmailConfig({ ...emailConfig, fromEmail: e.target.value })}
            placeholder="noreply@village.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
          <input
            type="text"
            value={emailConfig.fromName}
            onChange={(e) => setEmailConfig({ ...emailConfig, fromName: e.target.value })}
            placeholder="Village Admin"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <Button
        onClick={() => saveSettings('email', emailConfig)}
        disabled={saving}
        className="w-full"
      >
        <Save className="h-4 w-4 mr-2" />
        {saving ? 'Saving...' : 'Save Email Settings'}
      </Button>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Provider</label>
        <select
          value={paymentConfig.provider}
          onChange={(e) => setPaymentConfig({ ...paymentConfig, provider: e.target.value as 'razorpay' | 'stripe' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="razorpay">Razorpay</option>
          <option value="stripe">Stripe</option>
        </select>
      </div>

      {paymentConfig.provider === 'razorpay' ? (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Razorpay Key ID</label>
            <input
              type={showPaymentKeys ? 'text' : 'password'}
              value={paymentConfig.razorpayKeyId}
              onChange={(e) => setPaymentConfig({ ...paymentConfig, razorpayKeyId: e.target.value })}
              placeholder="rzp_••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Razorpay Key Secret</label>
            <input
              type={showPaymentKeys ? 'text' : 'password'}
              value={paymentConfig.razorpayKeySecret}
              onChange={(e) => setPaymentConfig({ ...paymentConfig, razorpayKeySecret: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stripe Publishable Key</label>
            <input
              type={showPaymentKeys ? 'text' : 'password'}
              value={paymentConfig.stripePublishableKey}
              onChange={(e) => setPaymentConfig({ ...paymentConfig, stripePublishableKey: e.target.value })}
              placeholder="pk_••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stripe Secret Key</label>
            <input
              type={showPaymentKeys ? 'text' : 'password'}
              value={paymentConfig.stripeSecretKey}
              onChange={(e) => setPaymentConfig({ ...paymentConfig, stripeSecretKey: e.target.value })}
              placeholder="sk_••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
        <select
          value={paymentConfig.currency}
          onChange={(e) => setPaymentConfig({ ...paymentConfig, currency: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="INR">INR (₹)</option>
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={showPaymentKeys}
          onChange={() => setShowPaymentKeys(!showPaymentKeys)}
          className="rounded"
        />
        <label className="text-sm text-gray-600">Show API keys</label>
      </div>

      <Button
        onClick={() => saveSettings('payment', paymentConfig)}
        disabled={saving}
        className="w-full"
      >
        <Save className="h-4 w-4 mr-2" />
        {saving ? 'Saving...' : 'Save Payment Settings'}
      </Button>
    </div>
  );

  const renderApiKeys = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps API Key</label>
        <input
          type={showApiKeys ? 'text' : 'password'}
          value={apiKeys.googleMapsKey}
          onChange={(e) => setApiKeys({ ...apiKeys, googleMapsKey: e.target.value })}
          placeholder="AIza••••••••"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Used for location services and maps</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Weather API Key</label>
        <input
          type={showApiKeys ? 'text' : 'password'}
          value={apiKeys.weatherApiKey}
          onChange={(e) => setApiKeys({ ...apiKeys, weatherApiKey: e.target.value })}
          placeholder="••••••••"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Used for weather data display</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">SMS API Key</label>
        <input
          type={showApiKeys ? 'text' : 'password'}
          value={apiKeys.smsApiKey}
          onChange={(e) => setApiKeys({ ...apiKeys, smsApiKey: e.target.value })}
          placeholder="••••••••"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Used for SMS notifications</p>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={showApiKeys}
          onChange={() => setShowApiKeys(!showApiKeys)}
          className="rounded"
        />
        <label className="text-sm text-gray-600">Show API keys</label>
      </div>

      <Button
        onClick={() => saveSettings('apiKeys', apiKeys)}
        disabled={saving}
        className="w-full"
      >
        <Save className="h-4 w-4 mr-2" />
        {saving ? 'Saving...' : 'Save API Keys'}
      </Button>
    </div>
  );

  const renderFeatureFlags = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        {Object.entries(featureFlags).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
              <p className="text-sm text-gray-500">
                {value ? 'Feature is enabled' : 'Feature is disabled'}
              </p>
            </div>
            <button
              onClick={() => setFeatureFlags({ ...featureFlags, [key]: !value })}
              className="focus:outline-none"
            >
              {value ? (
                <ToggleRight className="h-8 w-8 text-green-500" />
              ) : (
                <ToggleLeft className="h-8 w-8 text-gray-400" />
              )}
            </button>
          </div>
        ))}
      </div>

      <Button
        onClick={() => saveSettings('features', featureFlags)}
        disabled={saving}
        className="w-full"
      >
        <Save className="h-4 w-4 mr-2" />
        {saving ? 'Saving...' : 'Save Feature Flags'}
      </Button>
    </div>
  );

  const renderSystemStatus = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <Database className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Database Size</p>
                <p className="text-xl font-bold">{systemStatus.databaseSize}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <Database className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Storage Used</p>
                <p className="text-xl font-bold">{systemStatus.storageUsed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span className="font-medium">Maintenance Mode</span>
          </div>
          <button
            onClick={() => {
              const newStatus = { ...systemStatus, maintenanceMode: !systemStatus.maintenanceMode };
              setSystemStatus(newStatus);
              saveSettings('system', newStatus);
            }}
            className="focus:outline-none"
          >
            {systemStatus.maintenanceMode ? (
              <ToggleRight className="h-8 w-8 text-orange-500" />
            ) : (
              <ToggleLeft className="h-8 w-8 text-gray-400" />
            )}
          </button>
        </div>
        <p className="text-sm text-gray-600">
          {systemStatus.maintenanceMode
            ? 'Site is currently in maintenance mode. Users cannot access the site.'
            : 'Site is operational. All features are accessible to users.'}
        </p>
      </div>

      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-medium">Database Backup</p>
            <p className="text-sm text-gray-600">Last backup: {systemStatus.lastBackup}</p>
          </div>
          <Button
            onClick={performBackup}
            disabled={saving}
            variant="outline"
          >
            <Database className="h-4 w-4 mr-2" />
            Backup Now
          </Button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'email', label: 'Email Config', icon: Mail },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'features', label: 'Features', icon: ToggleLeft },
    { id: 'system', label: 'System', icon: Settings },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Settings className="h-8 w-8 text-gray-700" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure system preferences and integrations</p>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg flex items-center space-x-2 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="border-b border-gray-200">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading settings...</p>
            </div>
          ) : (
            <>
              {activeTab === 'email' && renderEmailSettings()}
              {activeTab === 'payment' && renderPaymentSettings()}
              {activeTab === 'api' && renderApiKeys()}
              {activeTab === 'features' && renderFeatureFlags()}
              {activeTab === 'system' && renderSystemStatus()}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
