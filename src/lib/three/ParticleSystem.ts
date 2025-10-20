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
  private particleColors: Float32Array;
  private count: number;
  private time: number = 0;
  private colors: number[];
  
  constructor(count: number, colors: number[]) {
    this.count = count;
    this.colors = colors;
    this.particlePositions = new Float32Array(count * 3);
    this.particleVelocities = new Float32Array(count * 3);
    this.particleColors = new Float32Array(count * 3);
    
    // Initialize particle positions and colors randomly
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Random positions
      this.particlePositions[i3] = (Math.random() - 0.5) * 200;     // x
      this.particlePositions[i3 + 1] = (Math.random() - 0.5) * 200; // y
      this.particlePositions[i3 + 2] = (Math.random() - 0.5) * 200; // z
      
      // Random velocities
      this.particleVelocities[i3] = (Math.random() - 0.5) * 0.02;
      this.particleVelocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      this.particleVelocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
      
      // Assign random color from palette
      const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
      this.particleColors[i3] = color.r;
      this.particleColors[i3 + 1] = color.g;
      this.particleColors[i3 + 2] = color.b;
    }
    
    // Create geometry
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.particlePositions, 3)
    );
    this.geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(this.particleColors, 3)
    );
    
    // Create material with vertex colors
    this.material = new THREE.PointsMaterial({
      size: 2.5,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
      sizeAttenuation: true,
    });
    
    // Create particles mesh
    this.particles = new THREE.Points(this.geometry, this.material);
  }
  
  update(deltaTime: number, mouseX: number = 0, mouseY: number = 0, enableInteraction: boolean = true) {
    this.time += deltaTime;
    
    const positions = this.geometry.attributes.position.array as Float32Array;
    const colors = this.geometry.attributes.color.array as Float32Array;
    
    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;
      
      // Apply velocity
      positions[i3] += this.particleVelocities[i3];
      positions[i3 + 1] += this.particleVelocities[i3 + 1];
      positions[i3 + 2] += this.particleVelocities[i3 + 2];
      
      // Add wave motion for more organic movement
      positions[i3] += Math.sin(this.time * 0.5 + i * 0.1) * 0.015;
      positions[i3 + 1] += Math.cos(this.time * 0.5 + i * 0.1) * 0.015;
      positions[i3 + 2] += Math.sin(this.time * 0.3 + i * 0.05) * 0.01;
      
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
      
      // Subtle color pulsing effect
      const colorPulse = Math.sin(this.time + i * 0.5) * 0.1 + 0.9;
      colors[i3] = this.particleColors[i3] * colorPulse;
      colors[i3 + 1] = this.particleColors[i3 + 1] * colorPulse;
      colors[i3 + 2] = this.particleColors[i3 + 2] * colorPulse;
    }
    
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
  }
  
  getMesh(): THREE.Points {
    return this.particles;
  }
  
  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
