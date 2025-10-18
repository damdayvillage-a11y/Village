'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Grid, List, MapPin } from 'lucide-react';
import { HomestayCard } from '@/lib/components/public/HomestayCard';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Card } from '@/lib/components/ui/Card';

// Note: For SEO, consider converting to server component with metadata export
// export const metadata = {
//   title: 'Browse Homestays',
//   description: 'Discover authentic Himalayan homestays in Damday Village...',
// };

interface Homestay {
  id: string;
  name: string;
  description: string;
  location: string;
  pricePerNight: number;
  maxGuests: number;
  image: string;
  rating: number;
  reviewCount: number;
  amenities: string[];
}

export default function HomestaysPage() {
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [filteredHomestays, setFilteredHomestays] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'rating'>('rating');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [guestFilter, setGuestFilter] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchHomestays();
  }, []);

  useEffect(() => {
    filterAndSortHomestays();
  }, [homestays, searchTerm, sortBy, priceRange, guestFilter]);

  const fetchHomestays = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/public/homestays');
      if (response.ok) {
        const data = await response.json();
        setHomestays(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching homestays:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortHomestays = () => {
    let filtered = [...homestays];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(h =>
      h.pricePerNight >= priceRange.min && h.pricePerNight <= priceRange.max
    );

    // Guest capacity filter
    filtered = filtered.filter(h => h.maxGuests >= guestFilter);

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'price-low') return a.pricePerNight - b.pricePerNight;
      if (sortBy === 'price-high') return b.pricePerNight - a.pricePerNight;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

    setFilteredHomestays(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading homestays...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover Homestays</h1>
          <p className="text-gray-600">
            Experience authentic Himalayan hospitality in Damday Village
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by name, location, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <Card className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (₹/night)
                  </label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                      placeholder="Min"
                      className="w-24"
                    />
                    <span>-</span>
                    <Input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 10000 })}
                      placeholder="Max"
                      className="w-24"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Guests
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={guestFilter}
                    onChange={(e) => setGuestFilter(parseInt(e.target.value) || 1)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Reset Filters */}
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSortBy('rating');
                    setPriceRange({ min: 0, max: 10000 });
                    setGuestFilter(1);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            {filteredHomestays.length} {filteredHomestays.length === 1 ? 'homestay' : 'homestays'} found
          </p>
        </div>

        {/* Homestays Grid/List */}
        {filteredHomestays.length === 0 ? (
          <Card className="p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No homestays found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search terms
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setSearchTerm('');
                setSortBy('rating');
                setPriceRange({ min: 0, max: 10000 });
                setGuestFilter(1);
              }}
            >
              Reset All Filters
            </Button>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredHomestays.map((homestay) => (
              <HomestayCard
                key={homestay.id}
                id={homestay.id}
                name={homestay.name}
                description={homestay.description}
                location={homestay.location}
                pricePerNight={homestay.pricePerNight}
                maxGuests={homestay.maxGuests}
                image={homestay.image}
                rating={homestay.rating}
                reviewCount={homestay.reviewCount}
                amenities={homestay.amenities}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
