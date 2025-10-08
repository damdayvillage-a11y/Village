import Link from 'next/link';
import { Button } from '@/lib/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Badge } from '@/lib/components/ui/Badge';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Damday Village - Smart Carbon-Free Village',
  description: 'Learn about Damday Village, a pioneering carbon-neutral model village in Pithoragarh, Uttarakhand, showcasing sustainable living and traditional Himalayan culture.',
  openGraph: {
    title: 'About Damday Village - Smart Carbon-Free Village',
    description: 'Discover the story, culture, and mission of Damday Village, a sustainable model community in the Himalayas.',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6">
            About <span className="text-primary-600">Damday Village</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-balance">
            Nestled in the pristine Himalayas of Pithoragarh, Uttarakhand, Damday Village is a pioneering model of sustainable living that harmoniously blends traditional culture with cutting-edge technology.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="success">Carbon Neutral</Badge>
            <Badge variant="info">100% Renewable Energy</Badge>
            <Badge variant="default">Cultural Heritage</Badge>
            <Badge variant="success">Smart Technology</Badge>
          </div>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="prose prose-lg text-gray-700">
              <p className="mb-4">
                Damday Village represents a vision of sustainable mountain living that respects both ancient wisdom and modern innovation. Located at an altitude of 2,200 meters in the Kumaon region of Uttarakhand, our community has been home to generations of families who have lived in harmony with the Himalayan ecosystem.
              </p>
              <p className="mb-4">
                In 2020, our village embarked on an ambitious journey to become India's first fully carbon-neutral mountain village while preserving our rich cultural heritage. Through community participation and innovative technology integration, we have created a model that other villages can replicate.
              </p>
              <p>
                Today, Damday Village serves as a living laboratory for sustainable development, attracting researchers, students, and conscious travelers from around the world who seek to experience authentic Himalayan culture while contributing to environmental conservation.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🏔️</span>
                  Location & Geography
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>District:</strong> Pithoragarh, Uttarakhand</li>
                  <li><strong>Altitude:</strong> 2,200 meters above sea level</li>
                  <li><strong>Climate:</strong> Temperate mountain climate</li>
                  <li><strong>Population:</strong> 247 residents in 52 households</li>
                  <li><strong>Area:</strong> 15.2 square kilometers</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🌱</span>
                  Sustainability Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li>✅ 100% renewable energy (solar + micro-hydro)</li>
                  <li>✅ Zero waste to landfill policy</li>
                  <li>✅ Organic farming across 85% of agricultural land</li>
                  <li>✅ Rainwater harvesting systems in every home</li>
                  <li>✅ Carbon sequestration through reforestation</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="bg-white/70 rounded-2xl p-8 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Mission & Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our mission is to demonstrate that traditional mountain communities can thrive while leading global efforts in sustainability and cultural preservation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-primary-600 mb-3">🌍 Environmental Stewardship</h3>
              <p className="text-gray-700">
                Protecting and regenerating our mountain ecosystem through science-based conservation practices and community engagement.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-accent-600 mb-3">🏘️ Cultural Preservation</h3>
              <p className="text-gray-700">
                Maintaining our traditional Kumaoni heritage, languages, festivals, and crafts while embracing beneficial innovations.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-primary-600 mb-3">💡 Innovation & Knowledge</h3>
              <p className="text-gray-700">
                Integrating appropriate technology and sharing knowledge to create replicable models for sustainable mountain development.
              </p>
            </div>
          </div>
        </div>

        {/* Leadership */}
        <div className="mb-16">
          <h2 className="text-3xl font-display font-bold text-gray-900 text-center mb-12">Village Leadership</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">👩‍💼</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Shiwani Devi</h3>
                <p className="text-primary-600 font-semibold mb-2">Gram Pradhan</p>
                <p className="text-sm text-gray-600">
                  Leading village governance and sustainable development initiatives with 15+ years of community service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-accent-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">👨‍🌾</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Ramesh Singh</h3>
                <p className="text-accent-600 font-semibold mb-2">Agricultural Coordinator</p>
                <p className="text-sm text-gray-600">
                  Expert in organic farming and traditional seed preservation, leading food security initiatives.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">👩‍🏫</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Dr. Meera Pant</h3>
                <p className="text-primary-600 font-semibold mb-2">Education & Research</p>
                <p className="text-sm text-gray-600">
                  Coordinating research partnerships and educational programs with universities and NGOs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-primary-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-display font-bold mb-4">Experience Damday Village</h2>
          <p className="text-xl mb-8 opacity-90">
            Join us in our journey towards sustainable living and cultural preservation
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/book-homestay">
              <Button size="lg" variant="secondary">Book Your Stay</Button>
            </Link>
            <Link href="/village-tour">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">Take Virtual Tour</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">Get Involved</Button>
            </Link>
          </div>
        </div>
      </main>

    </div>
  );
}