'use client';

import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { Card } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Badge } from '@/lib/components/ui/Badge';
import { Alert } from '@/lib/components/ui/Alert';
import { cn } from '@/lib/utils';

interface Hotspot {
  id: string;
  name: string;
  description: string;
  type: 'poi' | 'heritage' | 'nature' | 'activity';
  position: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  metadata: {
    category: string;
    significance: string;
    year?: number;
    accessibility: 'easy' | 'moderate' | 'difficult';
  };
}

interface PanoramaScene {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  hotspots: Hotspot[];
  connections: string[]; // IDs of connected scenes
  location: {
    name: string;
    coordinates: [number, number]; // lat, lng
    elevation: number;
  };
}

interface PanoramaViewerProps {
  className?: string;
  scenes: PanoramaScene[];
  initialSceneId?: string;
  onSceneChange?: (sceneId: string) => void;
  onHotspotClick?: (hotspot: Hotspot) => void;
  showControls?: boolean;
  enableAR?: boolean;
}

const DEFAULT_SCENES: PanoramaScene[] = [
  {
    id: 'village-center',
    name: 'Village Center',
    description: 'The heart of Damday Village with traditional Kumaoni architecture',
    imageUrl: '/api/panoramas/village-center.jpg',
    thumbnailUrl: '/api/thumbnails/village-center.jpg',
    location: {
      name: 'Central Square',
      coordinates: [29.8416, 80.2082],
      elevation: 1800,
    },
    hotspots: [
      {
        id: 'temple-1',
        name: 'Ancient Temple',
        description: 'A 400-year-old temple dedicated to local deities, showcasing traditional Kumaoni stone architecture.',
        type: 'heritage',
        position: { x: -2, y: 1, z: -5 },
        rotation: { x: 0, y: 45, z: 0 },
        metadata: {
          category: 'Religious Heritage',
          significance: 'Cultural landmark with intricate wood carvings',
          year: 1620,
          accessibility: 'easy'
        }
      },
      {
        id: 'solar-panel',
        name: 'Community Solar Grid',
        description: 'Village solar microgrid providing 100% renewable energy to all households.',
        type: 'activity',
        position: { x: 3, y: 2, z: -4 },
        metadata: {
          category: 'Sustainable Technology',
          significance: 'Powers entire village with clean energy',
          accessibility: 'easy'
        }
      },
      {
        id: 'himalayan-view',
        name: 'Himalayan Vista',
        description: 'Panoramic view of the Greater Himalayan peaks including Nanda Devi.',
        type: 'nature',
        position: { x: 0, y: 0.5, z: -8 },
        metadata: {
          category: 'Natural Beauty',
          significance: 'Breathtaking mountain vistas at 1800m elevation',
          accessibility: 'easy'
        }
      }
    ],
    connections: ['homestay-area', 'forest-trail']
  },
  {
    id: 'homestay-area',
    name: 'Traditional Homestays',
    description: 'Authentic Kumaoni houses offering immersive cultural experiences',
    imageUrl: '/api/panoramas/homestay-area.jpg',
    thumbnailUrl: '/api/thumbnails/homestay-area.jpg',
    location: {
      name: 'Homestay Quarter',
      coordinates: [29.8420, 80.2086],
      elevation: 1785,
    },
    hotspots: [
      {
        id: 'homestay-1',
        name: 'Heritage Homestay',
        description: 'Traditional stone and wood house with authentic Kumaoni interiors and organic farming.',
        type: 'poi',
        position: { x: -1.5, y: 0, z: -3 },
        metadata: {
          category: 'Accommodation',
          significance: '200-year-old traditional architecture',
          accessibility: 'moderate'
        }
      },
      {
        id: 'organic-farm',
        name: 'Organic Terrace Farm',
        description: 'Traditional terrace farming with organic vegetables and grains using ancient techniques.',
        type: 'activity',
        position: { x: 2, y: -0.5, z: -4 },
        metadata: {
          category: 'Sustainable Agriculture',
          significance: 'Zero-chemical farming methods',
          accessibility: 'easy'
        }
      }
    ],
    connections: ['village-center', 'forest-trail']
  }
];

