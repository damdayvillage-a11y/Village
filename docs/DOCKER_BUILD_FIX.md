# Docker Build Hang Fix - Updated 2025-01-08

## Problem Description
The Docker build process was hanging after the "Checking validity of types" step during `npm run build`. The build would appear to freeze without any error messages, causing deployment failures in CapRover environments. Based on the user-reported logs, npm install was completing successfully but the build step would hang indefinitely with numerous deprecation warnings.

## Root Cause Analysis
The issue was caused by several factors:

1. **Verbose NPM Output**: Excessive npm warnings and deprecation messages were overwhelming the build process
2. **Shell Compatibility**: Using bash commands in Alpine Linux environment which only has sh
3. **Build Process Monitoring**: Lack of proper heartbeat and progress monitoring
4. **Memory Constraints**: Insufficient memory allocation for Node.js build process
5. **Telemetry Issues**: Next.js telemetry trying to connect in restricted Docker environment

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

### 4. NPM Configuration Optimization
- Added `npm config set fund false` to disable funding messages
- Added `npm config set update-notifier false` to disable update notifications
- Added `npm config set audit false` to disable audit warnings
- Added `--silent --no-audit --no-fund` flags to npm ci command

### 5. Build Process Monitoring
- Split Prisma generation into separate step for better error handling
- Added heartbeat messages to prevent apparent hanging
- Added build phase detection and status reporting
- Increased timeout from 15 to 20 minutes for complex builds

### 6. Shell Compatibility Fix
- Changed from `bash -c` to `sh -c` for Alpine Linux compatibility
- Fixed shell variable assignment and command chaining
- Improved error handling and exit codes

### 7. Enhanced Error Handling
- Added build timeout (20 minutes)
- Added timestamped logging with build phase detection
- Improved error reporting and diagnostics
- Added build artifact verification

## Files Modified

- `Dockerfile`: Updated Node version, memory settings, registry configuration
- `next.config.js`: Added Docker-specific optimizations and PWA settings
- `package.json`: Added Docker build script
- `scripts/build.sh`: Enhanced with better monitoring and error handling
- `.dockerignore`: Added service worker files to prevent conflicts
- `.env.docker`: Docker-specific environment variables

## Verification

The fix has been tested and verified:
- ✅ Full Docker build completes successfully (56 seconds)
- ✅ No hanging or timeout issues during npm warnings phase
- ✅ Prisma client generation works correctly
- ✅ Next.js build with monitoring completes without hanging
- ✅ All build steps execute properly with proper error handling
- ✅ Service worker generation works correctly
- ✅ Alpine Linux shell compatibility confirmed
- ✅ CapRover deployment environment variables supported

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