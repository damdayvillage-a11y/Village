"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Label } from '@/lib/components/ui/label';
import { Badge } from '@/lib/components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/lib/components/ui/select';
import { ContentBlockEditor, type BlockType } from '@/components/admin/ContentBlockEditor';
import { generateSlug } from '@/lib/cms-utils';
import {
  Plus,
  Save,
  Eye,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Loader2,
  FileText,
  Globe,
  Smartphone,
  Tablet,
  Monitor,
} from 'lucide-react';

interface Page {
  id: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  blocks: PageBlock[];
  createdAt: string;
  updatedAt: string;
}

interface PageBlock {
  id: string;
  type: BlockType;
  content: any;
  order: number;
}

export default function PageBuilderPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showPreview, setShowPreview] = useState(false);

  // Page form state
  const [pageTitle, setPageTitle] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [pageStatus, setPageStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('DRAFT');

  const fetchPages = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/cms/pages');
      if (res.ok) {
        const data = await res.json();
        setPages(data.pages || []);
      }
    } catch (error) {
      console.error('Failed to fetch pages:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const handleCreatePage = async () => {
    if (!pageTitle) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/cms/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: pageTitle,
          slug: pageSlug || generateSlug(pageTitle),
          status: pageStatus,
          blocks: [],
        }),
      });

      if (res.ok) {
        const newPage = await res.json();
        setPages([...pages, newPage.page]);
        setSelectedPage(newPage.page);
        setPageTitle('');
        setPageSlug('');
      }
    } catch (error) {
      console.error('Failed to create page:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddBlock = (blockType: BlockType) => {
    if (!selectedPage) return;

    const newBlock: PageBlock = {
      id: `block-${Date.now()}`,
      type: blockType,
      content: {},
      order: selectedPage.blocks.length,
    };

    setSelectedPage({
      ...selectedPage,
      blocks: [...selectedPage.blocks, newBlock],
    });
  };

  const handleUpdateBlock = (blockId: string, content: any) => {
    if (!selectedPage) return;

    setSelectedPage({
      ...selectedPage,
      blocks: selectedPage.blocks.map((block) =>
        block.id === blockId ? { ...block, content } : block
      ),
    });
  };

  const handleDeleteBlock = (blockId: string) => {
    if (!selectedPage) return;

    setSelectedPage({
      ...selectedPage,
      blocks: selectedPage.blocks.filter((block) => block.id !== blockId),
    });
  };

  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    if (!selectedPage) return;

    const blocks = [...selectedPage.blocks];
    const index = blocks.findIndex((b) => b.id === blockId);

    if (direction === 'up' && index > 0) {
      [blocks[index], blocks[index - 1]] = [blocks[index - 1], blocks[index]];
    } else if (direction === 'down' && index < blocks.length - 1) {
      [blocks[index], blocks[index + 1]] = [blocks[index + 1], blocks[index]];
    }

    // Update order
    blocks.forEach((block, idx) => {
      block.order = idx;
    });

    setSelectedPage({ ...selectedPage, blocks });
  };

  const handleSavePage = async () => {
    if (!selectedPage) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/cms/pages`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedPage.id,
          title: selectedPage.title,
          slug: selectedPage.slug,
          status: selectedPage.status,
          blocks: selectedPage.blocks,
        }),
      });

      if (res.ok) {
        await fetchPages();
      }
    } catch (error) {
      console.error('Failed to save page:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePublishPage = async () => {
    if (!selectedPage) return;

    setSelectedPage({ ...selectedPage, status: 'PUBLISHED' });
    await handleSavePage();
  };

  const blockTypes: BlockType[] = [
    'TEXT',
    'IMAGE',
    'HERO',
    'VIDEO',
    'CTA',
    'STATS',
    'GRID',
    'CAROUSEL',
    'TESTIMONIAL',
    'FAQ',
    'FORM',
    'MAP',
  ];

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
          <h1 className="text-3xl font-bold">Page Builder</h1>
          <p className="text-muted-foreground">
            Create and manage dynamic pages with drag-and-drop blocks
          </p>
        </div>
        <div className="flex gap-2">
          {selectedPage && (
            <>
              <Button
                variant="default"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Edit' : 'Preview'}
              </Button>
              <Button onClick={handleSavePage} disabled={saving}>
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save
              </Button>
              {selectedPage.status !== 'PUBLISHED' && (
                <Button onClick={handlePublishPage} variant="default">
                  <Globe className="w-4 h-4 mr-2" />
                  Publish
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Pages List Sidebar */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Pages</CardTitle>
              <CardDescription>Select a page to edit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Create New Page */}
              <div className="space-y-2 pb-4 border-b">
                <Input
                  placeholder="Page title"
                  value={pageTitle}
                  onChange={(e) => {
                    setPageTitle(e.target.value);
                    setPageSlug(generateSlug(e.target.value));
                  }}
                />
                <Input
                  placeholder="Slug (auto-generated)"
                  value={pageSlug}
                  onChange={(e) => setPageSlug(e.target.value)}
                />
                <Button
                  onClick={handleCreatePage}
                  disabled={!pageTitle || saving}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Page
                </Button>
              </div>

              {/* Pages List */}
              <div className="space-y-2">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedPage?.id === page.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedPage(page)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="font-medium text-sm">{page.title}</span>
                      </div>
                      <Badge variant="default">
                        {page.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      /{page.slug}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Editor Area */}
        <div className="col-span-9">
          {selectedPage ? (
            <div className="space-y-6">
              {/* Page Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Page Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={selectedPage.title}
                        onChange={(e) =>
                          setSelectedPage({ ...selectedPage, title: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Slug</Label>
                      <Input
                        value={selectedPage.slug}
                        onChange={(e) =>
                          setSelectedPage({ ...selectedPage, slug: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select
                        value={selectedPage.status}
                        onValueChange={(value: any) =>
                          setSelectedPage({ ...selectedPage, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DRAFT">Draft</SelectItem>
                          <SelectItem value="PUBLISHED">Published</SelectItem>
                          <SelectItem value="ARCHIVED">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* View Mode Switcher */}
              <div className="flex justify-center gap-2">
                <Button
                  variant={viewMode === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('mobile')}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'tablet' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('tablet')}
                >
                  <Tablet className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('desktop')}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
              </div>

              {/* Content Blocks */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Content Blocks</CardTitle>
                    <Select onValueChange={(value) => handleAddBlock(value as BlockType)}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Add block..." />
                      </SelectTrigger>
                      <SelectContent>
                        {blockTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent
                  className={`space-y-4 mx-auto ${
                    viewMode === 'mobile'
                      ? 'max-w-sm'
                      : viewMode === 'tablet'
                      ? 'max-w-2xl'
                      : 'max-w-full'
                  }`}
                >
                  {selectedPage.blocks.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No blocks added yet. Add a block to get started.</p>
                    </div>
                  ) : (
                    selectedPage.blocks.map((block, index) => (
                      <div
                        key={block.id}
                        className="border rounded-lg p-4 space-y-4 bg-card"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                            <Badge variant="default">{block.type}</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMoveBlock(block.id, 'up')}
                              disabled={index === 0}
                            >
                              <ChevronUp className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMoveBlock(block.id, 'down')}
                              disabled={index === selectedPage.blocks.length - 1}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteBlock(block.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        <ContentBlockEditor
                          blockType={block.type}
                          content={block.content}
                          onChange={(content) => handleUpdateBlock(block.id, content)}
                        />
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center min-h-[400px]">
                <div className="text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a page from the sidebar to edit</p>
                  <p className="text-sm">or create a new page to get started</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
