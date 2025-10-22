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
      
      {/* Hero Section with Government-Style Header Image */}
      <div className="relative min-h-[600px] bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        {/* Background Hero Image - Open Source Himalayan Village */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070"
            alt="Himalayan Village Landscape"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-900/50 to-blue-900/90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Government Emblem Style Header */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                  <span className="text-4xl font-bold text-blue-900">DV</span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 drop-shadow-2xl">
              <span className="text-amber-300">Damday Village</span>
            </h1>
            <h2 className="text-3xl md:text-4xl font-semibold text-orange-100 mb-6 drop-shadow-lg">
              स्मार्ट कार्बन-मुक्त ग्राम पंचायत
            </h2>
            <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-4xl mx-auto drop-shadow-md leading-relaxed font-light">
              Smart Carbon-Free Gram Panchayat
            </p>
            <p className="text-lg text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Experience Damday Village in Pithoragarh - a pioneering carbon-neutral, 
              culturally-rich, and technologically progressive model village 
              nestled at 2,100m elevation in the pristine Kumaon Himalayas.
            </p>
            
            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/digital-twin">
                <Button variant="primary" size="lg" className="bg-amber-500 hover:bg-amber-600 text-blue-900 font-bold shadow-xl">
                  🏔️ Explore Digital Twin
                </Button>
              </Link>
              <Link href="/village-tour">
                <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-blue-900 shadow-xl">
                  🌐 360° Village Tour
                </Button>
              </Link>
              <Link href="/homestays">
                <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-blue-900 shadow-xl">
                  🏠 Browse Homestays
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
    <div className="min-h-screen relative bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content Grid with Vertical Widgets */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left Sidebar - Village Statistics Vertical Widget */}
          <div className="lg:col-span-1">
            {villageStats && (
              <div className="sticky top-4 bg-white rounded-2xl p-6 shadow-xl border-2 border-blue-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                    Live Statistics
                  </h2>
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                </div>
                
                <div className="space-y-4">
                  {villageStats.homestays && (
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border-l-4 border-orange-500">
                      <div>
                        <div className="text-3xl font-bold text-orange-900">{villageStats.homestays.total}</div>
                        <div className="text-sm text-orange-700 font-medium">{villageStats.homestays.label}</div>
                      </div>
                      <div className="text-4xl">🏠</div>
                    </div>
                  )}
                  
                  {villageStats.products && (
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-l-4 border-green-500">
                      <div>
                        <div className="text-3xl font-bold text-green-900">{villageStats.products.total}</div>
                        <div className="text-sm text-green-700 font-medium">{villageStats.products.label}</div>
                      </div>
                      <div className="text-4xl">🛍️</div>
                    </div>
                  )}
                  
                  {villageStats.bookings && (
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500">
                      <div>
                        <div className="text-3xl font-bold text-blue-900">{villageStats.bookings.total}</div>
                        <div className="text-sm text-blue-700 font-medium">{villageStats.bookings.label}</div>
                      </div>
                      <div className="text-4xl">📅</div>
                    </div>
                  )}
                  
                  {villageStats.users && (
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-500">
                      <div>
                        <div className="text-3xl font-bold text-purple-900">{villageStats.users.total}</div>
                        <div className="text-sm text-purple-700 font-medium">{villageStats.users.label}</div>
                      </div>
                      <div className="text-4xl">👥</div>
                    </div>
                  )}
                  
                  {villageStats.reviews && (
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border-l-4 border-amber-500">
                      <div>
                        <div className="text-3xl font-bold text-amber-900">{villageStats.reviews.total}</div>
                        <div className="text-sm text-amber-700 font-medium">{villageStats.reviews.label}</div>
                        <div className="text-xs text-amber-600">({villageStats.reviews.avgRating}★)</div>
                      </div>
                      <div className="text-4xl">⭐</div>
                    </div>
                  )}
                  
                  {villageStats.carbonOffset && (
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border-l-4 border-emerald-500">
                      <div>
                        <div className="text-3xl font-bold text-emerald-900">{villageStats.carbonOffset.total}</div>
                        <div className="text-sm text-emerald-700 font-medium">{villageStats.carbonOffset.label}</div>
                      </div>
                      <div className="text-4xl">🌱</div>
                    </div>
                  )}
                </div>
                
                {/* Quick Stats Summary */}
                <div className="mt-6 pt-6 border-t-2 border-gray-200">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <div className="text-xs text-green-600 font-medium">Solar Grid</div>
                      <div className="text-sm font-bold text-green-900">45kW</div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <div className="text-xs text-blue-600 font-medium">Air Quality</div>
                      <div className="text-sm font-bold text-blue-900">AQI 18</div>
                    </div>
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <div className="text-xs text-orange-600 font-medium">Carbon</div>
                      <div className="text-sm font-bold text-orange-900">100%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Environmental Data Vertical Widget */}
            <div className="mt-8 bg-white rounded-2xl p-6 shadow-xl border-2 border-green-100">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-900 to-green-700 bg-clip-text text-transparent mb-6">
                Live Environmental Data
              </h2>
              <Suspense fallback={<div className="text-center text-gray-600">Loading...</div>}>
                <LiveData />
              </Suspense>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">

            {/* Featured Homestays */}
            {featuredHomestays.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-orange-100 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-900 to-orange-700 bg-clip-text text-transparent">Featured Homestays</h2>
                    <p className="text-gray-600 mt-2">Experience authentic Himalayan hospitality</p>
                  </div>
                  <Link href="/homestays">
                    <Button variant="outline" size="sm">View All →</Button>
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredHomestays.slice(0, 4).map((homestay: any) => (
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

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-green-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-900 to-green-700 bg-clip-text text-transparent">Local Marketplace</h2>
                    <p className="text-gray-600 mt-2">Authentic handcrafted products from village artisans</p>
                  </div>
                  <Link href="/marketplace">
                    <Button variant="outline" size="sm">View All →</Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {featuredProducts.slice(0, 4).map((product: any) => (
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
          </div>
        </div>
      </main>
    </div>
    </>
  );
}