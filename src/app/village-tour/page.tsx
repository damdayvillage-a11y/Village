'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Card } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Badge } from '@/lib/components/ui/Badge';

// Dynamic import to prevent SSR issues
const PanoramaViewer = dynamic(
  () => import('@/lib/components/ar/PanoramaViewer').then(mod => mod.PanoramaViewer),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading 360° Village Tour...</p>
        </div>
      </div>
    )
  }
);

interface VillageStats {
  carbonFootprint: 'Net Zero';
  solarCoverage: '85%';
  waterRecycling: '95%';
  wasteManagement: '100% Organic';
  population: 150;
  houses: 32;
  elevation: 1800;
}

export default function VillageTourPage() {
  const [currentScene, setCurrentScene] = useState<string>('village-center');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const villageStats: VillageStats = {
    carbonFootprint: 'Net Zero',
    solarCoverage: '85%',
    waterRecycling: '95%',
    wasteManagement: '100% Organic',
    population: 150,
    houses: 32,
    elevation: 1800
  };

  const features = [
    {
      id: 'sustainability',
      name: 'Sustainability Metrics',
      icon: '🌱',
      description: 'Real-time environmental impact monitoring',
      metrics: [
        { label: 'Carbon Footprint', value: villageStats.carbonFootprint, color: 'text-green-600' },
        { label: 'Solar Energy Coverage', value: villageStats.solarCoverage, color: 'text-yellow-600' },
        { label: 'Water Recycling', value: villageStats.waterRecycling, color: 'text-blue-600' },
        { label: 'Waste Management', value: villageStats.wasteManagement, color: 'text-green-600' }
      ]
    },
    {
      id: 'demographics',
      name: 'Village Demographics',
      icon: '🏘️',
      description: 'Community statistics and housing information',
      metrics: [
        { label: 'Population', value: `${villageStats.population} residents`, color: 'text-purple-600' },
        { label: 'Traditional Houses', value: `${villageStats.houses} Himalayan homes`, color: 'text-brown-600' },
        { label: 'Elevation', value: `${villageStats.elevation}m above sea level`, color: 'text-gray-600' },
        { label: 'Established', value: 'Over 400 years ago', color: 'text-amber-600' }
      ]
    },
    {
      id: 'technology',
      name: 'Smart Technology',
      icon: '📡',
      description: 'IoT sensors and digital infrastructure',
      metrics: [
        { label: 'IoT Sensors', value: '24 active devices', color: 'text-blue-600' },
        { label: 'Internet Coverage', value: '100% fiber connectivity', color: 'text-green-600' },
        { label: 'Digital Services', value: 'Telemedicine, e-governance', color: 'text-purple-600' },
        { label: 'Weather Station', value: 'Real-time climate data', color: 'text-cyan-600' }
      ]
    }
  ];

  const handleSceneChange = useCallback((sceneId: string) => {
    setCurrentScene(sceneId);
  }, []);

  const handleHotspotClick = useCallback((hotspot: any) => {
    console.log('Hotspot clicked:', hotspot);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">

      {/* Page Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            360° Village Tour
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Immerse yourself in Damday Village through interactive panoramic views. 
            Explore traditional Kumaoni architecture, sustainable technology, and breathtaking Himalayan landscapes.
          </p>
        </div>

        {/* Main Tour Interface */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {/* Panorama Viewer */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <div className="h-[600px]">
                <PanoramaViewer
                  scenes={[]}
                  initialSceneId={currentScene}
                  onSceneChange={handleSceneChange}
                  onHotspotClick={handleHotspotClick}
                  showControls={true}
                  enableAR={true}
                  className="w-full h-full"
                />
              </div>
            </Card>
          </div>

          {/* Village Information Panel */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {features.map((feature) => (
                <div 
                  key={feature.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedFeature === feature.id ? 'ring-2 ring-primary-500' : ''
                  }`}
                  onClick={() => setSelectedFeature(
                    selectedFeature === feature.id ? null : feature.id
                  )}
                >
                  <Card>
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl">{feature.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{feature.name}</h3>
                        <p className="text-xs text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                    
                    {selectedFeature === feature.id && (
                      <div className="space-y-2 pt-3 border-t border-gray-200">
                        {feature.metrics.map((metric, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">{metric.label}</span>
                            <span className={`text-xs font-medium ${metric.color}`}>
                              {metric.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  </Card>
                </div>
              ))}

              {/* Quick Actions */}
              <Card>
                <div className="p-4">
                  <h3 className="font-semibold mb-3">Explore More</h3>
                  <div className="space-y-2">
                    <Link href="/digital-twin">
                      <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                        🏔️ 3D Digital Twin
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                      🏠 Book Homestay
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                      🛒 Local Marketplace
                    </Button>
                    <Link href="/dashboard">
                      <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                        📊 Live Data Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>

              {/* Live Environmental Data */}
              <Card>
                <div className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Live Data
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Air Quality</span>
                      <span className="text-green-600 font-medium">Excellent (AQI: 45)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Temperature</span>
                      <span className="text-blue-600 font-medium">18°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Solar Generation</span>
                      <span className="text-yellow-600 font-medium">12.5 kW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Water Level</span>
                      <span className="text-blue-600 font-medium">95%</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Tour Guide Section */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
                Interactive Tour Guide
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🖱️</span>
                  </div>
                  <h3 className="font-semibold mb-2">Navigate</h3>
                  <p className="text-sm text-gray-600">
                    Drag to look around, use arrow keys or touch gestures to explore different angles
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">📍</span>
                  </div>
                  <h3 className="font-semibold mb-2">Discover</h3>
                  <p className="text-sm text-gray-600">
                    Click on hotspots to learn about village landmarks, heritage sites, and technology
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🥽</span>
                  </div>
                  <h3 className="font-semibold mb-2">Experience AR</h3>
                  <p className="text-sm text-gray-600">
                    Enable AR mode for immersive experiences (requires compatible device)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Next Features Preview */}
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4 text-center">
              Coming Soon
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <span className="text-2xl mb-2 block">🎥</span>
                <h4 className="font-semibold text-sm text-primary-600 mb-1">Video Tours</h4>
                <p className="text-xs text-gray-600">Guided video experiences with local storytellers</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <span className="text-2xl mb-2 block">🗣️</span>
                <h4 className="font-semibold text-sm text-accent-600 mb-1">Voice Guide</h4>
                <p className="text-xs text-gray-600">AI-powered multilingual audio commentary</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <span className="text-2xl mb-2 block">📱</span>
                <h4 className="font-semibold text-sm text-primary-600 mb-1">Mobile AR</h4>
                <p className="text-xs text-gray-600">Smartphone AR overlays with historical information</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <span className="text-2xl mb-2 block">🎮</span>
                <h4 className="font-semibold text-sm text-accent-600 mb-1">Virtual Reality</h4>
                <p className="text-xs text-gray-600">Full VR immersion for remote exploration</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}