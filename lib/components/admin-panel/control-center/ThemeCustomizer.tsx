"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Label } from '@/lib/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs';
import { Save, Eye, Loader2, Type, Layout, Palette } from 'lucide-react';

interface ThemeConfig {
  fonts: {
    heading: string;
    body: string;
  };
  layout: {
    maxWidth: string;
    spacing: string;
    borderRadius: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

const FONT_OPTIONS = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Playfair Display',
  'Merriweather',
];

const SPACING_OPTIONS = ['compact', 'normal', 'relaxed', 'spacious'];
const BORDER_RADIUS_OPTIONS = ['none', 'sm', 'md', 'lg', 'xl'];

export const ThemeCustomizer: React.FC = () => {
  const [theme, setTheme] = useState<ThemeConfig>({
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    layout: {
      maxWidth: '1280px',
      spacing: 'normal',
      borderRadius: 'md',
    },
    colors: {
      primary: '#061335',
      secondary: '#1E40AF',
      accent: '#10B981',
      background: '#FFFFFF',
      text: '#1F2937',
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    fetchTheme();
  }, []);

  const fetchTheme = async () => {
    try {
      const response = await fetch('/api/admin/theme');
      if (response.ok) {
        const data = await response.json();
        setTheme(data);
      }
    } catch (error) {
      console.error('Failed to fetch theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(theme),
      });

      if (response.ok) {
        alert('Theme updated successfully!');
      }
    } catch (error) {
      console.error('Failed to save theme:', error);
      alert('Failed to save theme');
    } finally {
      setSaving(false);
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Advanced Theme Customizer</h2>
          <p className="text-gray-600">Customize fonts, layout, and advanced styling options</p>
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
                Save Theme
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="fonts" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-2xl">
          <TabsTrigger value="fonts">
            <Type className="h-4 w-4 mr-2" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="layout">
            <Layout className="h-4 w-4 mr-2" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="colors">
            <Palette className="h-4 w-4 mr-2" />
            Colors
          </TabsTrigger>
        </TabsList>

        {/* Typography Tab */}
        <TabsContent value="fonts">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Font Settings</CardTitle>
                <CardDescription>Choose fonts for headings and body text</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Heading Font</Label>
                  <select
                    value={theme.fonts.heading}
                    onChange={(e) => setTheme({
                      ...theme,
                      fonts: { ...theme.fonts, heading: e.target.value },
                    })}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Body Font</Label>
                  <select
                    value={theme.fonts.body}
                    onChange={(e) => setTheme({
                      ...theme,
                      fonts: { ...theme.fonts, body: e.target.value },
                    })}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Font Preview</CardTitle>
                <CardDescription>See how your fonts look</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Heading Font</p>
                  <h1 
                    className="text-3xl font-bold"
                    style={{ fontFamily: theme.fonts.heading }}
                  >
                    The Quick Brown Fox
                  </h1>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Body Font</p>
                  <p style={{ fontFamily: theme.fonts.body }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Layout Settings</CardTitle>
                <CardDescription>Control spacing and container width</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Max Content Width</Label>
                  <Input
                    value={theme.layout.maxWidth}
                    onChange={(e) => setTheme({
                      ...theme,
                      layout: { ...theme.layout, maxWidth: e.target.value },
                    })}
                    placeholder="1280px"
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">e.g., 1280px, 90%, 100vw</p>
                </div>

                <div>
                  <Label>Spacing</Label>
                  <select
                    value={theme.layout.spacing}
                    onChange={(e) => setTheme({
                      ...theme,
                      layout: { ...theme.layout, spacing: e.target.value },
                    })}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {SPACING_OPTIONS.map((spacing) => (
                      <option key={spacing} value={spacing}>
                        {spacing.charAt(0).toUpperCase() + spacing.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Border Radius</Label>
                  <select
                    value={theme.layout.borderRadius}
                    onChange={(e) => setTheme({
                      ...theme,
                      layout: { ...theme.layout, borderRadius: e.target.value },
                    })}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {BORDER_RADIUS_OPTIONS.map((radius) => (
                      <option key={radius} value={radius}>
                        {radius.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Layout Preview</CardTitle>
                <CardDescription>Visual representation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed p-4 space-y-3">
                  <div 
                    className="bg-blue-100 p-4"
                    style={{
                      borderRadius: theme.layout.borderRadius === 'none' ? '0' :
                                    theme.layout.borderRadius === 'sm' ? '0.125rem' :
                                    theme.layout.borderRadius === 'md' ? '0.375rem' :
                                    theme.layout.borderRadius === 'lg' ? '0.5rem' : '0.75rem',
                    }}
                  >
                    Border Radius: {theme.layout.borderRadius}
                  </div>
                  <div className="bg-green-100 p-4">
                    Max Width: {theme.layout.maxWidth}
                  </div>
                  <div className="bg-purple-100 p-4">
                    Spacing: {theme.layout.spacing}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Colors Tab */}
        <TabsContent value="colors">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Color Palette</CardTitle>
                <CardDescription>Extended color customization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(theme.colors).map(([key, value]) => (
                  <div key={key}>
                    <Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                    <div className="flex gap-2 mt-2">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => setTheme({
                          ...theme,
                          colors: { ...theme.colors, [key]: e.target.value },
                        })}
                        className="h-10 w-20 cursor-pointer rounded border"
                      />
                      <Input
                        value={value}
                        onChange={(e) => setTheme({
                          ...theme,
                          colors: { ...theme.colors, [key]: e.target.value },
                        })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Color Preview</CardTitle>
                <CardDescription>See your color scheme</CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="p-6 rounded-lg space-y-3"
                  style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}
                >
                  <div 
                    className="px-4 py-2 rounded font-medium text-white"
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    Primary Color
                  </div>
                  <div 
                    className="px-4 py-2 rounded font-medium text-white"
                    style={{ backgroundColor: theme.colors.secondary }}
                  >
                    Secondary Color
                  </div>
                  <div 
                    className="px-4 py-2 rounded font-medium text-white"
                    style={{ backgroundColor: theme.colors.accent }}
                  >
                    Accent Color
                  </div>
                  <p>Text color on background</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
