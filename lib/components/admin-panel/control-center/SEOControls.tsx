"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Label } from '@/lib/components/ui/label';
import { Badge } from '@/lib/components/ui/Badge';
import { Search, Save, Loader2, FileText, Globe, Image as ImageIcon } from 'lucide-react';

interface PageSEO {
  path: string;
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
  canonical?: string;
}

interface SEOAnalysis {
  titleLength: number;
  descriptionLength: number;
  keywordCount: number;
  titleOk: boolean;
  descriptionOk: boolean;
}

const PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/about', name: 'About' },
  { path: '/homestays', name: 'Homestays' },
  { path: '/marketplace', name: 'Marketplace' },
  { path: '/digital-twin', name: 'Digital Twin' },
  { path: '/village-tour', name: 'Village Tour' },
  { path: '/contact', name: 'Contact' },
];

export const SEOControls: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState('/');
  const [seoData, setSeoData] = useState<PageSEO>({
    path: '/',
    title: 'Damday Village - Smart Carbon-Free Village',
    description: 'Experience sustainable living in the heart of the Himalayas',
    keywords: 'carbon-free, village, tourism, sustainability, Himalayas',
    ogImage: '/og-image.jpg',
    canonical: 'https://village-app.captain.damdayvillage.com/',
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSEO(selectedPage);
  }, [selectedPage]);

  const fetchSEO = async (path: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/seo?path=${encodeURIComponent(path)}`);
      if (response.ok) {
        const data = await response.json();
        setSeoData(data);
      }
    } catch (error) {
      console.error('Failed to fetch SEO:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seoData),
      });

      if (response.ok) {
        alert('SEO settings saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save SEO:', error);
      alert('Failed to save SEO settings');
    } finally {
      setSaving(false);
    }
  };

  const analyzeSEO = (): SEOAnalysis => {
    const titleLength = seoData.title.length;
    const descriptionLength = seoData.description.length;
    const keywordCount = seoData.keywords.split(',').filter(k => k.trim()).length;

    return {
      titleLength,
      descriptionLength,
      keywordCount,
      titleOk: titleLength >= 30 && titleLength <= 60,
      descriptionOk: descriptionLength >= 120 && descriptionLength <= 160,
    };
  };

  const analysis = analyzeSEO();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">SEO Controls</h2>
          <p className="text-gray-600">Manage meta tags and SEO settings for each page</p>
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
              Save SEO
            </>
          )}
        </Button>
      </div>

      {/* Page Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Page</CardTitle>
          <CardDescription>Choose a page to customize its SEO</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {PAGES.map((page) => (
              <Button
                key={page.path}
                variant={selectedPage === page.path ? 'default' : 'outline'}
                onClick={() => setSelectedPage(page.path)}
                className="justify-start"
              >
                <FileText className="h-4 w-4 mr-2" />
                {page.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="p-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* SEO Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Meta Tags</CardTitle>
                <CardDescription>Basic SEO information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="title">Page Title</Label>
                    <Badge variant={analysis.titleOk ? 'default' : 'error'}>
                      {analysis.titleLength} chars
                    </Badge>
                  </div>
                  <Input
                    id="title"
                    value={seoData.title}
                    onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
                    placeholder="Enter page title..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optimal: 30-60 characters
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="description">Meta Description</Label>
                    <Badge variant={analysis.descriptionOk ? 'default' : 'error'}>
                      {analysis.descriptionLength} chars
                    </Badge>
                  </div>
                  <textarea
                    id="description"
                    value={seoData.description}
                    onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
                    placeholder="Enter meta description..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optimal: 120-160 characters
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="keywords">Keywords</Label>
                    <Badge>{analysis.keywordCount} keywords</Badge>
                  </div>
                  <Input
                    id="keywords"
                    value={seoData.keywords}
                    onChange={(e) => setSeoData({ ...seoData, keywords: e.target.value })}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Comma-separated list
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Open Graph and canonical URL</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ogImage">
                    <ImageIcon className="inline h-4 w-4 mr-1" />
                    Open Graph Image
                  </Label>
                  <Input
                    id="ogImage"
                    value={seoData.ogImage || ''}
                    onChange={(e) => setSeoData({ ...seoData, ogImage: e.target.value })}
                    placeholder="/images/og-image.jpg"
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    1200x630px recommended
                  </p>
                </div>

                <div>
                  <Label htmlFor="canonical">
                    <Globe className="inline h-4 w-4 mr-1" />
                    Canonical URL
                  </Label>
                  <Input
                    id="canonical"
                    value={seoData.canonical || ''}
                    onChange={(e) => setSeoData({ ...seoData, canonical: e.target.value })}
                    placeholder="https://example.com/page"
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Full URL including https://
                  </p>
                </div>

                {/* SEO Score */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-semibold text-blue-900 mb-2">SEO Analysis</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Title Length:</span>
                      <Badge variant={analysis.titleOk ? 'default' : 'error'}>
                        {analysis.titleOk ? 'Good' : 'Needs Improvement'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Description Length:</span>
                      <Badge variant={analysis.descriptionOk ? 'default' : 'error'}>
                        {analysis.descriptionOk ? 'Good' : 'Needs Improvement'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Keywords:</span>
                      <Badge>{analysis.keywordCount} set</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Search Result Preview</CardTitle>
              <CardDescription>How it appears in search engines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe className="h-4 w-4" />
                  <span>{seoData.canonical || 'https://example.com'}</span>
                </div>
                <h3 className="text-xl text-blue-600 hover:underline cursor-pointer">
                  {seoData.title || 'Page Title'}
                </h3>
                <p className="text-sm text-gray-600">
                  {seoData.description || 'Page description will appear here...'}
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
