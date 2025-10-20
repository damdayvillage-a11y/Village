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
import { ThreeJSBackground } from '@/components/animations/ThreeJSBackground';
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
      
      {/* Three.js Animated Background */}
      <ThreeJSBackground 
        preset="government" 
        particleCount={1200}
        animationSpeed={0.8}
        enableInteraction={true}
      />
      
      {/* Professional gradient overlay for better text readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-900/40 via-transparent to-blue-900/60 pointer-events-none -z-10" aria-hidden="true" />
      
    <div className="min-h-screen relative">
      {/* Hero Section with Government-inspired styling */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 drop-shadow-2xl animate-fade-in">
            Welcome to{' '}
            <span className="text-amber-300 animate-pulse-slow">Damday Village</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-orange-200 mb-4 drop-shadow-lg">
            Smart Carbon-Free Gram Panchayat
          </h2>
          <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto text-balance drop-shadow-md leading-relaxed">
            Experience Damday Village in Pithoragarh - a pioneering carbon-neutral, 
            culturally-rich, and technologically progressive model village 
            nestled at 2,100m elevation in the pristine Kumaon Himalayas.
          </p>
          
          {/* Real-time Village Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm animate-slide-up">
            <div className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500/90 to-green-600/90 backdrop-blur-sm rounded-full border-2 border-green-300/50 shadow-lg hover:scale-105 transition-transform">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              <span className="text-white font-semibold">Solar Grid: 45kW Active</span>
            </div>
            <div className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600/90 to-blue-700/90 backdrop-blur-sm rounded-full border-2 border-blue-300/50 shadow-lg hover:scale-105 transition-transform">
              <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
              <span className="text-white font-semibold">Air Quality: Excellent (AQI: 18)</span>
            </div>
            <div className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500/90 to-orange-600/90 backdrop-blur-sm rounded-full border-2 border-orange-300/50 shadow-lg hover:scale-105 transition-transform">
              <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
              <span className="text-white font-semibold">Carbon Neutral: 100%</span>
            </div>
          </div>

          {/* Village Statistics - Real Data */}
          {villageStats && (
            <div className="mb-12 bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border-2 border-blue-200/50">
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent mb-8">
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
          <div className="mb-12 bg-gradient-to-br from-white/95 to-green-50/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border-2 border-green-200/50">
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-green-900 to-green-700 bg-clip-text text-transparent mb-6">
              Live Environmental Data
            </h2>
            <Suspense fallback={<div className="text-center text-gray-600">Loading live data...</div>}>
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
          <div className="mt-20 bg-gradient-to-br from-white/95 to-orange-50/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border-2 border-orange-200/50">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-900 to-orange-700 bg-clip-text text-transparent">Featured Homestays</h2>
                <p className="text-gray-700 mt-2 font-medium">Experience authentic Himalayan hospitality</p>
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
          <div className="mt-20 bg-gradient-to-br from-white/95 to-green-50/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border-2 border-green-200/50">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-900 to-green-700 bg-clip-text text-transparent">Local Marketplace</h2>
                <p className="text-gray-700 mt-2 font-medium">Authentic handcrafted products from village artisans</p>
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