"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Label } from '@/lib/components/ui/label';
import { Upload, Eye, Save, Loader2, Image as ImageIcon } from 'lucide-react';

interface BrandingSettings {
  siteName: string;
  tagline: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export const BrandingManager: React.FC = () => {
  const [branding, setBranding] = useState<BrandingSettings>({
    siteName: 'Damday Village',
    tagline: 'Smart Carbon-Free Village',
    logo: '',
    favicon: '',
    primaryColor: '#061335',
    secondaryColor: '#1E40AF',
    accentColor: '#10B981',
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    fetchBranding();
  }, []);

  const fetchBranding = async () => {
    try {
      const response = await fetch('/api/admin/branding');
      if (response.ok) {
        const data = await response.json();
        setBranding(data);
      }
    } catch (error) {
      console.error('Failed to fetch branding:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/branding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(branding),
      });

      if (response.ok) {
        alert('Branding updated successfully!');
      }
    } catch (error) {
      console.error('Failed to save branding:', error);
      alert('Failed to save branding');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'logo');

    try {
      const response = await fetch('/api/admin/branding/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setBranding({ ...branding, logo: data.url });
      }
    } catch (error) {
      console.error('Failed to upload logo:', error);
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Branding Manager</h2>
          <p className="text-gray-600">Customize your site's logo, colors, and identity</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Edit Mode' : 'Preview'}
          </Button>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Site Information</CardTitle>
            <CardDescription>Basic site identity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={branding.siteName}
                onChange={(e) => setBranding({ ...branding, siteName: e.target.value })}
                placeholder="Damday Village"
              />
            </div>
            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={branding.tagline}
                onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
                placeholder="Smart Carbon-Free Village"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Color Scheme</CardTitle>
            <CardDescription>Customize your brand colors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="primaryColor">Primary</Label>
                <input
                  type="color"
                  id="primaryColor"
                  value={branding.primaryColor}
                  onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                  className="h-10 w-full cursor-pointer rounded border mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">{branding.primaryColor}</p>
              </div>
              
              <div>
                <Label htmlFor="secondaryColor">Secondary</Label>
                <input
                  type="color"
                  id="secondaryColor"
                  value={branding.secondaryColor}
                  onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                  className="h-10 w-full cursor-pointer rounded border mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">{branding.secondaryColor}</p>
              </div>
              
              <div>
                <Label htmlFor="accentColor">Accent</Label>
                <input
                  type="color"
                  id="accentColor"
                  value={branding.accentColor}
                  onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                  className="h-10 w-full cursor-pointer rounded border mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">{branding.accentColor}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>See how your branding looks</CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="border rounded-lg p-6 space-y-4"
              style={{ backgroundColor: branding.primaryColor }}
            >
              <div className="text-white">
                <h3 className="text-xl font-bold">{branding.siteName}</h3>
                <p className="text-sm opacity-90">{branding.tagline}</p>
              </div>
              <div className="flex gap-2">
                <div 
                  className="px-4 py-2 rounded font-medium text-white"
                  style={{ backgroundColor: branding.secondaryColor }}
                >
                  Secondary
                </div>
                <div 
                  className="px-4 py-2 rounded font-medium text-white"
                  style={{ backgroundColor: branding.accentColor }}
                >
                  Accent
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
