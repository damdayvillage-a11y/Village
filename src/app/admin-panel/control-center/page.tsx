"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs';
import { FeatureToggleDashboard } from '@/lib/components/admin-panel/control-center/FeatureToggleDashboard';
import { BrandingManager } from '@/lib/components/admin-panel/control-center/BrandingManager';
import { APIKeyManager } from '@/lib/components/admin-panel/control-center/APIKeyManager';
import { Settings, Palette, Key, LayoutDashboard } from 'lucide-react';

export default function ControlCenterPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Admin Control Center
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your platform features, branding, and integrations - WordPress-style control
        </p>
      </div>

      <Tabs defaultValue="features" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-2xl">
          <TabsTrigger value="features" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
        </TabsList>

        <TabsContent value="features">
          <FeatureToggleDashboard />
        </TabsContent>

        <TabsContent value="branding">
          <BrandingManager />
        </TabsContent>

        <TabsContent value="api-keys">
          <APIKeyManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
