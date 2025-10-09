#!/bin/sh
set -e

echo "🐳 Starting Docker-optimized build process..."

# Set Docker-specific environment variables
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
export CI=true
export DISABLE_ESLINT_PLUGIN=true

# Set Node.js memory limits for containerized builds
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=4096 --max-semi-space-size=1024}"
export UV_THREADPOOL_SIZE="${UV_THREADPOOL_SIZE:-64}"

echo "📊 Build environment:"
echo "   Node memory: ${NODE_OPTIONS}"
echo "   Thread pool: ${UV_THREADPOOL_SIZE}"
echo "   PWA mode: ${NODE_ENV}"

# Clean any existing service worker files to prevent conflicts
echo "🧹 Cleaning existing PWA files..."
rm -f public/sw.js public/workbox-*.js public/fallback-*.js 2>/dev/null || true

# Create public directory if it doesn't exist
mkdir -p public

# Generate Prisma client with dummy DATABASE_URL if not set
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  DATABASE_URL not set, using build-time dummy value..."
  export DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
fi

echo "🔧 Generating Prisma client..."
node node_modules/prisma/build/index.js generate

# Build without timeout or complex pipes to avoid hangs
echo "🏗️  Starting Next.js build with PWA optimizations..."
echo "    This may take several minutes for PWA service worker generation..."
echo "Start time: $(date)"

# Run build directly without timeout or monitoring loops
npm run build

BUILD_EXIT_CODE=$?

if [ $BUILD_EXIT_CODE -ne 0 ]; then
  echo "❌ Build failed with exit code $BUILD_EXIT_CODE"
  
  # Show build artifacts for debugging
  echo "📁 Build artifacts check:"
  ls -la .next/ 2>/dev/null || echo "   No .next directory found"
  ls -la public/ 2>/dev/null || echo "   No public directory found"
  
  exit $BUILD_EXIT_CODE
fi

echo "✅ Build completed successfully!"
echo "End time: $(date)"

# Verify PWA files were generated
if [ -f "public/sw.js" ]; then
  echo "✅ Service worker generated: $(wc -c < public/sw.js) bytes"
else
  echo "⚠️  Service worker not found, but build succeeded"
fi

if ls public/workbox-*.js 1> /dev/null 2>&1; then
  echo "✅ Workbox files generated: $(ls public/workbox-*.js | wc -l) files"
else
  echo "⚠️  Workbox files not found, but build succeeded"
fi

echo "🎉 Docker build process completed successfully!"