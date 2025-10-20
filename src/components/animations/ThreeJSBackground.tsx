'use client';

/**
 * Three.js Animated Background Component
 * Renders particle system with smooth animations
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ParticleSystem } from '@/lib/three/ParticleSystem';
import { getTheme } from '@/lib/three/ColorThemes';

interface ThreeJSBackgroundProps {
  preset?: 'nature' | 'tech' | 'sunset' | 'night';
  particleCount?: number;
  animationSpeed?: number;
  enableInteraction?: boolean;
  className?: string;
}

export function ThreeJSBackground({
  preset = 'nature',
  particleCount = 1000,
  animationSpeed = 1.0,
  enableInteraction = true,
  className = '',
}: ThreeJSBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particleSystemRef = useRef<ParticleSystem | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameIdRef = useRef<number>(0);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Get theme colors
    const theme = getTheme(preset);
    
    // Detect mobile and adjust particle count
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const adjustedParticleCount = isMobile ? Math.min(particleCount, 300) : particleCount;
    
    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(theme.background);
    scene.fog = new THREE.Fog(theme.fog, 50, 200);
    sceneRef.current = scene;
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 100;
    cameraRef.current = camera;
    
    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: !isMobile,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Create particle system
    const particleSystem = new ParticleSystem(adjustedParticleCount, theme.particles);
    scene.add(particleSystem.getMesh());
    particleSystemRef.current = particleSystem;
    
    // Animation loop
    let lastTime = performance.now();
    const animate = () => {
      const currentTime = performance.now();
      const deltaTime = (currentTime - lastTime) * 0.001 * animationSpeed;
      lastTime = currentTime;
      
      // Update particles
      particleSystem.update(
        deltaTime, 
        mouseRef.current.x, 
        mouseRef.current.y,
        enableInteraction
      );
      
      // Render
      renderer.render(scene, camera);
      
      frameIdRef.current = requestAnimationFrame(animate);
    };
    animate();
    
    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      if (!enableInteraction) return;
      
      mouseRef.current.x = (event.clientX / window.innerWidth) * 200 - 100;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 200 + 100;
    };
    
    // Resize handler
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameIdRef.current);
      
      particleSystem.dispose();
      renderer.dispose();
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [preset, particleCount, animationSpeed, enableInteraction]);
  
  return (
    <div 
      ref={containerRef} 
      className={`fixed inset-0 -z-10 ${className}`}
      aria-hidden="true"
    />
  );
}
