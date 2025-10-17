'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Leaf } from 'lucide-react';
import { Card, CardContent } from '@/lib/components/ui/Card';
import { Badge } from '@/lib/components/ui/Badge';
import { Button } from '@/lib/components/ui/Button';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  inStock: boolean;
  image: string;
  category: string;
  locallySourced?: boolean;
  carbonFootprint?: number;
}

export function ProductCard({
  id,
  name,
  description,
  price,
  stock,
  inStock,
  image,
  category,
  locallySourced = false,
  carbonFootprint,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {!inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm">Out of Stock</Badge>
          </div>
        )}
        {locallySourced && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-lg shadow-md flex items-center gap-1">
            <Leaf className="w-3 h-3" />
            <span className="text-xs font-semibold">Local</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <Badge variant="outline" className="mb-2 text-xs">{category}</Badge>
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">{name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>

        {carbonFootprint !== undefined && carbonFootprint !== null && (
          <div className="flex items-center gap-1 text-xs text-green-600 mb-3">
            <Leaf className="w-3 h-3" />
            <span>Carbon: {carbonFootprint} kg CO₂</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <span className="text-2xl font-bold text-primary-600">₹{price}</span>
          </div>
          <Link href={`/marketplace/${id}`}>
            <Button 
              variant={inStock ? "primary" : "outline"} 
              size="sm"
              disabled={!inStock}
            >
              {inStock ? (
                <>
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  View
                </>
              ) : (
                'Sold Out'
              )}
            </Button>
          </Link>
        </div>

        {inStock && stock < 10 && (
          <div className="mt-2 text-xs text-orange-600 text-center">
            Only {stock} left in stock
          </div>
        )}
      </CardContent>
    </Card>
  );
}
