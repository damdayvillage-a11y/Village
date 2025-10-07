#!/usr/bin/env node

/**
 * CapRover-optimized startup script for Smart Carbon-Free Village
 * Validates environment and starts the Next.js server
 */

const { spawn } = require('child_process');
const fs = require('fs');

// Environment validation
const requiredEnvVars = [
  'NODE_ENV',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
];

const optionalEnvVars = [
  'DATABASE_URL',
  'STRIPE_SECRET_KEY',
  'GOOGLE_CLIENT_ID',
  'MQTT_BROKER_URL'
];

console.log('🚀 Starting Smart Carbon-Free Village application...');

// Check required environment variables
let missingRequired = [];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    missingRequired.push(envVar);
  }
});

if (missingRequired.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingRequired.forEach(envVar => console.error(`   - ${envVar}`));
  process.exit(1);
}

// Log optional environment variables status
console.log('📊 Environment configuration:');
requiredEnvVars.forEach(envVar => {
  console.log(`   ✅ ${envVar}: configured`);
});

optionalEnvVars.forEach(envVar => {
  const status = process.env[envVar] ? '✅ configured' : '⚠️  not set';
  console.log(`   ${status}: ${envVar}`);
});

// Set defaults
process.env.PORT = process.env.PORT || '80';
process.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0';

console.log(`🌐 Server will listen on ${process.env.HOSTNAME}:${process.env.PORT}`);

// Check if we're in a container (CapRover deployment)
const isContainer = fs.existsSync('/.dockerenv') || process.env.CAPROVER_APP_NAME;
if (isContainer) {
  console.log('🐳 Running in container environment (CapRover)');
}

// Start the Next.js server
console.log('🎬 Starting Next.js server...');

const serverProcess = spawn('node', ['server.js'], {
  stdio: 'inherit',
  env: process.env
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('📡 Received SIGTERM, shutting down gracefully...');
  serverProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('📡 Received SIGINT, shutting down gracefully...');
  serverProcess.kill('SIGINT');
});

serverProcess.on('exit', (code) => {
  console.log(`🏁 Server process exited with code ${code}`);
  process.exit(code);
});

serverProcess.on('error', (err) => {
  console.error('💥 Failed to start server process:', err);
  process.exit(1);
});

console.log('✅ Startup script completed, server should be running...');