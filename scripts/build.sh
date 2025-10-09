#!/bin/bash
set -e

echo "🚀 Starting enhanced build process for CapRover..."

# Set Node.js memory limits for build
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=4096 --max-semi-space-size=1024}"
export UV_THREADPOOL_SIZE="${UV_THREADPOOL_SIZE:-64}"

# Disable various verbose outputs that may cause hanging
export NEXT_TELEMETRY_DISABLED=1
export CI=true
export GENERATE_SOURCEMAP=false
export DISABLE_ESLINT=true

# Configure npm for stability
npm config set fund false
npm config set update-notifier false
npm config set audit false

# Source build environment if available
if [ -f ".env.build" ]; then
  echo "📝 Loading build environment variables..."
  export $(cat .env.build | grep -v '^#' | xargs)
fi

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm ci --silent --no-audit --no-fund
fi

# Generate Prisma client with dummy DATABASE_URL if not set
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  DATABASE_URL not set, using build-time dummy value..."
  export DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
fi

echo "🔧 Generating Prisma client..."
npx prisma generate

# Build the application with simple logging
echo "🏗️  Building application..."
echo "📊 Node memory limits: ${NODE_OPTIONS}"
echo "🔧 Thread pool size: ${UV_THREADPOOL_SIZE}"

# Check if we're in CapRover environment
if [ "$CAPROVER_BUILD" = "true" ] || [ "$CI" = "true" ]; then
  echo "🐳 Running in containerized environment (CapRover/CI)"
  export GENERATE_SOURCEMAP=false
  export TYPESCRIPT_NO_TYPE_CHECK=false
fi

# Run the build without timeout or complex pipes to avoid hangs
echo "🚀 Starting build..."
echo "Start time: $(date)"

npm run build:production

BUILD_EXIT_CODE=$?

if [ $BUILD_EXIT_CODE -ne 0 ]; then
  echo "❌ Build failed with exit code $BUILD_EXIT_CODE"
  echo "📋 Checking for build logs..."
  ls -la . | grep -E "\.(log|err)$" || echo "No log files found"
  exit 1
fi

echo "✅ Build completed successfully!"
echo "End time: $(date)"
echo "📁 Build artifacts:"
ls -la .next/ | head -10