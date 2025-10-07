#!/bin/bash
set -e

echo "🚀 Starting build process..."

# Source build environment if available
if [ -f ".env.build" ]; then
  echo "📝 Loading build environment variables..."
  export $(cat .env.build | grep -v '^#' | xargs)
fi

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

# Build the application
echo "🏗️  Building application..."
npm run build

echo "✅ Build completed successfully!"