"use client";

import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Save, Loader2, Download, Upload, RotateCcw } from "lucide-react";

interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  typography: {
    fontFamily: {
      heading: string;
      body: string;
      mono: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
    };
  };
  spacing: {
    unit: number;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
  darkMode: {
    enabled: boolean;
  };
  customCSS: string;
}

export default function AdvancedThemeEditorPage() {
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState<ThemeConfig>({
    colors: {
      primary: "#3b82f6",
      secondary: "#10b981",
      accent: "#f59e0b",
      background: "#ffffff",
      foreground: "#000000",
      muted: "#f3f4f6",
      border: "#e5e7eb",
    },
    typography: {
      fontFamily: {
        heading: "Inter, sans-serif",
        body: "Inter, sans-serif",
        mono: "Fira Code, monospace",
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
      },
    },
    spacing: {
      unit: 4,
    },
    borderRadius: {
      sm: "0.25rem",
      md: "0.5rem",
      lg: "1rem",
    },
    darkMode: {
      enabled: false,
    },
    customCSS: "",
  });

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/settings/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(theme),
      });

      if (!response.ok) throw new Error("Failed to save");
      alert("Theme saved successfully!");
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save theme");
    } finally {
      setSaving(false);
    }
  }, [theme]);

  const updateColor = (key: keyof ThemeConfig["colors"], value: string) => {
    setTheme((prev) => ({
      ...prev,
      colors: { ...prev.colors, [key]: value },
    }));
  };

  const exportTheme = () => {
    const dataStr = JSON.stringify(theme, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = "theme.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Palette className="h-8 w-8" />
            Advanced Theme Editor
          </h1>
          <p className="text-muted-foreground mt-1">
            Customize your application's visual design system
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportTheme}>
            <Download className="h-4 w-4 mr-2" />
            Export
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

      <Tabs defaultValue="colors" className="w-full">
        <TabsList>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="spacing">Spacing</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="colors">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Color Palette</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(theme.colors).map(([key, value]) => (
                <div key={key}>
                  <Label className="capitalize">{key}</Label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) =>
                        updateColor(key as keyof ThemeConfig["colors"], e.target.value)
                      }
                      className="h-10 w-20 rounded border"
                    />
                    <Input value={value} onChange={(e) => updateColor(key as keyof ThemeConfig["colors"], e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="typography">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Typography</h2>
            <div className="space-y-4">
              <div>
                <Label>Heading Font</Label>
                <Input
                  value={theme.typography.fontFamily.heading}
                  onChange={(e) =>
                    setTheme((prev) => ({
                      ...prev,
                      typography: {
                        ...prev.typography,
                        fontFamily: {
                          ...prev.typography.fontFamily,
                          heading: e.target.value,
                        },
                      },
                    }))
                  }
                />
              </div>
              <div>
                <Label>Body Font</Label>
                <Input
                  value={theme.typography.fontFamily.body}
                  onChange={(e) =>
                    setTheme((prev) => ({
                      ...prev,
                      typography: {
                        ...prev.typography,
                        fontFamily: {
                          ...prev.typography.fontFamily,
                          body: e.target.value,
                        },
                      },
                    }))
                  }
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="spacing">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Spacing & Layout</h2>
            <div className="space-y-4">
              <div>
                <Label>Base Spacing Unit (px)</Label>
                <Input
                  type="number"
                  value={theme.spacing.unit}
                  onChange={(e) =>
                    setTheme((prev) => ({
                      ...prev,
                      spacing: { unit: parseInt(e.target.value) },
                    }))
                  }
                />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Border Radius</h3>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(theme.borderRadius).map(([key, value]) => (
                    <div key={key}>
                      <Label className="capitalize">{key}</Label>
                      <Input
                        value={value}
                        onChange={(e) =>
                          setTheme((prev) => ({
                            ...prev,
                            borderRadius: {
                              ...prev.borderRadius,
                              [key]: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Advanced Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-semibold">Dark Mode</div>
                  <p className="text-sm text-muted-foreground">
                    Enable dark mode support
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={theme.darkMode.enabled}
                  onChange={(e) =>
                    setTheme((prev) => ({
                      ...prev,
                      darkMode: { enabled: e.target.checked },
                    }))
                  }
                />
              </div>
              <div>
                <Label>Custom CSS</Label>
                <textarea
                  className="w-full h-48 p-3 border rounded-md font-mono text-sm"
                  value={theme.customCSS}
                  onChange={(e) =>
                    setTheme((prev) => ({ ...prev, customCSS: e.target.value }))
                  }
                  placeholder="/* Add custom CSS here */"
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
