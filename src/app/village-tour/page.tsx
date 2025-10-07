import React from 'react'
import PanoramaViewer, { damdayVillageHotspots } from '@/lib/components/ar/PanoramaViewer'
import { Button } from '@/lib/components/ui/Button'
import { Card } from '@/lib/components/ui/Card'
import { Badge } from '@/lib/components/ui/Badge'

export default function VillageTourPage() {
  // Sample 360 image URL (fallback to gradient if image doesn't exist)
  const panoramaImageUrl = '/images/damday-village-360.jpg'

  const handleHotspotClick = (hotspot: any) => {
    console.log('Hotspot clicked:', hotspot)
    // Here you could navigate to specific village sections or show more details
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-slate-100">
      {/* Header */}
      <div className="container mx-auto px-4 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              360° Village Tour
            </h1>
            <p className="text-lg text-slate-600">
              Immerse yourself in the beauty of Damday Village through our interactive 360° experience
            </p>
          </div>
          <div className="hidden md:flex space-x-3">
            <Button variant="outline">
              ← Back to Home
            </Button>
            <Button>
              Book Your Visit
            </Button>
          </div>
        </div>

        {/* Tour Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">5</div>
            <div className="text-sm text-slate-600">Interactive Hotspots</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">360°</div>
            <div className="text-sm text-slate-600">Full View</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">1,800m</div>
            <div className="text-sm text-slate-600">Elevation</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">VR Ready</div>
            <div className="text-sm text-slate-600">WebXR Support</div>
          </Card>
        </div>
      </div>

      {/* Main 360 Viewer */}
      <div className="container mx-auto px-4 mb-8">
        <PanoramaViewer
          imageUrl={panoramaImageUrl}
          hotspots={damdayVillageHotspots}
          onHotspotClick={handleHotspotClick}
          className="shadow-2xl"
        />
      </div>

      {/* Tour Guide Section */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Points of Interest */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-slate-900">
              🏔️ Points of Interest
            </h3>
            <div className="space-y-3">
              {damdayVillageHotspots.map((hotspot) => (
                <div key={hotspot.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-800">{hotspot.title}</div>
                    <div className="text-sm text-slate-600 truncate">{hotspot.description}</div>
                  </div>
                  <Badge 
                    variant={hotspot.type === 'poi' ? 'default' : 'secondary'}
                    className="ml-2"
                  >
                    {hotspot.type}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Village Information */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-slate-900">
              🏘️ About Damday Village
            </h3>
            <div className="space-y-4">
              <div>
                <div className="font-medium text-slate-800">Location</div>
                <div className="text-sm text-slate-600">
                  Gangolihat, Pithoragarh District, Uttarakhand, India
                </div>
              </div>
              <div>
                <div className="font-medium text-slate-800">Population</div>
                <div className="text-sm text-slate-600">~150 residents</div>
              </div>
              <div>
                <div className="font-medium text-slate-800">Elevation</div>
                <div className="text-sm text-slate-600">1,800m above sea level</div>
              </div>
              <div>
                <div className="font-medium text-slate-800">Carbon Status</div>
                <div className="text-sm text-green-600 font-medium">Net Zero Carbon</div>
              </div>
              <div>
                <div className="font-medium text-slate-800">Renewable Energy</div>
                <div className="text-sm text-slate-600">85% solar coverage</div>
              </div>
            </div>
          </Card>

          {/* Experience Features */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-slate-900">
              ✨ Experience Features
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="text-lg">🖱️</div>
                <div>
                  <div className="font-medium text-slate-800">Mouse Controls</div>
                  <div className="text-sm text-slate-600">Drag to explore, scroll to zoom</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-lg">📱</div>
                <div>
                  <div className="font-medium text-slate-800">Mobile Friendly</div>
                  <div className="text-sm text-slate-600">Touch gestures and responsive design</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-lg">🥽</div>
                <div>
                  <div className="font-medium text-slate-800">VR Ready</div>
                  <div className="text-sm text-slate-600">WebXR support for immersive experience</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-lg">📍</div>
                <div>
                  <div className="font-medium text-slate-800">Interactive Hotspots</div>
                  <div className="text-sm text-slate-600">Click to learn more about village features</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="p-8 bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Visit Damday Village?</h2>
            <p className="text-lg mb-6 opacity-90">
              Experience sustainable living and Himalayan culture firsthand
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-green-600">
                View Homestays
              </Button>
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Plan Your Trip
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}