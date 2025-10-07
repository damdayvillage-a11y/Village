'use client'

import React, { useEffect, useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

// Simple panorama viewer without external dependencies

interface Hotspot {
  id: string
  position: [number, number, number]
  title: string
  description: string
  type: 'info' | 'navigation' | 'poi'
}

interface PanoramaViewerProps {
  imageUrl: string
  hotspots?: Hotspot[]
  onHotspotClick?: (hotspot: Hotspot) => void
  className?: string
}

// 360 Panorama Sphere Component
function PanoramaSphere({ imageUrl }: { imageUrl: string }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.load(
      imageUrl,
      (loadedTexture) => {
        loadedTexture.mapping = THREE.EquirectangularReflectionMapping
        loadedTexture.wrapS = THREE.RepeatWrapping
        loadedTexture.wrapT = THREE.RepeatWrapping
        setTexture(loadedTexture)
      },
      undefined,
      (error) => {
        console.error('Error loading panorama texture:', error)
        // Create fallback gradient texture
        const canvas = document.createElement('canvas')
        canvas.width = 512
        canvas.height = 256
        const ctx = canvas.getContext('2d')!
        
        // Create a beautiful sky gradient as fallback
        const gradient = ctx.createLinearGradient(0, 0, 0, 256)
        gradient.addColorStop(0, '#87CEEB') // Sky blue
        gradient.addColorStop(0.7, '#98FB98') // Pale green
        gradient.addColorStop(1, '#8FBC8F') // Dark sea green
        
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 512, 256)
        
        const fallbackTexture = new THREE.CanvasTexture(canvas)
        fallbackTexture.mapping = THREE.EquirectangularReflectionMapping
        setTexture(fallbackTexture)
      }
    )
  }, [imageUrl])

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001 // Subtle auto-rotation
    }
  })

  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial 
        map={texture} 
        side={THREE.BackSide}
        toneMapped={false}
      />
    </mesh>
  )
}

// Interactive Hotspot Component
function InteractiveHotspot({ 
  hotspot, 
  onClick 
}: { 
  hotspot: Hotspot
  onClick?: (hotspot: Hotspot) => void 
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      const scale = hovered ? 1.2 : 1.0
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)
      
      // Gentle pulsing animation
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1
      const material = meshRef.current.material as THREE.MeshBasicMaterial
      if (material && 'opacity' in material) {
        material.opacity = 0.8 * pulse
      }
    }
  })

  const getHotspotColor = (type: string) => {
    switch (type) {
      case 'info': return '#3b82f6' // Blue
      case 'navigation': return '#10b981' // Green
      case 'poi': return '#f59e0b' // Amber
      default: return '#6366f1' // Indigo
    }
  }

  return (
    <mesh
      ref={meshRef}
      position={hotspot.position}
      onClick={() => onClick?.(hotspot)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[2, 16, 16]} />
      <meshBasicMaterial 
        color={getHotspotColor(hotspot.type)}
        transparent
        opacity={0.8}
      />
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[2.5, 4, 16]} />
        <meshBasicMaterial 
          color={getHotspotColor(hotspot.type)}
          transparent
          opacity={0.3}
        />
      </mesh>
    </mesh>
  )
}

// Simple mouse controls for the panorama
function usePanoramaControls(camera: THREE.Camera | null) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = -(event.clientY / window.innerHeight) * 2 + 1
      setMousePos({ x, y })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  useFrame(() => {
    if (camera) {
      camera.rotation.y += mousePos.x * 0.01
      camera.rotation.x += mousePos.y * 0.005
      // Limit vertical rotation
      camera.rotation.x = Math.max(-Math.PI/3, Math.min(Math.PI/3, camera.rotation.x))
    }
  })
}

// Loading Component
function PanoramaLoader() {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-b from-sky-200 to-green-200">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Loading 360° village tour...</p>
      </div>
    </div>
  )
}

export default function PanoramaViewer({ 
  imageUrl, 
  hotspots = [], 
  onHotspotClick,
  className = '' 
}: PanoramaViewerProps) {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null)
  const [isVRSupported, setIsVRSupported] = useState(false)

  useEffect(() => {
    // Check for WebXR VR support
    if ('xr' in navigator && navigator.xr && 'isSessionSupported' in navigator.xr) {
      navigator.xr.isSessionSupported('immersive-vr').then(setIsVRSupported).catch(() => setIsVRSupported(false))
    }
  }, [])

  const handleHotspotClick = (hotspot: Hotspot) => {
    setSelectedHotspot(hotspot)
    onHotspotClick?.(hotspot)
  }

  return (
    <div className={`relative w-full h-[600px] bg-slate-900 rounded-lg overflow-hidden ${className}`}>
      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <Badge variant="default" className="bg-black/50 text-white">
          360° Village Tour
        </Badge>
        {isVRSupported && (
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-black/50 text-white border-white/20 hover:bg-white/20"
          >
            Enter VR
          </Button>
        )}
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-black/50 text-white text-xs p-2 rounded">
          <p>🖱️ Drag to look around</p>
          <p>🔍 Scroll to zoom</p>
          <p>📍 Click hotspots to explore</p>
        </div>
      </div>

      {/* Hotspot Info Panel */}
      {selectedHotspot && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="bg-white rounded-lg p-4 shadow-xl">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-slate-900">{selectedHotspot.title}</h3>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setSelectedHotspot(null)}
              >
                ✕
              </Button>
            </div>
            <p className="text-slate-600 text-sm">{selectedHotspot.description}</p>
            <Badge 
              variant={selectedHotspot.type === 'poi' ? 'default' : 'secondary'}
              className="mt-2"
            >
              {selectedHotspot.type.toUpperCase()}
            </Badge>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 0.1], fov: 75 }}
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: 'high-performance'
        }}
      >
        <Suspense fallback={null}>
          <PanoramaSphere imageUrl={imageUrl} />
          {hotspots.map((hotspot) => (
            <InteractiveHotspot
              key={hotspot.id}
              hotspot={hotspot}
              onClick={handleHotspotClick}
            />
          ))}
        </Suspense>
      </Canvas>

      {/* Loading Fallback */}
      <Suspense fallback={<PanoramaLoader />}>
        <div />
      </Suspense>
    </div>
  )
}

// Export utility functions for hotspot management
export const createHotspot = (
  id: string, 
  title: string, 
  description: string, 
  position: [number, number, number],
  type: 'info' | 'navigation' | 'poi' = 'info'
): Hotspot => ({
  id,
  title,
  description,
  position,
  type
})

// Sample hotspots for Damday Village
export const damdayVillageHotspots: Hotspot[] = [
  createHotspot(
    'village-center',
    'Village Center',
    'The heart of Damday Village where community gatherings take place.',
    [0, 0, -100],
    'poi'
  ),
  createHotspot(
    'solar-panels',
    'Solar Energy Station',
    'Community solar panel installation providing clean energy to the village.',
    [50, 20, -80],
    'info'
  ),
  createHotspot(
    'traditional-house',
    'Traditional Himalayan House',
    'Experience authentic local architecture and cultural heritage.',
    [-60, 0, -70],
    'navigation'
  ),
  createHotspot(
    'organic-farm',
    'Organic Farming Area',
    'Sustainable agriculture practices supporting the local community.',
    [30, -10, 90],
    'poi'
  ),
  createHotspot(
    'mountain-view',
    'Himalayan Vista',
    'Breathtaking view of the surrounding Himalayan peaks.',
    [0, 30, 100],
    'info'
  )
]