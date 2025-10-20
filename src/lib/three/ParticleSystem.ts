/**
 * Particle System for Three.js animated background
 * Creates and manages animated particles with organic movement
 */

import * as THREE from 'three';

export class ParticleSystem {
  private particles: THREE.Points;
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial;
  private particlePositions: Float32Array;
  private particleVelocities: Float32Array;
  private count: number;
  private time: number = 0;
  
  constructor(count: number, colors: number[]) {
    this.count = count;
    this.particlePositions = new Float32Array(count * 3);
    this.particleVelocities = new Float32Array(count * 3);
    
    // Initialize particle positions randomly
    for (let i = 0; i < count * 3; i += 3) {
      this.particlePositions[i] = (Math.random() - 0.5) * 200;     // x
      this.particlePositions[i + 1] = (Math.random() - 0.5) * 200; // y
      this.particlePositions[i + 2] = (Math.random() - 0.5) * 200; // z
      
      // Random velocities
      this.particleVelocities[i] = (Math.random() - 0.5) * 0.02;
      this.particleVelocities[i + 1] = (Math.random() - 0.5) * 0.02;
      this.particleVelocities[i + 2] = (Math.random() - 0.5) * 0.02;
    }
    
    // Create geometry
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.particlePositions, 3)
    );
    
    // Create material
    this.material = new THREE.PointsMaterial({
      color: colors[0],
      size: 2,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    // Create particles mesh
    this.particles = new THREE.Points(this.geometry, this.material);
  }
  
  update(deltaTime: number, mouseX: number = 0, mouseY: number = 0, enableInteraction: boolean = true) {
    this.time += deltaTime;
    
    const positions = this.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;
      
      // Apply velocity
      positions[i3] += this.particleVelocities[i3];
      positions[i3 + 1] += this.particleVelocities[i3 + 1];
      positions[i3 + 2] += this.particleVelocities[i3 + 2];
      
      // Add wave motion
      positions[i3] += Math.sin(this.time + i) * 0.01;
      positions[i3 + 1] += Math.cos(this.time + i) * 0.01;
      
      // Wrap around boundaries
      if (positions[i3] > 100) positions[i3] = -100;
      if (positions[i3] < -100) positions[i3] = 100;
      if (positions[i3 + 1] > 100) positions[i3 + 1] = -100;
      if (positions[i3 + 1] < -100) positions[i3 + 1] = 100;
      if (positions[i3 + 2] > 100) positions[i3 + 2] = -100;
      if (positions[i3 + 2] < -100) positions[i3 + 2] = 100;
      
      // Mouse interaction
      if (enableInteraction) {
        const dx = mouseX - positions[i3];
        const dy = mouseY - positions[i3 + 1];
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 20) {
          positions[i3] += dx * 0.05;
          positions[i3 + 1] += dy * 0.05;
        }
      }
    }
    
    this.geometry.attributes.position.needsUpdate = true;
  }
  
  getMesh(): THREE.Points {
    return this.particles;
  }
  
  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
