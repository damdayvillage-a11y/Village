import Link from 'next/link';
import { Button } from '@/lib/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Badge } from '@/lib/components/ui/Badge';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Vision - Smart Carbon-Free Village',
  description: 'Discover Damday Village\'s vision for sustainable development, carbon neutrality, and becoming a replicable model for mountain communities worldwide.',
  openGraph: {
    title: 'Our Vision - Smart Carbon-Free Village',
    description: 'Explore our roadmap to carbon neutrality and sustainable mountain development.',
    type: 'website',
  },
};

export default function VisionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-display font-bold text-primary-900">
                Damday Village
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/digital-twin" className="text-gray-700 hover:text-primary-600">
                Digital Twin
              </Link>
              <Link href="/village-tour" className="text-gray-700 hover:text-primary-600">
                360° Tour
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-primary-600">
                Dashboard
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-primary-600">
                About
              </Link>
              <Link href="/vision" className="text-primary-600 font-semibold">
                Vision
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary-600">
                Contact
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6">
            Our <span className="text-primary-600">Vision 2030</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-balance">
            To create a replicable blueprint for carbon-neutral mountain communities that preserve cultural heritage while leading global sustainability innovation.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="success">Net Zero by 2025</Badge>
            <Badge variant="info">100% Renewable</Badge>
            <Badge variant="warning">Zero Waste</Badge>
            <Badge variant="default">Global Model</Badge>
          </div>
        </div>

        {/* Vision Statement */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-2xl p-12 mb-16 text-center">
          <h2 className="text-3xl font-display font-bold mb-6">Our Core Vision</h2>
          <blockquote className="text-xl leading-relaxed italic mb-6">
            "Damday Village will be a living example that traditional mountain communities can thrive as global leaders in sustainability, proving that environmental stewardship and cultural preservation are not just compatible, but synergistic."
          </blockquote>
          <p className="text-lg opacity-90">— Shiwani Devi, Gram Pradhan</p>
        </div>

        {/* Three Pillars */}
        <div className="mb-16">
          <h2 className="text-3xl font-display font-bold text-gray-900 text-center mb-12">Three Pillars of Our Vision</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">🌍</span>
                </div>
                <CardTitle className="text-primary-600">Environmental Leadership</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Achieve complete carbon neutrality while restoring mountain ecosystems and demonstrating renewable energy independence.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Net-zero carbon emissions by 2025</li>
                  <li>• 100% renewable energy systems</li>
                  <li>• Ecosystem restoration programs</li>
                  <li>• Circular economy implementation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-accent-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">🏛️</span>
                </div>
                <CardTitle className="text-accent-600">Cultural Preservation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Safeguard and celebrate our Kumaoni heritage while creating opportunities for cultural expression and intergenerational knowledge transfer.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Traditional knowledge documentation</li>
                  <li>• Youth cultural programs</li>
                  <li>• Artisan skill development</li>
                  <li>• Heritage tourism initiatives</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">🚀</span>
                </div>
                <CardTitle className="text-primary-600">Innovation Hub</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Become a living laboratory for sustainable technology integration, research collaboration, and knowledge sharing.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Smart village technologies</li>
                  <li>• Research partnerships</li>
                  <li>• Innovation incubation</li>
                  <li>• Best practice replication</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Roadmap */}
        <div className="mb-16">
          <h2 className="text-3xl font-display font-bold text-gray-900 text-center mb-12">Implementation Roadmap</h2>
          <div className="space-y-8">
            {/* 2024 */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  2024
                </div>
              </div>
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="text-primary-600">Foundation Phase</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Infrastructure</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>✅ Solar microgrid expansion</li>
                        <li>✅ Waste management systems</li>
                        <li>🔄 Water conservation upgrade</li>
                        <li>🔄 Digital connectivity improvement</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Community</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>✅ Sustainability training programs</li>
                        <li>🔄 Youth engagement initiatives</li>
                        <li>📅 Cultural documentation project</li>
                        <li>📅 Homestay quality certification</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 2025 */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-accent-600 text-white rounded-full flex items-center justify-center font-bold">
                  2025
                </div>
              </div>
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="text-accent-600">Carbon Neutral Achievement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Environmental</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>🎯 Net-zero carbon emissions</li>
                        <li>🎯 100% renewable energy</li>
                        <li>🎯 Forest carbon credits program</li>
                        <li>🎯 Biodiversity restoration</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Economic</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>🎯 Sustainable tourism growth</li>
                        <li>🎯 Local product marketplace</li>
                        <li>🎯 Carbon offset revenue</li>
                        <li>🎯 Research collaboration funding</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 2026-2030 */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                  2030
                </div>
              </div>
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="text-primary-600">Global Model & Replication</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Knowledge Sharing</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>🎯 10 villages adopt our model</li>
                        <li>🎯 International recognition</li>
                        <li>🎯 Policy influence at state level</li>
                        <li>🎯 Academic research publications</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Innovation</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>🎯 AI-powered ecosystem monitoring</li>
                        <li>🎯 Advanced carbon sequestration</li>
                        <li>🎯 Circular economy mastery</li>
                        <li>🎯 Climate resilience leadership</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Success Metrics */}
        <div className="bg-white/70 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-display font-bold text-gray-900 text-center mb-12">Success Metrics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">0</div>
              <div className="text-sm text-gray-600">Carbon Emissions</div>
              <div className="text-xs text-gray-500">Net Zero by 2025</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-600 mb-2">100%</div>
              <div className="text-sm text-gray-600">Renewable Energy</div>
              <div className="text-xs text-gray-500">Solar + Micro-hydro</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-sm text-gray-600">Research Projects</div>
              <div className="text-xs text-gray-500">Universities & NGOs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-600 mb-2">10+</div>
              <div className="text-sm text-gray-600">Villages Inspired</div>
              <div className="text-xs text-gray-500">Replication Network</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-display font-bold mb-4">Join Our Vision</h2>
          <p className="text-xl mb-8 opacity-90">
            Be part of the movement towards sustainable mountain communities
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary">
              <Link href="/projects">View Projects</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link href="/book-homestay">Visit Us</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link href="/contact">Partner With Us</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-lg mb-2">
              Damday Village, Gangolihat, Pithoragarh, Uttarakhand, India
            </p>
            <p className="text-sm text-gray-400">
              Building a sustainable future through technology and community
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}