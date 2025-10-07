'use client';

import React, { useState } from 'react';
import { Card } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Badge } from '@/lib/components/ui/Badge';

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  seller: string;
  category: string;
  description: string;
  stock: number;
}

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Handwoven Pashmina Shawl',
    price: 15000,
    rating: 4.9,
    seller: 'Himalayan Handicrafts Co.',
    category: 'Local Crafts',
    description: 'Authentic handwoven pashmina shawl from local artisans',
    stock: 5
  },
  {
    id: '2', 
    name: 'Organic Himalayan Honey',
    price: 800,
    rating: 4.8,
    seller: 'Mountain View Organic Farm',
    category: 'Organic Food',
    description: 'Pure organic honey from Himalayan wildflowers',
    stock: 12
  },
  {
    id: '3',
    name: 'Traditional Copper Water Bottle',
    price: 1200,
    rating: 4.9,
    seller: 'Local Artisan Collective',
    category: 'Local Crafts',
    description: 'Handcrafted copper bottle with traditional designs',
    stock: 8
  },
  {
    id: '4',
    name: 'Himalayan Pink Rock Salt',
    price: 300,
    rating: 4.7,
    seller: 'Village Cooperative',
    category: 'Organic Food',
    description: 'Natural pink rock salt from Himalayan mines',
    stock: 25
  }
];

export default function MarketplacePage() {
  const [products] = useState<Product[]>(sampleProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const categories = ['All', 'Local Crafts', 'Organic Food', 'Textiles', 'Tea & Spices'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  const getTotalCartItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Village Marketplace
          </h1>
          <p className="text-gray-600 text-lg">
            Authentic Himalayan products from local artisans and organic farmers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Cart Summary */}
          {getTotalCartItems() > 0 && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-green-800 font-medium">
                  🛒 Cart: {getTotalCartItems()} items
                </span>
                <Button variant="default" size="sm">
                  View Cart & Checkout
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow duration-200">
              <div className="relative">
                <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-t-lg flex items-center justify-center">
                  <span className="text-6xl">
                    {product.category === 'Local Crafts' ? '🧣' : '🍯'}
                  </span>
                </div>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                    wishlist.has(product.id) 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  ❤️
                </button>
                <Badge 
                  className="absolute top-2 left-2 bg-green-500 text-white"
                  variant="default"
                >
                  {product.category}
                </Badge>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">
                  {product.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-green-600">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-gray-600 text-sm">{product.rating}</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-gray-500 text-sm">by {product.seller}</p>
                  <p className="text-gray-500 text-xs">
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => addToCart(product.id)}
                    disabled={product.stock === 0}
                    className="flex-1"
                    variant="default"
                  >
                    {cart[product.id] ? `In Cart (${cart[product.id]})` : 'Add to Cart'}
                  </Button>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Web3 Escrow Notice */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            🔗 Web3 Escrow Available
          </h3>
          <p className="text-blue-700">
            For enhanced transparency and security, select purchases can use our blockchain escrow system 
            powered by smart contracts on Polygon. This ensures secure transactions with automated 
            dispute resolution.
          </p>
        </div>

        {/* Seller Information */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Our Village Sellers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from(new Set(products.map(p => p.seller))).map(seller => (
              <div key={seller} className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  🏪
                </div>
                <h4 className="font-medium text-gray-800">{seller}</h4>
                <p className="text-sm text-gray-600">Verified Seller</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}