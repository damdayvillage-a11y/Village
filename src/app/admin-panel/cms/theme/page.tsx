"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Label } from '@/lib/components/ui/label';
import { Save, Loader2, Palette, Type, Layout } from 'lucide-react';

interface ThemeSettings {
  id?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
  };
  typography: {
    fontFamily: string;
    headingFont: string;
    fontSize: string;
  };
  layout: {
    containerWidth: string;
    borderRadius: string;
    spacing: string;
  };
}

export default function ThemeEditorPage() {
  const [theme, setTheme] = useState<ThemeSettings>({
    colors: {
      primary: '#10b981',
      secondary: '#8b5cf6',
      accent: '#f59e0b',
      background: '#ffffff',
      foreground: '#000000',
      muted: '#f3f4f6',
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      headingFont: 'Inter, sans-serif',
      fontSize: '16px',
    },
    layout: {
      containerWidth: '1280px',
      borderRadius: '0.5rem',
      spacing: '1rem',
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchTheme = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/cms/theme');
      if (res.ok) {
        const data = await res.json();
        if (data.theme) setTheme(data.theme);
      }
    } catch (error) {
      console.error('Failed to fetch theme:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTheme();
  }, [fetchTheme]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/cms/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(theme),
      });
      if (res.ok) {
        await fetchTheme();
      }
    } catch (error) {
      console.error('Failed to save theme:', error);
    } finally {
      setSaving(false);
    }
  };

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
          <h1 className="text-3xl font-bold">Theme Editor</h1>
          <p className="text-muted-foreground">Customize colors, typography, and layout</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Theme
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              <CardTitle>Colors</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(theme.colors).map(([key, value]) => (
                <div key={key}>
                  <Label className="capitalize">{key}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={value}
                      onChange={(e) =>
                        setTheme({
                          ...theme,
                          colors: { ...theme.colors, [key]: e.target.value },
                        })
                      }
                      className="w-16 h-10"
                    />
                    <Input
                      value={value}
                      onChange={(e) =>
                        setTheme({
                          ...theme,
                          colors: { ...theme.colors, [key]: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Type className="w-5 h-5" />
              <CardTitle>Typography</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Body Font</Label>
                <Input
                  value={theme.typography.fontFamily}
                  onChange={(e) =>
                    setTheme({
                      ...theme,
                      typography: { ...theme.typography, fontFamily: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label>Heading Font</Label>
                <Input
                  value={theme.typography.headingFont}
                  onChange={(e) =>
                    setTheme({
                      ...theme,
                      typography: { ...theme.typography, headingFont: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label>Base Font Size</Label>
                <Input
                  value={theme.typography.fontSize}
                  onChange={(e) =>
                    setTheme({
                      ...theme,
                      typography: { ...theme.typography, fontSize: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layout className="w-5 h-5" />
              <CardTitle>Layout</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Container Width</Label>
                <Input
                  value={theme.layout.containerWidth}
                  onChange={(e) =>
                    setTheme({
                      ...theme,
                      layout: { ...theme.layout, containerWidth: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label>Border Radius</Label>
                <Input
                  value={theme.layout.borderRadius}
                  onChange={(e) =>
                    setTheme({
                      ...theme,
                      layout: { ...theme.layout, borderRadius: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label>Spacing Unit</Label>
                <Input
                  value={theme.layout.spacing}
                  onChange={(e) =>
                    setTheme({
                      ...theme,
                      layout: { ...theme.layout, spacing: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
