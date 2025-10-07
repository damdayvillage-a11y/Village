import Link from 'next/link';
import { Button } from '@/lib/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Badge } from '@/lib/components/ui/Badge';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-display font-bold text-primary-900">
                Damday Village
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/digital-twin" className="text-gray-700 hover:text-primary-600">
                Digital Twin
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-primary-600">
                Dashboard
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-primary-600">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary-600">
                Contact
              </Link>
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
            Experience Damday Village in Pithoragarh - a carbon-neutral, 
            culturally-rich, and technologically progressive model village 
            nestled in the beautiful Himalayas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/digital-twin">
              <Button variant="primary" size="lg">
                🏔️ Explore Digital Twin
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              🏠 Book Homestay
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="card text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">3D Digital Twin</h3>
            <p className="text-gray-600">
              Explore the village through immersive 3D visualization and AR experiences.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Carbon Neutral</h3>
            <p className="text-gray-600">
              Powered by solar energy with real-time monitoring of environmental impact.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">IoT Connected</h3>
            <p className="text-gray-600">
              Smart sensors monitoring air quality, energy usage, and environmental conditions.
            </p>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-8">
            Coming Soon
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/80 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-primary-600 mb-2">Homestay Booking</h4>
              <p className="text-sm text-gray-600">Reserve authentic village accommodations</p>
            </div>
            <div className="bg-white/80 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-accent-600 mb-2">Local Marketplace</h4>
              <p className="text-sm text-gray-600">Support local artisans and farmers</p>
            </div>
            <div className="bg-white/80 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-primary-600 mb-2">AR Guided Tours</h4>
              <p className="text-sm text-gray-600">Interactive cultural experiences</p>
            </div>
            <div className="bg-white/80 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-accent-600 mb-2">Community DAO</h4>
              <p className="text-sm text-gray-600">Transparent governance & funding</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Smart Carbon-Free Village</h3>
            <p className="text-gray-400 mb-4">
              Damday Village, Gangolihat, Pithoragarh, Uttarakhand, India
            </p>
            <p className="text-sm text-gray-500">
              Building a sustainable future through technology and community
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}