#!/bin/bash
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
npx prisma generate

# Build with enhanced monitoring and timeout protection
echo "🏗️  Starting Next.js build with PWA optimizations..."
echo "    This may take several minutes for PWA service worker generation..."

# Function to monitor build progress
monitor_build() {
  while IFS= read -r line; do
    echo "[BUILD] $line"
    
    # Check for PWA build stages
    if echo "$line" | grep -q "PWA.*Compile server"; then
      echo "[PWA] 📱 PWA server compilation started..."
    elif echo "$line" | grep -q "PWA.*Compile client"; then
      echo "[PWA] 🌐 PWA client compilation started..."
    elif echo "$line" | grep -q "PWA.*Service worker"; then
      echo "[PWA] ⚙️  Service worker generation in progress..."
    elif echo "$line" | grep -q "Checking validity of types"; then
      echo "[PWA] ✅ Type checking complete, PWA finalization next..."
    elif echo "$line" | grep -q "Collecting page data"; then
      echo "[PWA] 📄 Static page generation (including /offline)..."
    elif echo "$line" | grep -q "Generating static pages"; then
      echo "[PWA] 🎯 PWA build nearly complete..."
    elif echo "$line" | grep -q "Finalizing page optimization"; then
      echo "[PWA] 🚀 Build finalization in progress..."
    fi
  done
}

# Run build with timeout and progress monitoring
if timeout 1500 npm run build 2>&1 | monitor_build; then
  echo "✅ Build completed successfully!"
  
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
  
else
  exit_code=$?
  echo "❌ Build failed or timed out"
  echo "Exit code: $exit_code"
  
  # Show build artifacts for debugging
  echo "📁 Build artifacts check:"
  ls -la .next/ 2>/dev/null || echo "   No .next directory found"
  ls -la public/ 2>/dev/null || echo "   No public directory found"
  
  exit $exit_code
fi

echo "🎉 Docker build process completed successfully!"