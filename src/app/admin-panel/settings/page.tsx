"use client";

import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Mail, 
  CreditCard, 
  Key, 
  Link2, 
  Database,
  Save,
  Loader2
} from "lucide-react";

interface SystemSettings {
  general: {
    siteName: string;
    tagline: string;
    timezone: string;
    language: string;
    dateFormat: string;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  payment: {
    stripePublishableKey: string;
    stripeSecretKey: string;
    paypalClientId: string;
    paypalSecretKey: string;
    currency: string;
  };
  apiKeys: {
    googleMapsKey: string;
    googleAnalyticsId: string;
    cloudinaryCloudName: string;
    cloudinaryApiKey: string;
    cloudinaryApiSecret: string;
  };
  integrations: {
    slackWebhook: string;
    discordWebhook: string;
    webhookUrl: string;
  };
  system: {
    maintenanceMode: boolean;
    debugMode: boolean;
    cacheEnabled: boolean;
  };
}

export default function SystemSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: "Damday Village",
      tagline: "Smart Carbon-Free Living",
      timezone: "Asia/Bangkok",
      language: "en",
      dateFormat: "YYYY-MM-DD",
    },
    email: {
      smtpHost: "smtp.gmail.com",
      smtpPort: 587,
      smtpUser: "",
      smtpPassword: "",
      fromEmail: "noreply@damdayvillage.com",
      fromName: "Damday Village",
    },
    payment: {
      stripePublishableKey: "",
      stripeSecretKey: "",
      paypalClientId: "",
      paypalSecretKey: "",
      currency: "USD",
    },
    apiKeys: {
      googleMapsKey: "",
      googleAnalyticsId: "",
      cloudinaryCloudName: "",
      cloudinaryApiKey: "",
      cloudinaryApiSecret: "",
    },
    integrations: {
      slackWebhook: "",
      discordWebhook: "",
      webhookUrl: "",
    },
    system: {
      maintenanceMode: false,
      debugMode: false,
      cacheEnabled: true,
    },
  });

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) throw new Error("Failed to save settings");
      
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }, [settings]);

  const updateSettings = <K extends keyof SystemSettings>(
    category: K,
    field: keyof SystemSettings[K],
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            System Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure system-wide settings and integrations
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="apikeys">API Keys</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">General Settings</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.general.siteName}
                  onChange={(e) => updateSettings("general", "siteName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={settings.general.tagline}
                  onChange={(e) => updateSettings("general", "tagline", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={settings.general.timezone}
                  onChange={(e) => updateSettings("general", "timezone", e.target.value)}
                >
                  <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                  <option value="America/New_York">America/New_York (GMT-5)</option>
                  <option value="Europe/London">Europe/London (GMT+0)</option>
                </select>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Email Configuration</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input id="smtpHost" value={settings.email.smtpHost} onChange={(e) => updateSettings("email", "smtpHost", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input id="smtpPort" type="number" value={settings.email.smtpPort} onChange={(e) => updateSettings("email", "smtpPort", parseInt(e.target.value))} />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Settings</h2>
            <div className="space-y-4">
              <div>
                <Label>Stripe Keys</Label>
                <Input placeholder="Publishable Key" value={settings.payment.stripePublishableKey} onChange={(e) => updateSettings("payment", "stripePublishableKey", e.target.value)} />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="apikeys">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">API Keys</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="googleMapsKey">Google Maps API Key</Label>
                <Input id="googleMapsKey" value={settings.apiKeys.googleMapsKey} onChange={(e) => updateSettings("apiKeys", "googleMapsKey", e.target.value)} />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Integrations</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="slackWebhook">Slack Webhook</Label>
                <Input id="slackWebhook" value={settings.integrations.slackWebhook} onChange={(e) => updateSettings("integrations", "slackWebhook", e.target.value)} />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">System Configuration</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-semibold">Maintenance Mode</div>
                  <p className="text-sm text-muted-foreground">Show maintenance page</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.system.maintenanceMode}
                  onChange={(e) => updateSettings("system", "maintenanceMode", e.target.checked)}
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
