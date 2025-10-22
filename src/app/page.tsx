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

      {/* Hero Section with Government-Style Design */}
      <div className="relative min-h-[600px] bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 overflow-hidden">
        {/* Decorative Pattern Overlay - Government Style */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Background Hero Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070"
            alt="Himalayan Village Landscape"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/80 via-blue-900/70 to-blue-950/90" />
        </div>

        {/* Tri-color Accent Border - Indian Flag Inspired */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-white to-green-600 z-20" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Government Emblem Style Header - Enhanced */}
            <div className="mb-8 flex justify-center">
              <div className="relative group">
                {/* Main Emblem */}
                <div className="w-28 h-28 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white ring-4 ring-blue-400/30 transition-all duration-300 group-hover:scale-105">
                  <span className="text-4xl font-bold text-blue-950 tracking-tight">DV</span>
                </div>
                {/* Verification Badge */}
                <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {/* Decorative Ring */}
                <div className="absolute -inset-2 border-2 border-amber-300/20 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Main Title - Government Style Typography */}
            <div className="mb-6 space-y-3">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-2 tracking-tight">
                <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-amber-400 bg-clip-text text-transparent drop-shadow-lg">
                  Damday Village
                </span>
              </h1>
              <div className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500/20 via-white/10 to-green-500/20 rounded-full border border-white/20 backdrop-blur-sm">
                <h2 className="text-2xl md:text-4xl font-semibold text-white drop-shadow-md">
                  स्मार्ट कार्बन-मुक्त ग्राम पंचायत
                </h2>
              </div>
              <p className="text-xl md:text-2xl text-blue-100 font-medium tracking-wide">
                Smart Carbon-Free Gram Panchayat
              </p>
            </div>

            {/* Subtitle with Icon */}
            <div className="max-w-3xl mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-base md:text-lg text-gray-100 leading-relaxed">
                      A pioneering <strong className="text-amber-300">carbon-neutral</strong>, culturally-rich, and <strong className="text-green-300">technologically progressive</strong> model village at <strong className="text-blue-300">2,100m elevation</strong> in the pristine Kumaon Himalayas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call-to-Action Buttons - Enhanced Government Style */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link href="/digital-twin">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-blue-950 font-bold shadow-2xl border-2 border-amber-300 hover:scale-105 transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Explore Digital Twin
                  </span>
                </Button>
              </Link>
              <Link href="/village-tour">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/80 text-white hover:bg-white hover:text-blue-950 shadow-xl backdrop-blur-sm bg-white/5 hover:scale-105 transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    360° Village Tour
                  </span>
                </Button>
              </Link>
              <Link href="/homestays">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-green-400/80 text-green-100 hover:bg-green-500 hover:text-white shadow-xl backdrop-blur-sm bg-green-500/10 hover:scale-105 transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Browse Homestays
                  </span>
                </Button>
              </Link>
            </div>

            {/* Quick Stats Bar - Government Dashboard Style */}
            <div className="flex flex-wrap justify-center gap-6 text-white/90 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="font-medium">100% Solar Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="font-medium">Carbon Neutral Since 2020</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                <span className="font-medium">IoT Enabled Village</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent z-10" />
      </div>

      {/* Village Leadership Section - Enhanced Government Portal Style */}
      {villageLeaders.length > 0 && (
        <div className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-12 border-t-4 border-orange-500">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-full blur-3xl" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-lg mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-white font-bold text-sm uppercase tracking-wider">Village Leadership</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Our <span className="text-orange-600">Distinguished</span> Leaders
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Committed to building a sustainable and prosperous future for Damday Village
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {villageLeaders.map((leader, index) => {
                const isGramPradhan = index === villageLeaders.length - 1;
                return (
                  <div
                    key={leader.id}
                    className={`group ${
                      isGramPradhan
                        ? 'md:col-span-3'
                        : ''
                    }`}
                  >
                    <div
                      className={`bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${
                        isGramPradhan
                          ? 'border-orange-300 hover:border-orange-400'
                          : 'border-blue-200 hover:border-blue-300'
                      }`}
                    >
                      <div className={`flex ${
                        isGramPradhan
                          ? 'flex-col md:flex-row'
                          : 'flex-col'
                      } items-center ${isGramPradhan ? 'md:items-start' : ''} gap-6 p-6`}>
                        {/* Leader Photo */}
                        <div className="relative flex-shrink-0">
                          <div className={`relative ${
                            isGramPradhan ? 'w-32 h-32 md:w-40 md:h-40' : 'w-28 h-28'
                          } rounded-xl overflow-hidden border-4 ${
                            isGramPradhan
                              ? 'border-orange-400 shadow-xl'
                              : 'border-blue-400 shadow-lg'
                          } bg-gradient-to-br from-blue-100 to-blue-200 group-hover:scale-105 transition-transform duration-300`}>
                            {leader.photo && leader.photo.startsWith('http') ? (
                              <Image
                                src={leader.photo}
                                alt={leader.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg className={`${isGramPradhan ? 'w-20 h-20' : 'w-14 h-14'} text-blue-400`} fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                          {/* Rank Badge */}
                          {isGramPradhan && (
                            <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Leader Info */}
                        <div className={`flex-1 ${
                          isGramPradhan ? 'text-left' : 'text-center'
                        }`}>
                          <div className={`${isGramPradhan ? 'space-y-3' : 'space-y-2'}`}>
                            <div>
                              <h3 className={`${
                                isGramPradhan ? 'text-2xl md:text-3xl' : 'text-xl'
                              } font-bold text-gray-900 mb-1`}>
                                {leader.name}
                              </h3>
                              <div className="flex items-center gap-2 justify-center md:justify-start">
                                <div className={`inline-block px-4 py-1.5 rounded-full ${
                                  isGramPradhan
                                    ? 'bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-300'
                                    : 'bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-300'
                                }`}>
                                  <p className={`${
                                    isGramPradhan ? 'text-orange-700' : 'text-blue-700'
                                  } font-semibold text-sm`}>
                                    {leader.position}
                                  </p>
                                </div>
                              </div>
                            </div>
                            {leader.message && (
                              <div className={`${
                                isGramPradhan
                                  ? 'bg-orange-50 border-l-4 border-orange-400'
                                  : 'bg-blue-50 border-l-4 border-blue-400'
                              } p-4 rounded-r-lg`}>
                                <div className="flex gap-3">
                                  <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                                    isGramPradhan ? 'text-orange-500' : 'text-blue-500'
                                  }`} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                  </svg>
                                  <p className="text-gray-700 text-sm leading-relaxed italic">
                                    "{leader.message}"
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
