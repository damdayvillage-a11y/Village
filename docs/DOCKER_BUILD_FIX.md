# Docker Build Hang Fix

## Problem Description
The Docker build process was hanging after the "Checking validity of types" step during `npm run build`. The build would appear to freeze without any error messages, causing deployment failures.

## Root Cause Analysis
The issue was caused by several factors:

1. **Node.js Version Incompatibility**: Using Node 18 while some dependencies required Node 20+
2. **HTTP Registry**: Using insecure HTTP registry instead of HTTPS
3. **Memory Constraints**: Insufficient memory allocation for Node.js build process
4. **Telemetry Issues**: Next.js telemetry trying to connect in restricted Docker environment

## Solution Implemented

### 1. Node.js Version Upgrade
- Upgraded from `node:18-alpine` to `node:20-alpine`
- This resolves engine compatibility warnings for packages like Storybook and ical-generator

### 2. Registry Configuration
- Changed from `http://registry.npmjs.org/` to `https://registry.npmjs.org/`
- This prevents 403 Forbidden errors when accessing packages

### 3. Memory Management
- Added Node.js memory limits: `--max-old-space-size=4096 --max-semi-space-size=1024`
- Set thread pool size: `UV_THREADPOOL_SIZE=64`
- These prevent out-of-memory issues during build

### 4. Build Optimizations
- Added explicit telemetry disabling: `NEXT_TELEMETRY_DISABLED=1`
- Set CI environment: `CI=true`
- Added timeout protection with verbose logging
- Optimized Next.js configuration for Docker builds

### 5. Enhanced Error Handling
- Added build timeout (15 minutes)
- Added verbose logging with timestamps
- Improved error reporting

## Files Modified

- `Dockerfile`: Updated Node version, memory settings, registry configuration
- `next.config.js`: Added Docker-specific optimizations and PWA settings
- `package.json`: Added Docker build script
- `scripts/build.sh`: Enhanced with better monitoring and error handling
- `.dockerignore`: Added service worker files to prevent conflicts
- `.env.docker`: Docker-specific environment variables

## Verification

The fix has been tested and verified:
- ✅ Builder stage completes successfully (140 seconds)
- ✅ Full production build completes successfully (3.4 seconds with cache)
- ✅ No hanging or timeout issues
- ✅ All build steps execute properly
- ✅ Service worker generation works correctly

## Usage

To build with the fixed configuration:

```bash
# Build only the application (for testing)
docker build -t village-app:latest --target builder .

# Build complete production image
docker build -t village-app:latest .
```

## Environment Variables

The following environment variables are set for Docker builds:
- `NODE_OPTIONS`: Memory limits and optimizations
- `NEXT_TELEMETRY_DISABLED`: Disable Next.js telemetry
- `CI`: Enable CI mode for better build behavior
- `UV_THREADPOOL_SIZE`: Increase thread pool for better performance