export function PanoramaViewer({
  className,
  scenes = DEFAULT_SCENES,
  initialSceneId,
  onSceneChange,
  onHotspotClick,
  showControls = true,
  enableAR = true
}: PanoramaViewerProps) {
  const [currentSceneId, setCurrentSceneId] = useState(
    initialSceneId || scenes[0]?.id || ''
  );
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAR, setIsAR] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [mouseDown, setMouseDown] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const viewerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const currentScene = scenes.find(scene => scene.id === currentSceneId);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setMouseDown(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!mouseDown) return;

    const deltaX = e.clientX - lastMouse.x;
    const deltaY = e.clientY - lastMouse.y;

    setRotation(prev => ({
      x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }));

    setLastMouse({ x: e.clientX, y: e.clientY });
  }, [mouseDown, lastMouse]);

  const handleMouseUp = useCallback(() => {
    setMouseDown(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setMouseDown(true);
      setLastMouse({ x: touch.clientX, y: touch.clientY });
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!mouseDown || e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - lastMouse.x;
    const deltaY = touch.clientY - lastMouse.y;

    setRotation(prev => ({
      x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }));

    setLastMouse({ x: touch.clientX, y: touch.clientY });
  }, [mouseDown, lastMouse]);

  const handleSceneChange = useCallback((sceneId: string) => {
    if (sceneId !== currentSceneId) {
      setIsLoading(true);
      setCurrentSceneId(sceneId);
      setSelectedHotspot(null);
      setRotation({ x: 0, y: 0 });
      onSceneChange?.(sceneId);
    }
  }, [currentSceneId, onSceneChange]);

  const handleHotspotClick = useCallback((hotspot: Hotspot) => {
    setSelectedHotspot(hotspot);
    onHotspotClick?.(hotspot);
  }, [onHotspotClick]);

  const toggleAR = useCallback(async () => {
    if (!enableAR) return;

    try {
      // @ts-ignore - WebXR types not fully supported
      if (navigator.xr && await navigator.xr.isSessionSupported('immersive-ar')) {
        setIsAR(!isAR);
      } else {
        setError('AR not supported on this device');
      }
    } catch (err) {
      console.error('AR error:', err);
      setError('Failed to initialize AR mode');
    }
  }, [enableAR, isAR]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentScene) return;

      switch (e.key) {
        case 'ArrowLeft':
          setRotation(prev => ({ ...prev, y: prev.y - 10 }));
          break;
        case 'ArrowRight':
          setRotation(prev => ({ ...prev, y: prev.y + 10 }));
          break;
        case 'ArrowUp':
          setRotation(prev => ({ 
            ...prev, 
            x: Math.min(90, prev.x + 10) 
          }));
          break;
        case 'ArrowDown':
          setRotation(prev => ({ 
            ...prev, 
            x: Math.max(-90, prev.x - 10) 
          }));
          break;
        case 'Escape':
          setSelectedHotspot(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScene]);

  useEffect(() => {
    // Simulate image loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [currentSceneId]);

  if (!currentScene) {
    return (
      <Alert variant="error">
        <p>No scene data available</p>
      </Alert>
    );
  }

  return (
    <div className={cn('relative w-full h-full min-h-[500px] overflow-hidden rounded-lg', className)}>
      {/* Main Panorama Viewer */}
      <div 
        ref={viewerRef}
        className="relative w-full h-full bg-gray-900 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        role="application"
        aria-label={`360° panoramic view of ${currentScene.name}`}
        tabIndex={0}
      >
        {/* Panorama Background */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-blue-400 via-green-300 to-green-600 transition-transform duration-200 ease-out"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
          }}
        >
          {/* Simulated 360° environment */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>

        {/* Hotspots */}
        {!isLoading && currentScene.hotspots.map(hotspot => (
          <button
            key={hotspot.id}
            className="absolute w-8 h-8 bg-white/90 hover:bg-white border-2 border-primary-500 rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            style={{
              left: `${50 + hotspot.position.x * 5}%`,
              top: `${50 + hotspot.position.y * 5}%`,
              transform: `translate(-50%, -50%)`
            }}
            onClick={() => handleHotspotClick(hotspot)}
            aria-label={`View details about ${hotspot.name}`}
            title={hotspot.name}
          >
            <div className="w-full h-full flex items-center justify-center text-xs">
              {hotspot.type === 'heritage' && '🏛️'}
              {hotspot.type === 'nature' && '🏔️'}
              {hotspot.type === 'activity' && '⚡'}
              {hotspot.type === 'poi' && '📍'}
            </div>
          </button>
        ))}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
            <div className="text-white text-center">
              <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Loading panoramic view...</p>
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900/50 backdrop-blur-sm">
            <Alert variant="error">
              <p>{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setError(null)}
              >
                Dismiss
              </Button>
            </Alert>
          </div>
        )}
      </div>

      {/* Controls */}
      {showControls && (
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 items-center justify-between">
          {/* Scene Navigation */}
          <div className="flex gap-2 flex-wrap">
            {scenes.map(scene => (
              <Button
                key={scene.id}
                variant={scene.id === currentSceneId ? "primary" : "outline"}
                size="sm"
                onClick={() => handleSceneChange(scene.id)}
                className="text-xs"
              >
                {scene.name}
              </Button>
            ))}
          </div>

          {/* AR Toggle */}
          {enableAR && (
            <Button
              variant={isAR ? "primary" : "outline"}
              size="sm"
              onClick={toggleAR}
              className="text-xs"
            >
              {isAR ? '🥽 AR Active' : '🥽 Enter AR'}
            </Button>
          )}
        </div>
      )}

      {/* Scene Info */}
      <div className="absolute top-4 left-4 right-4">
        <Card className="bg-white/90 backdrop-blur-sm">
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1">{currentScene.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{currentScene.description}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>📍 {currentScene.location.name}</span>
              <span>⛰️ {currentScene.location.elevation}m</span>
              <span>🎯 {currentScene.hotspots.length} points of interest</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Hotspot Details Panel */}
      {selectedHotspot && (
        <div className="absolute top-4 right-4 w-80 max-w-[calc(100vw-2rem)]">
          <Card className="bg-white/95 backdrop-blur-sm">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-lg">{selectedHotspot.name}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedHotspot(null)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close details"
                >
                  ✕
                </Button>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{selectedHotspot.description}</p>
              
              <div className="space-y-2">
                <Badge 
                  variant={selectedHotspot.type === 'heritage' ? 'default' : 'info'}
                  className="mr-2"
                >
                  {selectedHotspot.metadata.category}
                </Badge>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <div><strong>Significance:</strong> {selectedHotspot.metadata.significance}</div>
                  {selectedHotspot.metadata.year && (
                    <div><strong>Year:</strong> {selectedHotspot.metadata.year}</div>
                  )}
                  <div><strong>Accessibility:</strong> {selectedHotspot.metadata.accessibility}</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Navigation Instructions */}
      <div className="absolute bottom-4 right-4">
        <Card className="bg-black/50 backdrop-blur-sm text-white text-xs">
          <div className="p-2">
            <div>🖱️ Drag to explore</div>
            <div>⌨️ Arrow keys to navigate</div>
            <div>📱 Touch gestures supported</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default PanoramaViewer;