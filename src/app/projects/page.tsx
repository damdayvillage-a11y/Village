import Link from 'next/link';
import { Button } from '@/lib/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Badge } from '@/lib/components/ui/Badge';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Village Projects - Smart Carbon-Free Village',
  description: 'Explore transparent development projects in Damday Village including renewable energy, infrastructure, and community initiatives with real-time progress tracking.',
  openGraph: {
    title: 'Village Projects - Smart Carbon-Free Village',
    description: 'Transparent development projects creating a sustainable future for Damday Village.',
    type: 'website',
  },
};

export default function ProjectsPage() {
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
              <Link href="/projects" className="text-primary-600 font-semibold">
                Projects
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
            Village <span className="text-primary-600">Projects</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-balance">
            Transparent development initiatives building our carbon-neutral future with complete funding visibility and progress tracking.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="default">100% Transparent</Badge>
            <Badge variant="success">Community Driven</Badge>
            <Badge variant="info">Sustainable Impact</Badge>
          </div>
        </div>

        {/* Project Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary-600 mb-2">12</div>
              <div className="text-sm text-gray-600">Active Projects</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-accent-600 mb-2">₹28L</div>
              <div className="text-sm text-gray-600">Total Investment</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary-600 mb-2">8</div>
              <div className="text-sm text-gray-600">Completed Projects</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-accent-600 mb-2">247</div>
              <div className="text-sm text-gray-600">Beneficiaries</div>
            </CardContent>
          </Card>
        </div>

        {/* Active Projects */}
        <div className="mb-16">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-8">Active Projects</h2>
          <div className="space-y-6">
            {/* Solar Microgrid Expansion */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">☀️</span>
                      Solar Microgrid Expansion Phase II
                    </CardTitle>
                    <p className="text-gray-600">Expanding renewable energy coverage to 100% of households</p>
                  </div>
                  <Badge variant="default">In Progress</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Project Details</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li><strong>Budget:</strong> ₹8,50,000</li>
                      <li><strong>Funded by:</strong> Central Govt. + Community</li>
                      <li><strong>Start Date:</strong> Jan 2024</li>
                      <li><strong>Expected Completion:</strong> Dec 2024</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Progress (78%)</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div className="bg-primary-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✅ Site survey completed</li>
                      <li>✅ Equipment procurement</li>
                      <li>🔄 Installation in progress</li>
                      <li>📅 Testing & commissioning</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Impact Metrics</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li><strong>Households covered:</strong> 52/52</li>
                      <li><strong>CO₂ reduction:</strong> 24 tons/year</li>
                      <li><strong>Energy independence:</strong> 100%</li>
                      <li><strong>Jobs created:</strong> 8 local positions</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-3">Recent Updates</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex gap-2">
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Nov 15</span>
                      <span>Battery bank installation completed for households 40-52</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Nov 10</span>
                      <span>Inverter system testing successful, 95% efficiency achieved</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Waste Management System */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">♻️</span>
                      Integrated Waste Management System
                    </CardTitle>
                    <p className="text-gray-600">Zero-waste village initiative with composting and recycling</p>
                  </div>
                  <Badge variant="warning">65% Complete</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Project Details</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li><strong>Budget:</strong> ₹4,20,000</li>
                      <li><strong>Funded by:</strong> State Govt. + NGO</li>
                      <li><strong>Start Date:</strong> Mar 2024</li>
                      <li><strong>Expected Completion:</strong> Feb 2025</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Progress (65%)</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div className="bg-accent-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✅ Composting units installed</li>
                      <li>✅ Segregation training completed</li>
                      <li>🔄 Recycling center construction</li>
                      <li>📅 Biogas plant setup</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Impact Metrics</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li><strong>Waste reduction:</strong> 85%</li>
                      <li><strong>Compost production:</strong> 200kg/month</li>
                      <li><strong>Recycling rate:</strong> 92%</li>
                      <li><strong>Families participating:</strong> 52/52</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Digital Infrastructure */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">📡</span>
                      Smart Village Digital Infrastructure
                    </CardTitle>
                    <p className="text-gray-600">High-speed internet and IoT sensors for monitoring</p>
                  </div>
                  <Badge variant="info">Planning</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Project Details</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li><strong>Budget:</strong> ₹6,80,000</li>
                      <li><strong>Funded by:</strong> Tech Partnership</li>
                      <li><strong>Start Date:</strong> Jan 2025</li>
                      <li><strong>Expected Completion:</strong> Jun 2025</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Progress (15%)</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div className="bg-primary-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✅ Technical assessment done</li>
                      <li>🔄 Vendor selection in progress</li>
                      <li>📅 Infrastructure design</li>
                      <li>📅 Installation & testing</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Expected Impact</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li><strong>Internet speed:</strong> 100 Mbps</li>
                      <li><strong>IoT sensors:</strong> 50+ devices</li>
                      <li><strong>Data coverage:</strong> 100%</li>
                      <li><strong>Digital services:</strong> 15+ platforms</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Completed Projects */}
        <div className="mb-16">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-8">Completed Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">💧</span>
                  Rainwater Harvesting
                </CardTitle>
                <Badge variant="default" className="w-fit">Completed</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Community-wide rainwater collection and storage system
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li><strong>Budget:</strong> ₹3,20,000</li>
                  <li><strong>Completion:</strong> Sep 2024</li>
                  <li><strong>Impact:</strong> 40% water independence</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">🌳</span>
                  Forest Restoration
                </CardTitle>
                <Badge variant="default" className="w-fit">Completed</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Native tree plantation and biodiversity conservation
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li><strong>Budget:</strong> ₹1,80,000</li>
                  <li><strong>Completion:</strong> Aug 2024</li>
                  <li><strong>Impact:</strong> 2,000 trees planted</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">🏠</span>
                  Homestay Certification
                </CardTitle>
                <Badge variant="default" className="w-fit">Completed</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Quality standards and sustainable tourism training
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li><strong>Budget:</strong> ₹95,000</li>
                  <li><strong>Completion:</strong> Jul 2024</li>
                  <li><strong>Impact:</strong> 15 certified homestays</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">📚</span>
                  Digital Literacy Program
                </CardTitle>
                <Badge variant="default" className="w-fit">Completed</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Computer and internet skills training for all ages
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li><strong>Budget:</strong> ₹75,000</li>
                  <li><strong>Completion:</strong> Jun 2024</li>
                  <li><strong>Impact:</strong> 180 people trained</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">🚑</span>
                  Healthcare Access
                </CardTitle>
                <Badge variant="default" className="w-fit">Completed</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Telemedicine setup and basic medical equipment
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li><strong>Budget:</strong> ₹2,40,000</li>
                  <li><strong>Completion:</strong> May 2024</li>
                  <li><strong>Impact:</strong> 24/7 medical access</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">🛤️</span>
                  Trail Development
                </CardTitle>
                <Badge variant="default" className="w-fit">Completed</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Eco-friendly trekking trails and signage system
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li><strong>Budget:</strong> ₹1,60,000</li>
                  <li><strong>Completion:</strong> Apr 2024</li>
                  <li><strong>Impact:</strong> 5 km trails developed</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Funding Transparency */}
        <div className="bg-white/70 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-display font-bold text-gray-900 text-center mb-8">Funding Transparency</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Funding Sources</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Central Government Schemes</span>
                  <span className="font-semibold">₹12.5L (45%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">State Government Programs</span>
                  <span className="font-semibold">₹8.2L (29%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">NGO Partnerships</span>
                  <span className="font-semibold">₹4.8L (17%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Community Contribution</span>
                  <span className="font-semibold">₹2.5L (9%)</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Expenditure Categories</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Infrastructure Development</span>
                  <span className="font-semibold">₹18.2L (65%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Capacity Building</span>
                  <span className="font-semibold">₹5.6L (20%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Technology Integration</span>
                  <span className="font-semibold">₹3.1L (11%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Administrative Costs</span>
                  <span className="font-semibold">₹1.1L (4%)</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Button variant="outline">
              <Link href="#" className="inline-flex items-center gap-2">
                <span>📊</span>
                Download Full Financial Report
              </Link>
            </Button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-primary-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-display font-bold mb-4">Support Our Projects</h2>
          <p className="text-xl mb-8 opacity-90">
            Join us in building a sustainable future for mountain communities
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary">
              <Link href="/contact">Partner With Us</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link href="/dashboard">Real-time Data</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link href="/book-homestay">Visit & Contribute</Link>
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