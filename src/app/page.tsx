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
  getVillageLeadersData,
  getProjectsData,
} from '@/lib/data/public';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  // Fetch all data in parallel
  const [
    homestaysResult,
    productsResult,
    statsResult,
    leadersResult,
    projectsResult,
  ] = await Promise.all([
    getFeaturedHomestaysData(),
    getFeaturedProductsData(),
    getVillageStatsData(),
    getVillageLeadersData(),
    getProjectsData(6),
  ]);

  const featuredHomestays = homestaysResult.data || [];
  const featuredProducts = productsResult.data || [];
  const villageStats = statsResult.data;
  const villageLeaders = leadersResult.data || [];
  const projects = projectsResult.data;

  // Structured Data for SEO (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: 'Damday Village',
    description:
      'A pioneering carbon-neutral, culturally-rich, and technologically progressive model village nestled at 2,100m elevation in the pristine Kumaon Himalayas',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Pithoragarh',
      addressRegion: 'Uttarakhand',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 29.583,
      longitude: 80.218,
      elevation: '2100',
    },
    url: 'https://village-app.captain.damdayvillage.com',
    image: 'https://village-app.captain.damdayvillage.com/village-hero.jpg',
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Carbon Neutral' },
      { '@type': 'LocationFeatureSpecification', name: 'Solar Powered' },
      { '@type': 'LocationFeatureSpecification', name: 'IoT Enabled' },
      { '@type': 'LocationFeatureSpecification', name: 'Homestays' },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Local Marketplace',
      },
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
      <div className="relative min-h-[500px] bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        {/* Background Hero Image */}
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
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            {/* Government Emblem Style Header */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                  <span className="text-3xl font-bold text-blue-900">DV</span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 drop-shadow-2xl">
              <span className="text-amber-300">Damday Village</span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-orange-100 mb-4 drop-shadow-lg">
              स्मार्ट कार्बन-मुक्त ग्राम पंचायत
            </h2>
            <p className="text-lg md:text-xl text-gray-100 mb-6 max-w-3xl mx-auto drop-shadow-md leading-relaxed font-light">
              Smart Carbon-Free Gram Panchayat
            </p>
            <p className="text-base text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              Experience Damday Village in Pithoragarh - a pioneering
              carbon-neutral, culturally-rich, and technologically progressive
              model village nestled at 2,100m elevation in the pristine Kumaon
              Himalayas.
            </p>

            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Link href="/digital-twin">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-blue-900 font-bold shadow-xl"
                >
                  🏔️ Explore Digital Twin
                </Button>
              </Link>
              <Link href="/village-tour">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-900 shadow-xl"
                >
                  🌐 360° Village Tour
                </Button>
              </Link>
              <Link href="/homestays">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-900 shadow-xl"
                >
                  🏠 Browse Homestays
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Village Leadership Section */}
      {villageLeaders.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 py-8 border-b-4 border-orange-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {villageLeaders.map((leader, index) => (
                <div
                  key={leader.id}
                  className={`bg-white rounded-lg shadow-lg p-4 ${
                    index === villageLeaders.length - 1
                      ? 'md:col-span-3'
                      : ''
                  }`}
                >
                  <div
                    className={`flex ${
                      index === villageLeaders.length - 1
                        ? 'flex-col md:flex-row'
                        : 'flex-col'
                    } items-center gap-4`}
                  >
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-blue-500">
                        {leader.photo && leader.photo.startsWith('http') ? (
                          <Image
                            src={leader.photo}
                            alt={leader.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-3xl">👤</span>
                        )}
                      </div>
                    </div>
                    <div
                      className={`flex-1 ${
                        index === villageLeaders.length - 1
                          ? 'text-left'
                          : 'text-center'
                      }`}
                    >
                      <h3 className="text-lg font-bold text-gray-900">
                        {leader.name}
                      </h3>
                      <p className="text-sm text-blue-600 font-semibold">
                        {leader.position}
                      </p>
                      {leader.message && (
                        <p className="mt-2 text-sm text-gray-700 italic">
                          "{leader.message}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="min-h-screen relative bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Compact Statistics and Environmental Data Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            {/* Compact Statistics */}
            {villageStats && (
              <div className="lg:col-span-2 bg-white rounded-xl p-4 shadow-lg border border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                    Live Statistics
                  </h2>
                  <span className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {villageStats.homestays && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border-l-2 border-orange-500">
                      <div>
                        <div className="text-2xl font-bold text-orange-900">
                          {villageStats.homestays.total}
                        </div>
                        <div className="text-xs text-orange-700 font-medium">
                          {villageStats.homestays.label}
                        </div>
                      </div>
                      <div className="text-2xl">🏠</div>
                    </div>
                  )}

                  {villageStats.products && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-l-2 border-green-500">
                      <div>
                        <div className="text-2xl font-bold text-green-900">
                          {villageStats.products.total}
                        </div>
                        <div className="text-xs text-green-700 font-medium">
                          {villageStats.products.label}
                        </div>
                      </div>
                      <div className="text-2xl">🛍️</div>
                    </div>
                  )}

                  {villageStats.bookings && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-2 border-blue-500">
                      <div>
                        <div className="text-2xl font-bold text-blue-900">
                          {villageStats.bookings.total}
                        </div>
                        <div className="text-xs text-blue-700 font-medium">
                          {villageStats.bookings.label}
                        </div>
                      </div>
                      <div className="text-2xl">📅</div>
                    </div>
                  )}

                  {villageStats.users && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border-l-2 border-purple-500">
                      <div>
                        <div className="text-2xl font-bold text-purple-900">
                          {villageStats.users.total}
                        </div>
                        <div className="text-xs text-purple-700 font-medium">
                          {villageStats.users.label}
                        </div>
                      </div>
                      <div className="text-2xl">👥</div>
                    </div>
                  )}

                  {villageStats.reviews && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border-l-2 border-amber-500">
                      <div>
                        <div className="text-2xl font-bold text-amber-900">
                          {villageStats.reviews.total}
                        </div>
                        <div className="text-xs text-amber-700 font-medium">
                          {villageStats.reviews.label}
                        </div>
                        <div className="text-xs text-amber-600">
                          ({villageStats.reviews.avgRating}★)
                        </div>
                      </div>
                      <div className="text-2xl">⭐</div>
                    </div>
                  )}

                  {villageStats.carbonOffset && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border-l-2 border-emerald-500">
                      <div>
                        <div className="text-2xl font-bold text-emerald-900">
                          {villageStats.carbonOffset.total}
                        </div>
                        <div className="text-xs text-emerald-700 font-medium">
                          {villageStats.carbonOffset.label}
                        </div>
                      </div>
                      <div className="text-2xl">🌱</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Compact Environmental Data */}
            <div className="bg-white rounded-xl p-4 shadow-lg border border-green-100">
              <h2 className="text-lg font-bold bg-gradient-to-r from-green-900 to-green-700 bg-clip-text text-transparent mb-3">
                Live Environment
              </h2>
              <Suspense
                fallback={
                  <div className="text-center text-sm text-gray-600">
                    Loading...
                  </div>
                }
              >
                <LiveData />
              </Suspense>
            </div>
          </div>

          {/* Projects Section */}
          {projects && (
            <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-indigo-100 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-900 to-indigo-700 bg-clip-text text-transparent">
                    Village Projects
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Community development initiatives
                  </p>
                </div>
                <Link href="/projects">
                  <Button variant="outline" size="sm">
                    View All →
                  </Button>
                </Link>
              </div>

              <div className="space-y-6">
                {/* Completed Projects */}
                {projects.completed && projects.completed.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-green-700 mb-3 flex items-center gap-2">
                      <span>✅</span> Completed Projects
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projects.completed.map((project: any) => (
                        <div
                          key={project.id}
                          className="border border-green-200 rounded-lg p-4 bg-green-50 hover:shadow-md transition-shadow"
                        >
                          <h4 className="font-bold text-gray-900 mb-1">
                            {project.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {project.description}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-green-700 font-semibold">
                              ₹{(project.currentFunding / 100000).toFixed(1)}L
                              Funded
                            </span>
                            <Badge variant="success">Completed</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* In Progress Projects */}
                {projects.inProgress && projects.inProgress.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-blue-700 mb-3 flex items-center gap-2">
                      <span>🚧</span> In Progress
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projects.inProgress.map((project: any) => (
                        <div
                          key={project.id}
                          className="border border-blue-200 rounded-lg p-4 bg-blue-50 hover:shadow-md transition-shadow"
                        >
                          <h4 className="font-bold text-gray-900 mb-1">
                            {project.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {project.description}
                          </p>
                          <div className="mb-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    (project.currentFunding /
                                      project.fundingGoal) *
                                      100,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-blue-700 font-semibold">
                              ₹{(project.currentFunding / 100000).toFixed(1)}L /
                              ₹{(project.fundingGoal / 100000).toFixed(1)}L
                            </span>
                            <Badge variant="info">In Progress</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upcoming Projects */}
                {projects.upcoming && projects.upcoming.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-orange-700 mb-3 flex items-center gap-2">
                      <span>🔜</span> Upcoming Projects
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projects.upcoming.map((project: any) => (
                        <div
                          key={project.id}
                          className="border border-orange-200 rounded-lg p-4 bg-orange-50 hover:shadow-md transition-shadow"
                        >
                          <h4 className="font-bold text-gray-900 mb-1">
                            {project.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {project.description}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-orange-700 font-semibold">
                              Goal: ₹{(project.fundingGoal / 100000).toFixed(1)}
                              L
                            </span>
                            <Badge variant="warning">Planning</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Featured Homestays */}
          {featuredHomestays.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-orange-100 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-900 to-orange-700 bg-clip-text text-transparent">
                    Featured Homestays
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Experience authentic Himalayan hospitality
                  </p>
                </div>
                <Link href="/homestays">
                  <Button variant="outline" size="sm">
                    View All →
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredHomestays.slice(0, 3).map((homestay: any) => (
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
            <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-green-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-green-900 to-green-700 bg-clip-text text-transparent">
                    Local Marketplace
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Authentic handcrafted products from village artisans
                  </p>
                </div>
                <Link href="/marketplace">
                  <Button variant="outline" size="sm">
                    View All →
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
        </main>
      </div>
    </>
  );
}
