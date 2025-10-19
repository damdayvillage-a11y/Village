"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Label } from '@/lib/components/ui/label';
import { Textarea } from '@/lib/components/ui/textarea';
import { Save, Loader2, Globe, FileText, Search } from 'lucide-react';

interface SEOSettings {
  id?: string;
  siteName: string;
  siteDescription: string;
  defaultTitle: string;
  defaultDescription: string;
  keywords: string[];
  ogImage: string;
  twitterCard: string;
  googleSiteVerification: string;
  structuredData: any;
}

export default function SEOManagerPage() {
  const [seo, setSeo] = useState<SEOSettings>({
    siteName: 'Damday Village',
    siteDescription: 'Smart Carbon-Free Village Platform',
    defaultTitle: 'Damday Village',
    defaultDescription: 'A sustainable carbon-neutral village platform',
    keywords: [],
    ogImage: '',
    twitterCard: 'summary_large_image',
    googleSiteVerification: '',
    structuredData: {},
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');

  const fetchSEO = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/seo');
      if (res.ok) {
        const data = await res.json();
        if (data.seo) setSeo(data.seo);
      }
    } catch (error) {
      console.error('Failed to fetch SEO settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSEO();
  }, [fetchSEO]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seo),
      });
      if (res.ok) {
        await fetchSEO();
      }
    } catch (error) {
      console.error('Failed to save SEO settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const addKeyword = () => {
    if (keywordInput && !seo.keywords.includes(keywordInput)) {
      setSeo({ ...seo, keywords: [...seo.keywords, keywordInput] });
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setSeo({ ...seo, keywords: seo.keywords.filter((k) => k !== keyword) });
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
          <h1 className="text-3xl font-bold">SEO Manager</h1>
          <p className="text-muted-foreground">Configure site-wide SEO settings</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Settings
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <CardTitle>General Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Site Name</Label>
              <Input
                value={seo.siteName}
                onChange={(e) => setSeo({ ...seo, siteName: e.target.value })}
              />
            </div>
            <div>
              <Label>Site Description</Label>
              <Textarea
                value={seo.siteDescription}
                onChange={(e) => setSeo({ ...seo, siteDescription: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Default Title</Label>
                <Input
                  value={seo.defaultTitle}
                  onChange={(e) => setSeo({ ...seo, defaultTitle: e.target.value })}
                />
              </div>
              <div>
                <Label>OG Image URL</Label>
                <Input
                  value={seo.ogImage}
                  onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div>
              <Label>Default Meta Description</Label>
              <Textarea
                value={seo.defaultDescription}
                onChange={(e) => setSeo({ ...seo, defaultDescription: e.target.value })}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              <CardTitle>Keywords</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="Add keyword..."
                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
              />
              <Button onClick={addKeyword}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {seo.keywords.map((keyword) => (
                <div
                  key={keyword}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm flex items-center gap-2"
                >
                  {keyword}
                  <button
                    onClick={() => removeKeyword(keyword)}
                    className="hover:text-destructive"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <CardTitle>Verification & Advanced</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Google Site Verification</Label>
                <Input
                  value={seo.googleSiteVerification}
                  onChange={(e) =>
                    setSeo({ ...seo, googleSiteVerification: e.target.value })
                  }
                  placeholder="Verification code"
                />
              </div>
              <div>
                <Label>Twitter Card Type</Label>
                <Input
                  value={seo.twitterCard}
                  onChange={(e) => setSeo({ ...seo, twitterCard: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
