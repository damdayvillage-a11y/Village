import Link from 'next/link';
import { Button } from '@/lib/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Badge } from '@/lib/components/ui/Badge';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Village Blog & Articles - Smart Carbon-Free Village',
  description: 'Read stories, insights, and updates from Damday Village about sustainable living, mountain culture, and community development in the Himalayas.',
  openGraph: {
    title: 'Village Blog & Articles - Smart Carbon-Free Village',
    description: 'Stories and insights from India\'s first carbon-neutral mountain village.',
    type: 'website',
  },
};

export default function BlogPage() {
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
              <Link href="/blog" className="text-primary-600 font-semibold">
                Blog
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
            Village <span className="text-primary-600">Stories</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-balance">
            Discover stories of transformation, sustainability insights, and cultural heritage from India's first carbon-neutral mountain village.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="default">Community Stories</Badge>
            <Badge variant="success">Sustainability</Badge>
            <Badge variant="warning">Culture & Heritage</Badge>
            <Badge variant="info">Innovation</Badge>
          </div>
        </div>

        {/* Featured Article */}
        <div className="mb-16">
          <Card className="overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="h-64 md:h-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                  <span className="text-6xl">🌱</span>
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <Badge variant="default" className="mb-4">Featured Story</Badge>
                <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
                  Our Journey to Carbon Neutrality: A Year of Transformation
                </h2>
                <p className="text-gray-700 mb-6">
                  Twelve months ago, Damday Village embarked on an ambitious mission to become India's first carbon-neutral mountain village. Today, we share the challenges, victories, and lessons learned from this incredible journey of community transformation.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm">👩‍💼</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Shiwani Devi</p>
                      <p className="text-xs text-gray-600">Gram Pradhan • Nov 20, 2024</p>
                    </div>
                  </div>
                  <Button>
                    <Link href="/blog/carbon-neutrality-journey">Read Full Story</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Article Categories */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="default" size="sm">All Articles</Button>
            <Button variant="outline" size="sm">Sustainability</Button>
            <Button variant="outline" size="sm">Community</Button>
            <Button variant="outline" size="sm">Culture</Button>
            <Button variant="outline" size="sm">Technology</Button>
            <Button variant="outline" size="sm">Tourism</Button>
          </div>
        </div>

        {/* Recent Articles */}
        <div className="mb-16">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-8">Recent Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Article 1 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-accent-100 to-primary-100 flex items-center justify-center">
                <span className="text-4xl">⚡</span>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="info">Technology</Badge>
                  <span className="text-xs text-gray-500">Nov 15, 2024</span>
                </div>
                <CardTitle className="text-lg">Smart Grid Revolution in the Mountains</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm mb-4">
                  How our solar microgrid system transformed energy independence and what other villages can learn from our implementation.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center">
                      <span className="text-xs">👨‍🔧</span>
                    </div>
                    <span className="text-xs text-gray-600">Ramesh Singh</span>
                  </div>
                  <Button size="sm" variant="outline">Read More</Button>
                </div>
              </CardContent>
            </Card>

            {/* Article 2 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                <span className="text-4xl">🎨</span>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="warning">Culture</Badge>
                  <span className="text-xs text-gray-500">Nov 10, 2024</span>
                </div>
                <CardTitle className="text-lg">Preserving Kumaoni Crafts in the Digital Age</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm mb-4">
                  Young artisans are using modern tools to document and preserve traditional crafts while creating new market opportunities.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-xs">👩‍🎨</span>
                    </div>
                    <span className="text-xs text-gray-600">Sunita Devi</span>
                  </div>
                  <Button size="sm" variant="outline">Read More</Button>
                </div>
              </CardContent>
            </Card>

            {/* Article 3 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-accent-100 to-primary-100 flex items-center justify-center">
                <span className="text-4xl">🌍</span>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="success">Sustainability</Badge>
                  <span className="text-xs text-gray-500">Nov 5, 2024</span>
                </div>
                <CardTitle className="text-lg">Zero Waste Village: Our Circular Economy Model</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm mb-4">
                  From waste segregation to compost production, discover how we achieved 95% waste diversion from landfills.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center">
                      <span className="text-xs">🌱</span>
                    </div>
                    <span className="text-xs text-gray-600">Village Team</span>
                  </div>
                  <Button size="sm" variant="outline">Read More</Button>
                </div>
              </CardContent>
            </Card>

            {/* Article 4 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                <span className="text-4xl">🏔️</span>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="default">Tourism</Badge>
                  <span className="text-xs text-gray-500">Oct 28, 2024</span>
                </div>
                <CardTitle className="text-lg">Sustainable Tourism: A Win-Win Model</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm mb-4">
                  How responsible tourism practices are boosting local economy while preserving our natural and cultural heritage.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-xs">🏠</span>
                    </div>
                    <span className="text-xs text-gray-600">Maya Sharma</span>
                  </div>
                  <Button size="sm" variant="outline">Read More</Button>
                </div>
              </CardContent>
            </Card>

            {/* Article 5 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-accent-100 to-primary-100 flex items-center justify-center">
                <span className="text-4xl">📚</span>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="default">Community</Badge>
                  <span className="text-xs text-gray-500">Oct 20, 2024</span>
                </div>
                <CardTitle className="text-lg">Education Revolution in Remote Mountains</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm mb-4">
                  Digital connectivity brings world-class education to village children while preserving local knowledge systems.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center">
                      <span className="text-xs">👩‍🏫</span>
                    </div>
                    <span className="text-xs text-gray-600">Dr. Meera Pant</span>
                  </div>
                  <Button size="sm" variant="outline">Read More</Button>
                </div>
              </CardContent>
            </Card>

            {/* Article 6 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                <span className="text-4xl">🤝</span>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="default">Community</Badge>
                  <span className="text-xs text-gray-500">Oct 15, 2024</span>
                </div>
                <CardTitle className="text-lg">Women Leading Change in the Mountains</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm mb-4">
                  Meet the women entrepreneurs who are driving innovation and economic growth while preserving traditional values.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-xs">👩‍💼</span>
                    </div>
                    <span className="text-xs text-gray-600">Village Women</span>
                  </div>
                  <Button size="sm" variant="outline">Read More</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">Load More Articles</Button>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-white/70 rounded-2xl p-8 mb-16 text-center">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest stories, sustainability insights, and village updates delivered to your inbox monthly.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <Button>Subscribe</Button>
          </div>
        </div>

        {/* Contribute */}
        <div className="text-center bg-primary-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-display font-bold mb-4">Share Your Story</h2>
          <p className="text-xl mb-8 opacity-90">
            Have you visited Damday Village? We'd love to feature your experience and insights.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary">
              <Link href="/contact">Submit Your Story</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link href="/book-homestay">Visit Us</Link>
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