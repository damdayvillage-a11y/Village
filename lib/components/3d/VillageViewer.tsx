'use client';

import React, { useRef, useEffect, useState, Suspense } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface VillageViewerProps {
  width?: number;
  height?: number;
  className?: string;
}

const VillageViewer: React.FC<VillageViewerProps> = ({ 
  width = 800, 
  height = 600, 
  className = '' 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    try {
      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x87CEEB); // Sky blue
      sceneRef.current = scene;

      // Camera setup
      const camera = new THREE.PerspectiveCamera(
        75,
        width / height,
        0.1,
        1000
      );
      camera.position.set(10, 10, 10);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;

      // Lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(10, 10, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      scene.add(directionalLight);

      // Ground
      const groundGeometry = new THREE.PlaneGeometry(50, 50);
      const groundMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x90EE90,
        side: THREE.DoubleSide 
      });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      // Village buildings
      createVillageBuildings(scene);

      // Mountains in background
      createMountains(scene);

      // Trees
      createTrees(scene);

      mountRef.current.appendChild(renderer.domElement);

      // Controls
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      const handleMouseMove = (event: MouseEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      };

      renderer.domElement.addEventListener('mousemove', handleMouseMove);

      // Animation loop
      const animate = () => {
        targetX = mouseX * 0.1;
        targetY = mouseY * 0.1;

        camera.position.x += (targetX - camera.position.x) * 0.02;
        camera.position.y += (targetY - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        frameRef.current = requestAnimationFrame(animate);
      };

      animate();
      setLoading(false);

      return () => {
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current);
        }
        renderer.domElement.removeEventListener('mousemove', handleMouseMove);
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    } catch (err) {
      console.error('Error initializing 3D scene:', err);
      setError('Failed to initialize 3D viewer');
      setLoading(false);
    }
  }, [width, height]);

  const createVillageBuildings = (scene: THREE.Scene) => {
    // Traditional Himalayan houses
    const houses = [
      { x: 0, z: 0, color: 0x8B4513 },
      { x: 5, z: 3, color: 0xA0522D },
      { x: -4, z: 2, color: 0x654321 },
      { x: 3, z: -5, color: 0x8B4513 },
      { x: -2, z: -3, color: 0xA0522D }
    ];

    houses.forEach(house => {
      // House base
      const houseGeometry = new THREE.BoxGeometry(2, 2, 2);
      const houseMaterial = new THREE.MeshLambertMaterial({ color: house.color });
      const houseBase = new THREE.Mesh(houseGeometry, houseMaterial);
      houseBase.position.set(house.x, 1, house.z);
      houseBase.castShadow = true;
      scene.add(houseBase);

      // Roof
      const roofGeometry = new THREE.ConeGeometry(1.8, 1, 4);
      const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8B0000 });
      const roof = new THREE.Mesh(roofGeometry, roofMaterial);
      roof.position.set(house.x, 2.5, house.z);
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      scene.add(roof);
    });
  };

  const createMountains = (scene: THREE.Scene) => {
    const mountains = [
      { x: -30, scale: 15, color: 0x696969 },
      { x: -20, scale: 12, color: 0x778899 },
      { x: 25, scale: 18, color: 0x696969 },
      { x: 35, scale: 14, color: 0x778899 }
    ];

    mountains.forEach(mountain => {
      const mountainGeometry = new THREE.ConeGeometry(mountain.scale, mountain.scale * 1.5, 6);
      const mountainMaterial = new THREE.MeshLambertMaterial({ color: mountain.color });
      const mountainMesh = new THREE.Mesh(mountainGeometry, mountainMaterial);
      mountainMesh.position.set(mountain.x, mountain.scale * 0.75, -25);
      scene.add(mountainMesh);
    });
  };

  const createTrees = (scene: THREE.Scene) => {
    const trees = [
      { x: 8, z: 8 }, { x: -8, z: 8 }, { x: 8, z: -8 }, { x: -8, z: -8 },
      { x: 12, z: 0 }, { x: -12, z: 0 }, { x: 0, z: 12 }, { x: 0, z: -12 }
    ];

    trees.forEach(tree => {
      // Tree trunk
      const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2);
      const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.set(tree.x, 1, tree.z);
      trunk.castShadow = true;
      scene.add(trunk);

      // Tree foliage
      const foliageGeometry = new THREE.SphereGeometry(1.5);
      const foliageMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
      const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
      foliage.position.set(tree.x, 3, tree.z);
      foliage.castShadow = true;
      scene.add(foliage);
    });
  };

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="text-center p-8">
          <div className="text-red-600 mb-2">⚠️</div>
          <p className="text-red-800 font-medium">3D Viewer Error</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-lg shadow-lg ${className}`}>
      {loading && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading 3D Village...</p>
          </div>
        </motion.div>
      )}
      
      <div 
        ref={mountRef} 
        className="w-full h-full"
        style={{ width, height }}
      />
      
      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded text-sm">
        <p>🏔️ Damday Village Digital Twin</p>
        <p className="text-xs opacity-75">Move mouse to explore</p>
      </div>
    </div>
  );
};

export default VillageViewer;