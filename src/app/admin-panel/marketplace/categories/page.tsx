"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Label } from '@/lib/components/ui/label';
import { Badge } from '@/lib/components/ui/Badge';
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Loader2,
  Package,
  AlertCircle,
  Search,
} from 'lucide-react';

interface Category {
  name: string;
  description: string;
  productCount: number;
  slug: string;
  active: boolean;
}

const defaultCategories = [
  'Handicrafts',
  'Textiles',
  'Food & Beverages',
  'Organic Products',
  'Art & Crafts',
  'Jewelry',
  'Home Decor',
  'Clothing',
  'Accessories',
  'Other',
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    active: true,
  });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/products?groupBy=category');
      if (response.ok) {
        const data = await response.json();
        
        // Create categories with product counts
        const categoriesWithCounts = defaultCategories.map((cat) => {
          const productCount = data.categories?.[cat] || 0;
          return {
            name: cat,
            description: '',
            productCount,
            slug: cat.toLowerCase().replace(/\s+/g, '-'),
            active: true,
          };
        });
        
        setCategories(categoriesWithCounts);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Fallback to default categories
      setCategories(
        defaultCategories.map((cat) => ({
          name: cat,
          description: '',
          productCount: 0,
          slug: cat.toLowerCase().replace(/\s+/g, '-'),
          active: true,
        }))
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreateCategory = () => {
    setFormData({ name: '', description: '', active: true });
    setEditingCategory(null);
    setShowCreateModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description,
      active: category.active,
    });
    setEditingCategory(category.name);
    setShowCreateModal(true);
  };

  const handleSaveCategory = () => {
    if (!formData.name.trim()) {
      alert('Category name is required');
      return;
    }

    if (editingCategory) {
      // Update existing category
      setCategories((prev) =>
        prev.map((cat) =>
          cat.name === editingCategory
            ? {
                ...cat,
                name: formData.name,
                description: formData.description,
                active: formData.active,
                slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
              }
            : cat
        )
      );
    } else {
      // Add new category
      const newCategory: Category = {
        name: formData.name,
        description: formData.description,
        productCount: 0,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        active: formData.active,
      };
      setCategories((prev) => [...prev, newCategory]);
    }

    setShowCreateModal(false);
    setFormData({ name: '', description: '', active: true });
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName);
    
    if (category && category.productCount > 0) {
      alert(`Cannot delete category "${categoryName}" because it has ${category.productCount} products. Please reassign or delete the products first.`);
      return;
    }

    if (!confirm(`Are you sure you want to delete the category "${categoryName}"?`)) {
      return;
    }

    setCategories((prev) => prev.filter((cat) => cat.name !== categoryName));
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: categories.length,
    active: categories.filter((c) => c.active).length,
    totalProducts: categories.reduce((sum, c) => sum + c.productCount, 0),
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FolderTree className="h-8 w-8" />
            Category Management
          </h1>
          <p className="text-gray-600 mt-1">Organize marketplace products by category</p>
        </div>
        <Button onClick={handleCreateCategory}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Categories</CardTitle>
            <FolderTree className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Categories</CardTitle>
            <FolderTree className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalProducts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Info Alert */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold">Category Management</p>
              <p className="mt-1">
                Categories are currently managed as simple text values. Future updates will include:
                hierarchical categories, category images, and SEO optimization.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>Categories ({filteredCategories.length})</CardTitle>
          <CardDescription>Manage product categories</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FolderTree className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No categories found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map((category) => (
                <Card key={category.name} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          {category.name}
                          {category.active ? (
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                          )}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{category.slug}</p>
                      </div>
                    </div>

                    {category.description && (
                      <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                    )}

                    <div className="flex items-center gap-2 mb-4">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium">
                        {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditCategory(category)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteCategory(category.name)}
                        disabled={category.productCount > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md m-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderTree className="h-5 w-5" />
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </CardTitle>
              <CardDescription>
                {editingCategory ? 'Update category details' : 'Add a new product category'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="categoryName">Category Name *</Label>
                <Input
                  id="categoryName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <Label htmlFor="categoryDescription">Description</Label>
                <textarea
                  id="categoryDescription"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter category description (optional)"
                  className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="categoryActive"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <Label htmlFor="categoryActive" className="cursor-pointer">
                  Active (Visible to customers)
                </Label>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={handleSaveCategory} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {editingCategory ? 'Update' : 'Create'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ name: '', description: '', active: true });
                    setEditingCategory(null);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
