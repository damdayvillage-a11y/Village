import Link from 'next/link';
import { Button } from '@/lib/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Badge } from '@/lib/components/ui/Badge';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Booking Hub - Smart Carbon-Free Village',
  description: 'Book your sustainable homestay experience in Damday Village with transparent pricing, authentic accommodations, and carbon-neutral stays.',
  openGraph: {
    title: 'Booking Hub - Smart Carbon-Free Village',
    description: 'Book authentic, sustainable homestays in the Himalayas.',
    type: 'website',
  },
};

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6">
            Booking <span className="text-primary-600">Hub</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-balance">
            Experience authentic Himalayan hospitality in our sustainable homestays while contributing to village development.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="default">Carbon Neutral Stays</Badge>
            <Badge variant="info">Authentic Experiences</Badge>
            <Badge variant="success">Community Benefit</Badge>
          </div>
        </div>

        {/* Quick Booking CTA */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-2xl p-12 mb-16 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">Ready to Book?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start your sustainable mountain adventure today
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
            <Link href="/book-homestay">Book Your Homestay Now</Link>
          </Button>
        </div>

        {/* Why Book With Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-display font-bold text-gray-900 text-center mb-12">Why Book With Damday Village?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">🌱</span>
                </div>
                <CardTitle className="text-primary-600">100% Sustainable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Every stay is carbon-neutral with renewable energy, organic food, and zero-waste practices. Your visit contributes to environmental conservation.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-accent-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">🏔️</span>
                </div>
                <CardTitle className="text-accent-600">Authentic Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Live with local families, learn traditional skills, taste authentic Kumaoni cuisine, and participate in village life and cultural activities.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">🤝</span>
                </div>
                <CardTitle className="text-primary-600">Community Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Your booking directly supports local families, funds village development projects, and helps preserve mountain culture and traditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Accommodation Types */}
        <div className="mb-16">
          <h2 className="text-3xl font-display font-bold text-gray-900 text-center mb-12">Accommodation Options</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🏠</span>
                  Traditional Homestays
                </CardTitle>
                <Badge variant="default" className="w-fit">Most Popular</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Stay with local families in traditional Kumaoni houses with modern sustainable amenities.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li>✓ Private rooms with mountain views</li>
                  <li>✓ Shared family meals with organic ingredients</li>
                  <li>✓ Cultural activities and local tours</li>
                  <li>✓ Solar-powered lighting and heating</li>
                </ul>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-primary-600">From ₹1,200/night</span>
                  <Button size="sm">
                    <Link href="/book-homestay?type=homestay">Book Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🏕️</span>
                  Eco Camping
                </CardTitle>
                <Badge variant="warning" className="w-fit">Adventure</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Sustainable camping experience with guided nature activities and minimal environmental impact.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li>✓ Furnished eco-tents with bedding</li>
                  <li>✓ Shared sustainable facilities</li>
                  <li>✓ Guided trekking and nature walks</li>
                  <li>✓ Campfire storytelling sessions</li>
                </ul>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-accent-600">From ₹800/night</span>
                  <Button size="sm" variant="outline">
                    <Link href="/book-homestay?type=camping">Book Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Experience Packages */}
        <div className="mb-16">
          <h2 className="text-3xl font-display font-bold text-gray-900 text-center mb-12">Experience Packages</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cultural Immersion</CardTitle>
                <Badge variant="info">3 Days / 2 Nights</Badge>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>• Traditional craft workshops</li>
                  <li>• Local festival participation</li>
                  <li>• Cooking classes with families</li>
                  <li>• Village history tours</li>
                </ul>
                <div className="text-lg font-semibold text-primary-600">₹4,500/person</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nature & Trekking</CardTitle>
                <Badge variant="info">4 Days / 3 Nights</Badge>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>• Guided Himalayan treks</li>
                  <li>• Bird watching sessions</li>
                  <li>• Forest conservation activities</li>
                  <li>• Sunrise viewpoint visits</li>
                </ul>
                <div className="text-lg font-semibold text-accent-600">₹6,200/person</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sustainability Learning</CardTitle>
                <Badge variant="info">5 Days / 4 Nights</Badge>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>• Renewable energy workshops</li>
                  <li>• Organic farming training</li>
                  <li>• Waste management systems</li>
                  <li>• Carbon footprint assessment</li>
                </ul>
                <div className="text-lg font-semibold text-primary-600">₹8,500/person</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booking Information */}
        <div className="bg-white/70 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-display font-bold text-gray-900 text-center mb-8">Booking Information</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">What's Included</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Accommodation in certified sustainable homestays</li>
                <li>✓ All meals prepared with organic, local ingredients</li>
                <li>✓ Guided village tours and cultural activities</li>
                <li>✓ Traditional welcome ceremony</li>
                <li>✓ Certificate of carbon-neutral stay</li>
                <li>✓ Access to digital twin and IoT demonstrations</li>
                <li>✓ Village development project visits</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Policies</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li><strong>Advance Booking:</strong> Minimum 7 days required</li>
                <li><strong>Cancellation:</strong> Free until 48 hours before arrival</li>
                <li><strong>Payment:</strong> 50% advance, 50% on arrival</li>
                <li><strong>Group Discounts:</strong> 10% off for 5+ people</li>
                <li><strong>Season Rates:</strong> Peak season rates apply Dec-Jan & Apr-May</li>
                <li><strong>Check-in:</strong> 2:00 PM | Check-out: 11:00 AM</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-display font-bold text-gray-900 text-center mb-12">Guest Experiences</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-lg">👩‍💼</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Priya Sharma</h4>
                    <p className="text-sm text-gray-600">Environmental Researcher</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm italic">
                  "An incredible example of how technology and tradition can coexist. The homestay was comfortable, the food amazing, and I learned so much about sustainable living."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-lg">👨‍💻</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">David Chen</h4>
                    <p className="text-sm text-gray-600">Tech Professional</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm italic">
                  "Perfect digital detox with meaningful impact. The village's smart systems are impressive, and the cultural exchange was enriching. Will definitely return!"
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-lg">👩‍🎓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Maria Rodriguez</h4>
                    <p className="text-sm text-gray-600">Sustainability Student</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm italic">
                  "A transformative experience! Seeing a village achieve carbon neutrality while preserving culture gave me hope and practical knowledge for my research."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-primary-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-display font-bold mb-4">Book Your Sustainable Adventure</h2>
          <p className="text-xl mb-8 opacity-90">
            Join us in creating a model for sustainable mountain tourism
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary">
              <Link href="/book-homestay">Book Homestay</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link href="/village-tour">Virtual Tour First</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link href="/contact">Ask Questions</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}