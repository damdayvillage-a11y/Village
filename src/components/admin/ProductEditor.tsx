"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Label } from '@/lib/components/ui/label';
import { Badge } from '@/lib/components/ui/Badge';
import {
  Package,
  DollarSign,
  Image as ImageIcon,
  Loader2,
  Save,
  X,
  Upload,
  Trash2,
  AlertCircle,
} from 'lucide-react';

interface ProductEditorProps {
  productId?: string | null;
  onSave?: () => void;
  onCancel?: () => void;
}

interface ProductData {
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  stock: number;
  unlimited: boolean;
  images: string[];
  carbonFootprint: number;
  locallySourced: boolean;
  active: boolean;
  sellerId?: string;
}

const categories = [
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

export default function ProductEditor({ productId, onSave, onCancel }: ProductEditorProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  
  const [formData, setFormData] = useState<ProductData>({
    name: '',
    description: '',
    category: 'Handicrafts',
    price: 0,
    currency: 'INR',
    stock: 0,
    unlimited: false,
    images: [],
    carbonFootprint: 0,
    locallySourced: false,
    active: true,
  });

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/products/${productId}`);
      if (response.ok) {
        const product = await response.json();
        setFormData({
          name: product.name || '',
          description: product.description || '',
          category: product.category || 'Handicrafts',
          price: product.price || 0,
          currency: product.currency || 'INR',
          stock: product.stock || 0,
          unlimited: product.unlimited || false,
          images: Array.isArray(product.images) ? product.images : [],
          carbonFootprint: product.carbonFootprint || 0,
          locallySourced: product.locallySourced || false,
          active: product.active !== undefined ? product.active : true,
          sellerId: product.sellerId,
        });
      } else {
        setError('Failed to load product');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProductData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()],
      }));
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Product name is required';
    if (!formData.description.trim()) return 'Description is required';
    if (formData.price <= 0) return 'Price must be greater than 0';
    if (!formData.unlimited && formData.stock < 0) return 'Stock cannot be negative';
    if (formData.images.length === 0) return 'At least one image is required';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const url = productId
        ? `/api/admin/products/${productId}`
        : '/api/admin/products';
      
      const method = productId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        if (onSave) onSave();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save product');
      }
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Failed to save product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {productId ? 'Edit Product' : 'Create New Product'}
        </CardTitle>
        <CardDescription>
          {productId ? 'Update product details' : 'Add a new product to the marketplace'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter detailed product description"
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing & Inventory
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                id="unlimited"
                checked={formData.unlimited}
                onChange={(e) => handleInputChange('unlimited', e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <Label htmlFor="unlimited" className="cursor-pointer">
                Unlimited Stock (Don't track inventory)
              </Label>
            </div>

            {!formData.unlimited && (
              <div>
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                />
              </div>
            )}
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Product Images *
            </h3>
            
            <div className="flex gap-2">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
              />
              <Button type="button" onClick={handleAddImage} variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {index === 0 && (
                      <Badge className="absolute bottom-2 left-2">Primary</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sustainability */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sustainability</h3>
            
            <div>
              <Label htmlFor="carbonFootprint">Carbon Footprint (kg CO₂)</Label>
              <Input
                id="carbonFootprint"
                type="number"
                step="0.01"
                min="0"
                value={formData.carbonFootprint}
                onChange={(e) => handleInputChange('carbonFootprint', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                id="locallySourced"
                checked={formData.locallySourced}
                onChange={(e) => handleInputChange('locallySourced', e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <Label htmlFor="locallySourced" className="cursor-pointer">
                Locally Sourced
              </Label>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => handleInputChange('active', e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <Label htmlFor="active" className="cursor-pointer">
              Active (Visible to customers)
            </Label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {productId ? 'Update Product' : 'Create Product'}
                </>
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
