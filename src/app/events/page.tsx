import Link from 'next/link';
import { Button } from '@/lib/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Badge } from '@/lib/components/ui/Badge';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Village Events & Festivals - Smart Carbon-Free Village',
  description: 'Join authentic cultural festivals, sustainability workshops, and community events in Damday Village. Experience traditional Kumaoni celebrations and learning opportunities.',
  openGraph: {
    title: 'Village Events & Festivals - Smart Carbon-Free Village',
    description: 'Experience authentic mountain culture and sustainability events in the Himalayas.',
    type: 'website',
  },
};

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6">
            Village <span className="text-primary-600">Events</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-balance">
            Experience authentic Kumaoni festivals, sustainability workshops, and community celebrations that bring together tradition and innovation.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="default">Cultural Festivals</Badge>
            <Badge variant="info">Workshops</Badge>
            <Badge variant="default">Community Events</Badge>
            <Badge variant="success">Educational Programs</Badge>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mb-16">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-8">Upcoming Events</h2>
          <div className="space-y-6">
            {/* Featured Event */}
            <Card className="border-2 border-primary-200 bg-primary-50/50">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default">Featured</Badge>
                      <Badge variant="warning">Cultural Festival</Badge>
                    </div>
                    <CardTitle className="text-2xl">Makar Sankranti & Winter Harvest Festival</CardTitle>
                    <p className="text-gray-600">Celebrate the winter solstice with traditional festivities, local delicacies, and cultural performances</p>
                  </div>
                  <div className="text-center md:text-right">
                    <div className="text-3xl font-bold text-primary-600">JAN</div>
                    <div className="text-2xl font-bold text-gray-900">14-15</div>
                    <div className="text-sm text-gray-600">2025</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Event Highlights</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>🪔 Traditional kite flying ceremony</li>
                      <li>🍯 Til (sesame) and jaggery treats</li>
                      <li>🎵 Folk music and dance performances</li>
                      <li>🏔️ Sacred fire rituals at sunrise</li>
                      <li>🎨 Traditional craft exhibitions</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Schedule</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li><strong>Jan 14:</strong> Pre-festival preparations</li>
                      <li><strong>6:00 AM:</strong> Sacred sunrise ceremony</li>
                      <li><strong>10:00 AM:</strong> Community feast preparation</li>
                      <li><strong>2:00 PM:</strong> Cultural performances</li>
                      <li><strong>6:00 PM:</strong> Evening celebration</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Participation</h4>
                    <ul className="text-sm text-gray-600 space-y-1 mb-4">
                      <li><strong>Duration:</strong> 2 days</li>
                      <li><strong>Cost:</strong> ₹500/person (includes meals)</li>
                      <li><strong>Registration:</strong> Required by Jan 10</li>
                      <li><strong>Accommodation:</strong> Homestays available</li>
                    </ul>
                    <Button size="sm" className="w-full">
                      <Link href="/contact?event=makar-sankranti">Register Now</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regular Events */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="info" className="mb-2">Workshop</Badge>
                      <CardTitle>Sustainable Living Workshop</CardTitle>
                      <p className="text-sm text-gray-600">Learn practical skills for eco-friendly mountain living</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent-600">DEC</div>
                      <div className="text-xl font-bold text-gray-900">28</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <strong className="text-sm">Topics:</strong>
                      <p className="text-sm text-gray-600">Solar energy basics, composting, rainwater harvesting, organic gardening</p>
                    </div>
                    <div>
                      <strong className="text-sm">Duration:</strong>
                      <span className="text-sm text-gray-600 ml-1">9 AM - 4 PM</span>
                    </div>
                    <div>
                      <strong className="text-sm">Fee:</strong>
                      <span className="text-sm text-gray-600 ml-1">₹300 (includes lunch)</span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-3">
                      <Link href="/contact?event=sustainability-workshop">Join Workshop</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="default" className="mb-2">Community</Badge>
                      <CardTitle>New Year Resolution: Carbon Neutral 2025</CardTitle>
                      <p className="text-sm text-gray-600">Community pledge and action planning session</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary-600">JAN</div>
                      <div className="text-xl font-bold text-gray-900">1</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <strong className="text-sm">Activities:</strong>
                      <p className="text-sm text-gray-600">Goal setting, project planning, commitment ceremony</p>
                    </div>
                    <div>
                      <strong className="text-sm">Duration:</strong>
                      <span className="text-sm text-gray-600 ml-1">10 AM - 12 PM</span>
                    </div>
                    <div>
                      <strong className="text-sm">Fee:</strong>
                      <span className="text-sm text-gray-600 ml-1">Free for all</span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-3">
                      <Link href="/contact?event=new-year-pledge">Participate</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Annual Festival Calendar */}
        <div className="mb-16">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-8">Annual Festival Calendar</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🌸</span>
                  Spring Festival (March)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Holi celebrations with organic colors, traditional folk dances, and community feasting.
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Natural color making workshop</li>
                  <li>• Kumaoni folk music concerts</li>
                  <li>• Traditional games and sports</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🌾</span>
                  Harvest Festival (May)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Celebrate the spring harvest with community feasts and thanksgiving ceremonies.
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Traditional grain blessing rituals</li>
                  <li>• Community cooking competitions</li>
                  <li>• Seed exchange fair</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">💧</span>
                  Monsoon Festival (July)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Celebrate the life-giving rains with water conservation awareness and cultural programs.
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Rainwater harvesting demos</li>
                  <li>• Traditional rain songs</li>
                  <li>• Village cleaning drives</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🕯️</span>
                  Diwali Eco-Festival (October)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Sustainable Diwali with solar-powered decorations and eco-friendly celebrations.
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Solar lantern making workshop</li>
                  <li>• Organic sweets preparation</li>
                  <li>• Community rangoli competition</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">❄️</span>
                  Winter Solstice (December)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Mark the longest night with bonfires, storytelling, and planning for the new year.
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Traditional storytelling sessions</li>
                  <li>• Community bonfire gathering</li>
                  <li>• Winter crafts workshop</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🎓</span>
                  Learning Festival (August)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Annual education and skill development festival with workshops and competitions.
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Traditional craft workshops</li>
                  <li>• Digital literacy sessions</li>
                  <li>• Cultural knowledge competitions</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Monthly Workshops */}
        <div className="mb-16">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-8">Regular Workshops & Programs</h2>
          <div className="bg-white/70 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Monthly Workshops</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary-600 pl-4">
                    <h4 className="font-semibold text-primary-600">Sustainable Technology</h4>
                    <p className="text-sm text-gray-600">First Saturday of every month • 10 AM - 2 PM</p>
                    <p className="text-xs text-gray-500">Solar panels, biogas, water systems</p>
                  </div>
                  
                  <div className="border-l-4 border-accent-600 pl-4">
                    <h4 className="font-semibold text-accent-600">Traditional Crafts</h4>
                    <p className="text-sm text-gray-600">Second Saturday of every month • 9 AM - 1 PM</p>
                    <p className="text-xs text-gray-500">Weaving, pottery, wood carving</p>
                  </div>
                  
                  <div className="border-l-4 border-primary-600 pl-4">
                    <h4 className="font-semibold text-primary-600">Organic Farming</h4>
                    <p className="text-sm text-gray-600">Third Saturday of every month • 8 AM - 12 PM</p>
                    <p className="text-xs text-gray-500">Seasonal farming, composting, seed saving</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Special Programs</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-accent-600 pl-4">
                    <h4 className="font-semibold text-accent-600">Research Collaboration Days</h4>
                    <p className="text-sm text-gray-600">Quarterly • Various dates</p>
                    <p className="text-xs text-gray-500">University partnerships, data collection</p>
                  </div>
                  
                  <div className="border-l-4 border-primary-600 pl-4">
                    <h4 className="font-semibold text-primary-600">Youth Leadership Program</h4>
                    <p className="text-sm text-gray-600">Summer months • Jun-Aug</p>
                    <p className="text-xs text-gray-500">Skills development for young villagers</p>
                  </div>
                  
                  <div className="border-l-4 border-accent-600 pl-4">
                    <h4 className="font-semibold text-accent-600">Visitor Experience Days</h4>
                    <p className="text-sm text-gray-600">Every Friday • 10 AM - 4 PM</p>
                    <p className="text-xs text-gray-500">Village tours for groups and researchers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Registration */}
        <div className="text-center bg-primary-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-display font-bold mb-4">Join Our Events</h2>
          <p className="text-xl mb-8 opacity-90">
            Experience authentic mountain culture and learn sustainable living practices
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary">
              <Link href="/contact">Register for Events</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link href="/book-homestay">Plan Your Stay</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link href="/blog">Read Event Stories</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}