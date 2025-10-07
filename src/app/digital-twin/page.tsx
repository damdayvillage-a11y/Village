'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Badge } from '@/lib/components/ui/Badge';
import { Button } from '@/lib/components/ui/Button';
import { Alert } from '@/lib/components/ui/Alert';

// Dynamic import to avoid SSR issues with Three.js
const VillageViewer = dynamic(
  () => import('@/lib/components/3d/VillageViewer'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading 3D Village...</p>
        </div>
      </div>
    )
  }
);

export default function DigitalTwinPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🏔️ Digital Twin - Damday Village
              </h1>
              <p className="text-gray-600 mt-2">
                Explore our carbon-neutral village in immersive 3D
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="success">Live Data</Badge>
              <Badge variant="info">Interactive</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* 3D Viewer */}
        <Card className="overflow-hidden">
          <CardContent padding="none">
            <Suspense fallback={
              <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Initializing 3D Engine...</p>
                </div>
              </div>
            }>
              <VillageViewer width={1200} height={600} className="w-full" />
            </Suspense>
          </CardContent>
        </Card>

        {/* Controls and Information */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Village Information */}
          <Card>
            <CardHeader>
              <CardTitle>🏘️ Village Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Location</h4>
                  <p className="text-sm text-gray-600">
                    Gangolihat, Pithoragarh District, Uttarakhand, India
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Elevation</h4>
                  <p className="text-sm text-gray-600">1,800m above sea level</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Population</h4>
                  <p className="text-sm text-gray-600">~150 residents</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Houses</h4>
                  <p className="text-sm text-gray-600">32 traditional Himalayan homes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Environmental Stats */}
          <Card>
            <CardHeader>
              <CardTitle>🌱 Environmental Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Carbon Footprint</span>
                  <Badge variant="success">Net Zero</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Solar Energy</span>
                  <span className="text-sm font-medium">85% Coverage</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Water Conservation</span>
                  <span className="text-sm font-medium">95% Recycled</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Waste Management</span>
                  <Badge variant="success">100% Organic</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Features */}
          <Card>
            <CardHeader>
              <CardTitle>🎮 Interactive Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Alert variant="info">
                  <strong>Mouse Controls:</strong><br />
                  Move mouse to explore different angles of the village
                </Alert>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full text-left justify-start">
                    🏠 View Homestays
                  </Button>
                  <Button variant="outline" className="w-full text-left justify-start">
                    ⚡ Energy Dashboard
                  </Button>
                  <Button variant="outline" className="w-full text-left justify-start">
                    🌡️ Weather Station
                  </Button>
                  <Button variant="outline" className="w-full text-left justify-start">
                    🎯 AR Guided Tour
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technology Information */}
        <Card>
          <CardHeader>
            <CardTitle>🔬 Digital Twin Technology</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Real-time Data Integration</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• IoT sensors for environmental monitoring</li>
                  <li>• Solar panel performance tracking</li>
                  <li>• Weather station data feed</li>
                  <li>• Occupancy and usage analytics</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">3D Modeling Features</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Photorealistic village representation</li>
                  <li>• Interactive building exploration</li>
                  <li>• Seasonal changes simulation</li>
                  <li>• Cultural heritage preservation</li>
                </ul>
              </div>
            </div>
            
            <Alert variant="success" className="mt-6">
              <strong>Next Features Coming Soon:</strong> VR Support, Real-time Weather Sync, 
              Interactive Homestay Tours, and Community Event Visualization
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}