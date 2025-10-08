#!/bin/bash
set -e

echo "🚀 Starting build process..."

# Set Node.js memory limits for build
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=4096 --max-semi-space-size=1024}"
export UV_THREADPOOL_SIZE="${UV_THREADPOOL_SIZE:-64}"

# Source build environment if available
if [ -f ".env.build" ]; then
  echo "📝 Loading build environment variables..."
  export $(cat .env.build | grep -v '^#' | xargs)
fi

# Ensure telemetry is disabled
export NEXT_TELEMETRY_DISABLED=1
export CI=true

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Generate Prisma client with dummy DATABASE_URL if not set
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  DATABASE_URL not set, using build-time dummy value..."
  export DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
fi

echo "🔧 Generating Prisma client..."
npx prisma generate

# Build the application with timeout and progress monitoring
echo "🏗️  Building application..."
echo "📊 Node memory limits: ${NODE_OPTIONS}"
echo "🔧 Thread pool size: ${UV_THREADPOOL_SIZE}"

# Run the build with timeout and verbose output
timeout 900 npm run build 2>&1 | while IFS= read -r line; do
  echo "[$(date '+%H:%M:%S')] $line"
done

if [ ${PIPESTATUS[0]} -eq 124 ]; then
  echo "❌ Build timed out after 15 minutes"
  exit 1
elif [ ${PIPESTATUS[0]} -ne 0 ]; then
  echo "❌ Build failed with exit code ${PIPESTATUS[0]}"
  exit 1
fi

echo "✅ Build completed successfully!"