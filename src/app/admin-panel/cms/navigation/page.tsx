"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Label } from '@/lib/components/ui/label';
import { Badge } from '@/lib/components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/lib/components/ui/select';
import {
  Plus,
  Save,
  Trash2,
  GripVertical,
  ChevronRight,
  ChevronDown,
  Menu,
  Link2,
  Home,
  FileText,
  ExternalLink,
  Loader2,
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  type: 'PAGE' | 'LINK' | 'DROPDOWN';
  url?: string;
  pageId?: string;
  icon?: string;
  order: number;
  parentId?: string;
  children?: MenuItem[];
}

interface NavMenu {
  id: string;
  name: string;
  location: 'HEADER' | 'FOOTER' | 'SIDEBAR' | 'MOBILE';
  items: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

export default function NavigationBuilderPage() {
  const [menus, setMenus] = useState<NavMenu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<NavMenu | null>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // New menu/item form state
  const [menuName, setMenuName] = useState('');
  const [menuLocation, setMenuLocation] = useState<'HEADER' | 'FOOTER' | 'SIDEBAR' | 'MOBILE'>('HEADER');
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    label: '',
    type: 'PAGE',
    order: 0,
  });

  const fetchMenus = useCallback(async () => {
    try {
      const [menusRes, pagesRes] = await Promise.all([
        fetch('/api/admin/cms/menus'),
        fetch('/api/admin/cms/pages'),
      ]);

      if (menusRes.ok) {
        const data = await menusRes.json();
        setMenus(data.menus || []);
      }

      if (pagesRes.ok) {
        const data = await pagesRes.json();
        setPages(data.pages || []);
      }
    } catch (error) {
      console.error('Failed to fetch menus:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const handleCreateMenu = async () => {
    if (!menuName) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/cms/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: menuName,
          location: menuLocation,
          items: [],
        }),
      });

      if (res.ok) {
        const newMenu = await res.json();
        setMenus([...menus, newMenu.menu]);
        setSelectedMenu(newMenu.menu);
        setMenuName('');
      }
    } catch (error) {
      console.error('Failed to create menu:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddMenuItem = () => {
    if (!selectedMenu || !newItem.label) return;

    const menuItem: MenuItem = {
      id: `item-${Date.now()}`,
      label: newItem.label,
      type: newItem.type as 'PAGE' | 'LINK' | 'DROPDOWN',
      url: newItem.url,
      pageId: newItem.pageId,
      icon: newItem.icon,
      order: selectedMenu.items.length,
      parentId: newItem.parentId,
    };

    setSelectedMenu({
      ...selectedMenu,
      items: [...selectedMenu.items, menuItem],
    });

    setNewItem({ label: '', type: 'PAGE', order: 0 });
    setShowAddItemForm(false);
  };

  const handleUpdateMenuItem = (itemId: string, updates: Partial<MenuItem>) => {
    if (!selectedMenu) return;

    setSelectedMenu({
      ...selectedMenu,
      items: selectedMenu.items.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
    });
  };

  const handleDeleteMenuItem = (itemId: string) => {
    if (!selectedMenu) return;

    setSelectedMenu({
      ...selectedMenu,
      items: selectedMenu.items.filter((item) => item.id !== itemId),
    });
  };

  const handleMoveMenuItem = (itemId: string, direction: 'up' | 'down') => {
    if (!selectedMenu) return;

    const items = [...selectedMenu.items];
    const index = items.findIndex((i) => i.id === itemId);

    if (direction === 'up' && index > 0) {
      [items[index], items[index - 1]] = [items[index - 1], items[index]];
    } else if (direction === 'down' && index < items.length - 1) {
      [items[index], items[index + 1]] = [items[index + 1], items[index]];
    }

    items.forEach((item, idx) => {
      item.order = idx;
    });

    setSelectedMenu({ ...selectedMenu, items });
  };

  const handleSaveMenu = async () => {
    if (!selectedMenu) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/cms/menus`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedMenu.id,
          name: selectedMenu.name,
          location: selectedMenu.location,
          items: selectedMenu.items,
        }),
      });

      if (res.ok) {
        await fetchMenus();
      }
    } catch (error) {
      console.error('Failed to save menu:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = selectedMenu?.items.some((i) => i.parentId === item.id);
    const isExpanded = expandedItems.has(item.id);

    return (
      <div key={item.id} style={{ marginLeft: `${level * 24}px` }}>
        <div className="flex items-center gap-2 p-3 border rounded-lg mb-2 bg-card">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
          {hasChildren && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => toggleExpanded(item.id)}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {item.type === 'PAGE' && <FileText className="w-4 h-4" />}
              {item.type === 'LINK' && <Link2 className="w-4 h-4" />}
              {item.type === 'DROPDOWN' && <Menu className="w-4 h-4" />}
              <span className="font-medium">{item.label}</span>
              <Badge variant="default">{item.type}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {item.type === 'PAGE' && item.pageId
                ? `Page: ${pages.find((p) => p.id === item.pageId)?.title || item.pageId}`
                : item.url || 'No URL'}
            </p>
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDeleteMenuItem(item.id)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </div>
        {isExpanded &&
          selectedMenu?.items
            .filter((i) => i.parentId === item.id)
            .map((child) => renderMenuItem(child, level + 1))}
      </div>
    );
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
          <h1 className="text-3xl font-bold">Navigation Builder</h1>
          <p className="text-muted-foreground">
            Create and manage site navigation menus
          </p>
        </div>
        {selectedMenu && (
          <Button onClick={handleSaveMenu} disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Menu
          </Button>
        )}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Menus List Sidebar */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Menus</CardTitle>
              <CardDescription>Select a menu to edit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Create New Menu */}
              <div className="space-y-2 pb-4 border-b">
                <Input
                  placeholder="Menu name"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                />
                <Select value={menuLocation} onValueChange={(value: any) => setMenuLocation(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HEADER">Header</SelectItem>
                    <SelectItem value="FOOTER">Footer</SelectItem>
                    <SelectItem value="SIDEBAR">Sidebar</SelectItem>
                    <SelectItem value="MOBILE">Mobile</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleCreateMenu}
                  disabled={!menuName || saving}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Menu
                </Button>
              </div>

              {/* Menus List */}
              <div className="space-y-2">
                {menus.map((menu) => (
                  <div
                    key={menu.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedMenu?.id === menu.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedMenu(menu)}
                  >
                    <div className="flex items-center gap-2">
                      <Menu className="w-4 h-4" />
                      <span className="font-medium text-sm">{menu.name}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <Badge variant="default" className="text-xs">
                        {menu.location}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {menu.items.length} items
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Editor Area */}
        <div className="col-span-9">
          {selectedMenu ? (
            <div className="space-y-6">
              {/* Menu Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Menu Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={selectedMenu.name}
                        onChange={(e) =>
                          setSelectedMenu({ ...selectedMenu, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Select
                        value={selectedMenu.location}
                        onValueChange={(value: any) =>
                          setSelectedMenu({ ...selectedMenu, location: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HEADER">Header</SelectItem>
                          <SelectItem value="FOOTER">Footer</SelectItem>
                          <SelectItem value="SIDEBAR">Sidebar</SelectItem>
                          <SelectItem value="MOBILE">Mobile</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Menu Items */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Menu Items</CardTitle>
                    <Button onClick={() => setShowAddItemForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {showAddItemForm && (
                    <Card className="bg-muted">
                      <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Label</Label>
                            <Input
                              value={newItem.label}
                              onChange={(e) =>
                                setNewItem({ ...newItem, label: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label>Type</Label>
                            <Select
                              value={newItem.type}
                              onValueChange={(value: any) =>
                                setNewItem({ ...newItem, type: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PAGE">Page</SelectItem>
                                <SelectItem value="LINK">Link</SelectItem>
                                <SelectItem value="DROPDOWN">Dropdown</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        {newItem.type === 'PAGE' && (
                          <div>
                            <Label>Select Page</Label>
                            <Select
                              value={newItem.pageId}
                              onValueChange={(value) =>
                                setNewItem({ ...newItem, pageId: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Choose a page..." />
                              </SelectTrigger>
                              <SelectContent>
                                {pages.map((page) => (
                                  <SelectItem key={page.id} value={page.id}>
                                    {page.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        {newItem.type === 'LINK' && (
                          <div>
                            <Label>URL</Label>
                            <Input
                              value={newItem.url}
                              onChange={(e) =>
                                setNewItem({ ...newItem, url: e.target.value })
                              }
                              placeholder="https://..."
                            />
                          </div>
                        )}
                        <div>
                          <Label>Parent (optional)</Label>
                          <Select
                            value={newItem.parentId}
                            onValueChange={(value) =>
                              setNewItem({ ...newItem, parentId: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Top level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Top level</SelectItem>
                              {selectedMenu.items
                                .filter((i) => i.type === 'DROPDOWN')
                                .map((item) => (
                                  <SelectItem key={item.id} value={item.id}>
                                    {item.label}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleAddMenuItem} disabled={!newItem.label}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add
                          </Button>
                          <Button
                            variant="default"
                            onClick={() => {
                              setShowAddItemForm(false);
                              setNewItem({ label: '', type: 'PAGE', order: 0 });
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {selectedMenu.items.filter((i) => !i.parentId).length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Menu className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No menu items yet. Add an item to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedMenu.items
                        .filter((i) => !i.parentId)
                        .sort((a, b) => a.order - b.order)
                        .map((item) => renderMenuItem(item))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center min-h-[400px]">
                <div className="text-center text-muted-foreground">
                  <Menu className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a menu from the sidebar to edit</p>
                  <p className="text-sm">or create a new menu to get started</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
