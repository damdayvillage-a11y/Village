import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { Button } from '@/lib/components/ui/Button';
import { Card, CardContent } from '@/lib/components/ui/Card';
import { Badge } from '@/lib/components/ui/Badge';
import { LiveData } from '@/lib/components/ui/LiveData';
import { HomestayCard } from '@/lib/components/public/HomestayCard';
import { ProductCard } from '@/lib/components/public/ProductCard';
import { StatsCounter } from '@/lib/components/public/StatsCounter';
import {
  getFeaturedHomestaysData,
  getFeaturedProductsData,
  getVillageStatsData,
} from '@/lib/data/public';

export default async function HomePage() {
  // Fetch all data in parallel
  const [homestaysResult, productsResult, statsResult] = await Promise.all([
    getFeaturedHomestaysData(),
    getFeaturedProductsData(),
    getVillageStatsData(),
  ]);

  const featuredHomestays = homestaysResult.data || [];
  const featuredProducts = productsResult.data || [];
  const villageStats = statsResult.data;

  // Structured Data for SEO (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: 'Damday Village',
    description: 'A pioneering carbon-neutral, culturally-rich, and technologically progressive model village nestled at 2,100m elevation in the pristine Kumaon Himalayas',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Pithoragarh',
      addressRegion: 'Uttarakhand',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 29.5830,
      longitude: 80.2180,
      elevation: '2100',
    },
    url: 'https://village-app.captain.damdayvillage.com',
    image: 'https://village-app.captain.damdayvillage.com/village-hero.jpg',
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Carbon Neutral' },
      { '@type': 'LocationFeatureSpecification', name: 'Solar Powered' },
      { '@type': 'LocationFeatureSpecification', name: 'IoT Enabled' },
      { '@type': 'LocationFeatureSpecification', name: 'Homestays' },
      { '@type': 'LocationFeatureSpecification', name: 'Local Marketplace' },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6">
            Welcome to{' '}
            <span className="text-primary-600">Smart Carbon-Free Village</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-balance">
            Experience Damday Village in Pithoragarh - a pioneering carbon-neutral, 
            culturally-rich, and technologically progressive model village 
            nestled at 2,100m elevation in the pristine Kumaon Himalayas.
          </p>
          
          {/* Real-time Village Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
            <div className="flex items-center px-4 py-2 bg-white/80 rounded-full border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-green-700 font-medium">Solar Grid: 45kW Active</span>
            </div>
            <div className="flex items-center px-4 py-2 bg-white/80 rounded-full border border-blue-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-blue-700 font-medium">Air Quality: Excellent (AQI: 18)</span>
            </div>
            <div className="flex items-center px-4 py-2 bg-white/80 rounded-full border border-purple-200">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-purple-700 font-medium">Carbon Neutral: 100%</span>
            </div>
          </div>

          {/* Village Statistics - Real Data */}
          {villageStats && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                Live Village Statistics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {villageStats.homestays && (
                  <StatsCounter
                    end={villageStats.homestays.total}
                    label={villageStats.homestays.label}
                  />
                )}
                {villageStats.products && (
                  <StatsCounter
                    end={villageStats.products.total}
                    label={villageStats.products.label}
                  />
                )}
                {villageStats.bookings && (
                  <StatsCounter
                    end={villageStats.bookings.total}
                    label={villageStats.bookings.label}
                  />
                )}
                {villageStats.users && (
                  <StatsCounter
                    end={villageStats.users.total}
                    label={villageStats.users.label}
                  />
                )}
                {villageStats.reviews && (
                  <StatsCounter
                    end={villageStats.reviews.total}
                    label={villageStats.reviews.label}
                    suffix={` (${villageStats.reviews.avgRating}★)`}
                  />
                )}
                {villageStats.carbonOffset && (
                  <StatsCounter
                    end={villageStats.carbonOffset.total}
                    label={villageStats.carbonOffset.label}
                  />
                )}
              </div>
            </div>
          )}

          {/* Live Environmental Data */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
              Live Environmental Data
            </h2>
            <Suspense fallback={<div className="text-center">Loading live data...</div>}>
              <LiveData />
            </Suspense>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/digital-twin">
              <Button variant="primary" size="lg">
                🏔️ Explore Digital Twin
              </Button>
            </Link>
            <Link href="/village-tour">
              <Button variant="outline" size="lg">
                🌐 360° Village Tour
              </Button>
            </Link>
            <Link href="/homestays">
              <Button variant="outline" size="lg">
                🏠 Browse Homestays
              </Button>
            </Link>
          </div>
        </div>

        {/* Featured Homestays - Real Data */}
        {featuredHomestays.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Homestays</h2>
                <p className="text-gray-600 mt-2">Experience authentic Himalayan hospitality</p>
              </div>
              <Link href="/homestays">
                <Button variant="outline">View All Homestays →</Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredHomestays.slice(0, 6).map((homestay: any) => (
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
          </div>
        )}

        {/* Featured Products - Real Data */}
        {featuredProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Local Marketplace</h2>
                <p className="text-gray-600 mt-2">Authentic handcrafted products from village artisans</p>
              </div>
              <Link href="/marketplace">
                <Button variant="outline">View All Products →</Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product: any) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  stock={product.stock}
                  inStock={product.inStock}
                  image={product.image}
                  category={product.category}
                  locallySourced={product.locallySourced}
                  carbonFootprint={product.carbonFootprint}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
    </>
  );
}