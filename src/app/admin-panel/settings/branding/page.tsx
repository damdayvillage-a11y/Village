"use client";

import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image as ImageIcon, Save, Loader2, Upload } from "lucide-react";

interface BrandingConfig {
  logos: {
    main: string;
    favicon: string;
    ogImage: string;
  };
  brandColors: {
    primary: string;
    secondary: string;
  };
  tagline: string;
  social: {
    website: string;
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    github: string;
    discord: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  legal: {
    termsUrl: string;
    privacyUrl: string;
    cookieUrl: string;
  };
}

export default function BrandingManagerPage() {
  const [saving, setSaving] = useState(false);
  const [branding, setBranding] = useState<BrandingConfig>({
    logos: {
      main: "",
      favicon: "",
      ogImage: "",
    },
    brandColors: {
      primary: "#3b82f6",
      secondary: "#10b981",
    },
    tagline: "Smart Carbon-Free Living",
    social: {
      website: "https://damdayvillage.com",
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      youtube: "",
      github: "",
      discord: "",
    },
    contact: {
      email: "info@damdayvillage.com",
      phone: "+66 123 456 7890",
      address: "Damday Village, Thailand",
    },
    legal: {
      termsUrl: "/terms",
      privacyUrl: "/privacy",
      cookieUrl: "/cookies",
    },
  });

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/settings/branding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(branding),
      });

      if (!response.ok) throw new Error("Failed to save");
      alert("Branding saved successfully!");
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save branding");
    } finally {
      setSaving(false);
    }
  }, [branding]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ImageIcon className="h-8 w-8" />
            Branding Manager
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your brand identity and assets
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

      <Tabs defaultValue="logos" className="w-full">
        <TabsList>
          <TabsTrigger value="logos">Logos</TabsTrigger>
          <TabsTrigger value="colors">Brand Colors</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
        </TabsList>

        <TabsContent value="logos">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Logo Management</h2>
            <div className="space-y-6">
              <div>
                <Label>Main Logo</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="h-24 w-24 border-2 border-dashed rounded-lg flex items-center justify-center">
                    {branding.logos.main ? (
                      <img src={branding.logos.main} alt="Logo" className="max-h-full max-w-full" />
                    ) : (
                      <Upload className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                </div>
              </div>
              <div>
                <Label>Favicon</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="h-16 w-16 border-2 border-dashed rounded-lg flex items-center justify-center">
                    {branding.logos.favicon ? (
                      <img src={branding.logos.favicon} alt="Favicon" className="max-h-full max-w-full" />
                    ) : (
                      <Upload className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Favicon
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="colors">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Brand Colors</h2>
            <div className="space-y-4">
              <div>
                <Label>Primary Color</Label>
                <div className="flex gap-2 items-center mt-2">
                  <input
                    type="color"
                    value={branding.brandColors.primary}
                    onChange={(e) =>
                      setBranding((prev) => ({
                        ...prev,
                        brandColors: { ...prev.brandColors, primary: e.target.value },
                      }))
                    }
                    className="h-10 w-20 rounded border"
                  />
                  <Input
                    value={branding.brandColors.primary}
                    onChange={(e) =>
                      setBranding((prev) => ({
                        ...prev,
                        brandColors: { ...prev.brandColors, primary: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Secondary Color</Label>
                <div className="flex gap-2 items-center mt-2">
                  <input
                    type="color"
                    value={branding.brandColors.secondary}
                    onChange={(e) =>
                      setBranding((prev) => ({
                        ...prev,
                        brandColors: { ...prev.brandColors, secondary: e.target.value },
                      }))
                    }
                    className="h-10 w-20 rounded border"
                  />
                  <Input
                    value={branding.brandColors.secondary}
                    onChange={(e) =>
                      setBranding((prev) => ({
                        ...prev,
                        brandColors: { ...prev.brandColors, secondary: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Tagline</Label>
                <Input
                  value={branding.tagline}
                  onChange={(e) =>
                    setBranding((prev) => ({ ...prev, tagline: e.target.value }))
                  }
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Social Media Links</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(branding.social).map(([key, value]) => (
                <div key={key}>
                  <Label className="capitalize">{key}</Label>
                  <Input
                    value={value}
                    onChange={(e) =>
                      setBranding((prev) => ({
                        ...prev,
                        social: { ...prev.social, [key]: e.target.value },
                      }))
                    }
                    placeholder={`https://${key}.com/yourprofile`}
                  />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={branding.contact.email}
                  onChange={(e) =>
                    setBranding((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, email: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={branding.contact.phone}
                  onChange={(e) =>
                    setBranding((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, phone: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  value={branding.contact.address}
                  onChange={(e) =>
                    setBranding((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, address: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="legal">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Legal Pages</h2>
            <div className="space-y-4">
              <div>
                <Label>Terms of Service URL</Label>
                <Input
                  value={branding.legal.termsUrl}
                  onChange={(e) =>
                    setBranding((prev) => ({
                      ...prev,
                      legal: { ...prev.legal, termsUrl: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label>Privacy Policy URL</Label>
                <Input
                  value={branding.legal.privacyUrl}
                  onChange={(e) =>
                    setBranding((prev) => ({
                      ...prev,
                      legal: { ...prev.legal, privacyUrl: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label>Cookie Policy URL</Label>
                <Input
                  value={branding.legal.cookieUrl}
                  onChange={(e) =>
                    setBranding((prev) => ({
                      ...prev,
                      legal: { ...prev.legal, cookieUrl: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
