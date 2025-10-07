import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { Button } from '@/lib/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Badge } from '@/lib/components/ui/Badge';
import { LiveData } from '@/lib/components/ui/LiveData';
import { AuthNavigation } from '@/lib/components/ui/AuthNavigation';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      {/* Enhanced Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-primary-900">
                  Damday Village
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Smart Carbon-Free Model</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/about" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                About
              </Link>
              <Link href="/digital-twin" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Digital Twin
              </Link>
              <Link href="/book-homestay" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Stay
              </Link>
              <Link href="/marketplace" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Shop
              </Link>
              <Link href="/projects" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Projects
              </Link>
              <AuthNavigation />
              <Link href="/village-tour" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                Explore
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button className="text-gray-700 hover:text-primary-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

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
            <Link href="/book-homestay">
              <Button variant="outline" size="lg">
                🏠 Book Homestay
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid with Enhanced Visuals */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">3D Digital Twin</h3>
            <p className="text-gray-600 leading-relaxed">
              Explore Damday Village through immersive 3D visualization featuring authentic Himalayan architecture and real-time environmental data.
            </p>
            <Badge className="mt-3 bg-primary-50 text-primary-700 border border-primary-200">
              Real-time Data
            </Badge>
          </Card>

          <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">100% Carbon Neutral</h3>
            <p className="text-gray-600 leading-relaxed">
              Powered entirely by solar energy with 24/7 monitoring of environmental impact and carbon footprint reduction.
            </p>
            <Badge className="mt-3 bg-green-50 text-green-700 border border-green-200">
              -2.5 tons CO₂/year
            </Badge>
          </Card>

          <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Smart IoT Network</h3>
            <p className="text-gray-600 leading-relaxed">
              Advanced sensor network monitoring air quality, energy usage, weather conditions, and microgrid performance.
            </p>
            <Badge className="mt-3 bg-blue-50 text-blue-700 border border-blue-200">
              15 Active Sensors
            </Badge>
          </Card>
        </div>

        {/* Available Features & Services */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
            Available Services
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Explore our range of sustainable tourism and community development services
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-green-700 mb-2">Homestay Booking</h4>
              <p className="text-sm text-green-600 mb-3">Authentic village accommodations with local families</p>
              <Badge className="bg-green-100 text-green-700 border border-green-300">
                ₹2,500-3,500/night
              </Badge>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h4 className="font-semibold text-orange-700 mb-2">Local Marketplace</h4>
              <p className="text-sm text-orange-600 mb-3">Handcrafted products from village artisans</p>
              <Badge className="bg-orange-100 text-orange-700 border border-orange-300">
                25+ Products
              </Badge>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-purple-700 mb-2">AR Cultural Tours</h4>
              <p className="text-sm text-purple-600 mb-3">Interactive 360° cultural experiences</p>
              <Badge className="bg-purple-100 text-purple-700 border border-purple-300">
                5 Tour Routes
              </Badge>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-blue-700 mb-2">Community Projects</h4>
              <p className="text-sm text-blue-600 mb-3">Transparent development initiatives</p>
              <Badge className="bg-blue-100 text-blue-700 border border-blue-300">
                8 Active Projects
              </Badge>
            </Card>
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Village Info */}
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Damday Village</h3>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                A pioneering carbon-neutral model village in the Kumaon Himalayas, 
                showcasing sustainable living, traditional culture, and modern technology 
                in perfect harmony.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Gangolihat, Pithoragarh, Uttarakhand 262524, India
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Elevation: 2,100m | Population: 450
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/digital-twin" className="hover:text-white transition-colors">3D Digital Twin</Link></li>
                <li><Link href="/village-tour" className="hover:text-white transition-colors">360° Village Tour</Link></li>
                <li><Link href="/book-homestay" className="hover:text-white transition-colors">Homestay Booking</Link></li>
                <li><Link href="/marketplace" className="hover:text-white transition-colors">Local Marketplace</Link></li>
                <li><Link href="/projects" className="hover:text-white transition-colors">Community Projects</Link></li>
              </ul>
            </div>
            
            {/* Sustainability Stats */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Impact</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Solar Energy</span>
                  <span className="text-green-400 font-medium">45kW</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">CO₂ Saved</span>
                  <span className="text-green-400 font-medium">2.5t/year</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Trees Planted</span>
                  <span className="text-green-400 font-medium">1,200+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Water Saved</span>
                  <span className="text-blue-400 font-medium">50,000L</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Damday Village. Building a sustainable future through technology and community.
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <Badge className="bg-gray-800 text-gray-400 border border-gray-700">
                ISO 14001 Certified
              </Badge>
              <Badge className="bg-gray-800 text-gray-400 border border-gray-700">
                UN SDG Partner
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}