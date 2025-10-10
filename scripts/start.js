#!/usr/bin/env node

/**
 * CapRover-optimized startup script for Smart Carbon-Free Village
 * Validates environment and starts the Next.js server
 */

const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Smart Carbon-Free Village application...');

// Run comprehensive startup validation
console.log('🔍 Running startup configuration check...');
const validationScript = path.join(__dirname, 'startup-check.js');

// Check if validation script exists
if (fs.existsSync(validationScript)) {
  const validationResult = spawnSync('node', [validationScript], {
    stdio: 'inherit',
    env: process.env
  });

  if (validationResult.error) {
    console.error('❌ Failed to run validation script:', validationResult.error);
    process.exit(1);
  }

  if (validationResult.status !== 0) {
    console.error('❌ Startup validation failed!');
    console.error('   Please fix the configuration errors above before starting the application.');
    process.exit(1);
  }

  console.log('✅ Startup validation passed!');
} else {
  console.warn('⚠️  Warning: startup-check.js not found, skipping validation');
  console.warn('   This may lead to runtime errors if environment is misconfigured');
}

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