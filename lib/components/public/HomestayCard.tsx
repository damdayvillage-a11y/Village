'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Users } from 'lucide-react';
import { Card, CardContent } from '@/lib/components/ui/Card';
import { Badge } from '@/lib/components/ui/Badge';
import { Button } from '@/lib/components/ui/Button';

interface HomestayCardProps {
  id: string;
  name: string;
  description: string;
  location: string;
  pricePerNight: number;
  maxGuests: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  amenities?: string[];
}

export function HomestayCard({
  id,
  name,
  description,
  location,
  pricePerNight,
  maxGuests,
  image,
  rating = 0,
  reviewCount = 0,
  amenities = [],
}: HomestayCardProps) {
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
        {rating > 0 && (
          <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg shadow-md flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-sm">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">{name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <MapPin className="w-4 h-4" />
          <span className="line-clamp-1">{location}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Users className="w-4 h-4" />
          <span>Up to {maxGuests} guests</span>
        </div>

        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="default" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {amenities.length > 3 && (
              <Badge variant="default" className="text-xs">
                +{amenities.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <span className="text-2xl font-bold text-primary-600">₹{pricePerNight}</span>
            <span className="text-sm text-gray-500"> / night</span>
          </div>
          <Link href={`/homestays/${id}`}>
            <Button variant="primary" size="sm">
              View Details
            </Button>
          </Link>
        </div>

        {reviewCount > 0 && (
          <div className="mt-2 text-xs text-gray-500 text-center">
            {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
