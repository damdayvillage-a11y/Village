import Link from 'next/link';
import { Button } from '@/lib/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Smart Carbon-Free Village',
  description: 'Get in touch with Damday Village for partnerships, research collaboration, homestay bookings, and community engagement opportunities.',
  openGraph: {
    title: 'Contact Us - Smart Carbon-Free Village',
    description: 'Connect with Damday Village for sustainable tourism and partnership opportunities.',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6">
            Get In <span className="text-primary-600">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-balance">
            We welcome partnerships, research collaborations, and visitors who share our vision of sustainable mountain development.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select a topic</option>
                      <option value="homestay">Homestay Booking</option>
                      <option value="research">Research Collaboration</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="media">Media Inquiry</option>
                      <option value="volunteer">Volunteer Program</option>
                      <option value="education">Educational Visit</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      placeholder="Tell us about your interest in Damday Village..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    ></textarea>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📍</span>
                  Village Office
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                    <p className="text-gray-700">
                      Damday Village<br />
                      Post Office: Gangolihat<br />
                      Tehsil: Gangolihat<br />
                      District: Pithoragarh<br />
                      Uttarakhand - 262524, India
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Coordinates</h4>
                    <p className="text-gray-700">29.8742° N, 80.2431° E</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">👩‍💼</span>
                  Gram Pradhan Office
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Shiwani Devi</h4>
                    <p className="text-primary-600 font-medium mb-2">Gram Pradhan</p>
                    <div className="space-y-1 text-gray-700">
                      <p>📞 +91-9412-345-678</p>
                      <p>📧 pradhan@damdayvillage.org</p>
                      <p>🕐 Office Hours: Mon-Fri, 9 AM - 5 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🏠</span>
                  Tourism & Homestays
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Booking Coordinator</h4>
                    <div className="space-y-1 text-gray-700">
                      <p>📞 +91-9876-543-210</p>
                      <p>📧 stay@damdayvillage.org</p>
                      <p>🕐 Available: 8 AM - 8 PM daily</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button className="w-full">
                      <Link href="/book-homestay">Book Homestay</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🔬</span>
                  Research & Partnerships
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Dr. Meera Pant</h4>
                    <p className="text-accent-600 font-medium mb-2">Education & Research Coordinator</p>
                    <div className="space-y-1 text-gray-700">
                      <p>📞 +91-9123-456-789</p>
                      <p>📧 research@damdayvillage.org</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white/70 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-display font-bold text-gray-900 text-center mb-8">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" size="lg" className="h-auto p-6 flex flex-col items-center gap-2">
              <Link href="/book-homestay">
                <span className="text-2xl mb-2">🏠</span>
                <span>Book Homestay</span>
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="h-auto p-6 flex flex-col items-center gap-2">
              <Link href="/village-tour">
                <span className="text-2xl mb-2">🎥</span>
                <span>Virtual Tour</span>
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="h-auto p-6 flex flex-col items-center gap-2">
              <Link href="/projects">
                <span className="text-2xl mb-2">📊</span>
                <span>View Projects</span>
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="h-auto p-6 flex flex-col items-center gap-2">
              <Link href="/marketplace">
                <span className="text-2xl mb-2">🛍️</span>
                <span>Local Products</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-red-800 mb-4">Emergency Contact</h3>
          <p className="text-red-700 mb-4">
            For urgent matters or emergencies while visiting Damday Village:
          </p>
          <div className="space-y-2 text-red-800 font-semibold">
            <p>🚨 Emergency Helpline: +91-9999-111-222</p>
            <p>🏥 Nearest Medical Center: Gangolihat CHC (8 km)</p>
          </div>
        </div>
      </main>
    </div>
  );
}