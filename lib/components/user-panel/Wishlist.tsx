'use client';

import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingCart,
  Trash2,
  Search,
  Filter,
  DollarSign,
  Package
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Badge } from '@/lib/components/ui/Badge';

interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  productImage?: string;
  productStock: number;
  productCategory: string;
  inStock: boolean;
  addedAt: string;
}

interface WishlistProps {
  items: WishlistItem[];
  onRemove: (itemId: string) => Promise<void>;
  onAddToCart?: (productId: string) => void;
}

export function Wishlist({ 
  items,
  onRemove,
  onAddToCart
}: WishlistProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const handleRemove = async (itemId: string) => {
    setIsRemoving(itemId);
    try {
      await onRemove(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setIsRemoving(null);
    }
  };

  const filterItems = () => {
    let filtered = items;

    // Apply stock filter
    if (filter === 'inStock') {
      filtered = filtered.filter(item => item.inStock);
    } else if (filter === 'outOfStock') {
      filtered = filtered.filter(item => !item.inStock);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.productCategory.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredItems = filterItems();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Wishlist</h2>
        <p className="text-gray-600">
          {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
        </p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('inStock')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  filter === 'inStock'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                In Stock
              </button>
              <button
                onClick={() => setFilter('outOfStock')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  filter === 'outOfStock'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Out of Stock
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wishlist Items */}
      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {items.length === 0 ? 'Your wishlist is empty' : 'No items found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {items.length === 0
                ? 'Save items you like to your wishlist'
                : 'Try adjusting your search or filters'}
            </p>
            {items.length === 0 && (
              <Button variant="primary">
                Browse Marketplace
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow relative">
              <CardContent className="p-4">
                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item.id)}
                  disabled={isRemoving === item.id}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors z-10"
                  title="Remove from wishlist"
                >
                  <Heart className="h-5 w-5 text-red-500 fill-current" />
                </button>

                {/* Product Image */}
                <div className="w-full h-48 bg-gray-100 rounded-md mb-4 overflow-hidden">
                  {item.productImage ? (
                    <img 
                      src={item.productImage} 
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-2">
                  {/* Category Badge */}
                  <Badge className="bg-gray-100 text-gray-800 text-xs">
                    {item.productCategory}
                  </Badge>

                  {/* Product Name */}
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {item.productName}
                  </h3>

                  {/* Product Description */}
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.productDescription}
                  </p>

                  {/* Price and Stock */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{item.productPrice.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      {item.inStock ? (
                        <Badge className="bg-green-100 text-green-800">
                          In Stock
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {onAddToCart && item.inStock && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => onAddToCart(item.productId)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className={onAddToCart && item.inStock ? '' : 'flex-1'}
                    >
                      View Product
                    </Button>
                  </div>

                  {/* Added Date */}
                  <p className="text-xs text-gray-500 text-center pt-2">
                    Added {new Date(item.addedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary */}
      {filteredItems.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Wishlist Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{filteredItems.reduce((sum, item) => sum + item.productPrice, 0).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Items in Stock</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredItems.filter(item => item.inStock).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
