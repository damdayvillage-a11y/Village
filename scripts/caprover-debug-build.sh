#!/bin/sh
set -e

echo "🐳 Starting CapRover debug build process..."
echo "⏰ Build started at: $(date '+%Y-%m-%d %H:%M:%S UTC')"

# Debug system information
echo "🖥️ System Information:"
echo "   OS: $(uname -a)"
echo "   Node: $(node --version)"
echo "   NPM: $(npm --version)"
echo "   Memory: $(free -h 2>/dev/null || echo 'Memory info not available')"
echo "   Disk: $(df -h . 2>/dev/null || echo 'Disk info not available')"

# Set comprehensive environment variables
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
export CI=true
export DISABLE_ESLINT_PLUGIN=true
export GENERATE_SOURCEMAP=false
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=4096 --max-semi-space-size=1024}"
export UV_THREADPOOL_SIZE="${UV_THREADPOOL_SIZE:-64}"
export NODE_TLS_REJECT_UNAUTHORIZED=0

# Set build-time dummy values if not provided
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  DATABASE_URL not set, using build-time dummy value..."
  export DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
  echo "⚠️  NEXTAUTH_SECRET not set, using build-time dummy value..."
  export NEXTAUTH_SECRET="dummy-secret-for-build-only-not-secure"
fi

if [ -z "$NEXTAUTH_URL" ]; then
  echo "⚠️  NEXTAUTH_URL not set, using build-time dummy value..."
  export NEXTAUTH_URL="http://localhost:3000"
fi

echo "🔧 Build Environment:"
echo "   NODE_OPTIONS: $NODE_OPTIONS"
echo "   UV_THREADPOOL_SIZE: $UV_THREADPOOL_SIZE"
echo "   NODE_ENV: $NODE_ENV"
echo "   CI: $CI"
echo "   CAPROVER_BUILD: ${CAPROVER_BUILD:-false}"

# Configure npm for maximum stability
echo "📝 Configuring npm..."
npm config set strict-ssl false
npm config set registry https://registry.npmjs.org/
npm config set fund false
npm config set update-notifier false
npm config set audit false
npm config set progress true
npm config set loglevel info

echo "📋 Current npm configuration:"
npm config list

# Check if dependencies need to be installed
if [ ! -d "node_modules" ]; then
  echo "❌ node_modules directory not found - this script expects dependencies to be pre-installed"
  exit 1
fi

echo "✅ Dependencies already installed, proceeding with build..."

# Generate Prisma client if not already done
echo "🔧 Ensuring Prisma client is generated..."
if [ ! -d "node_modules/.prisma" ]; then
  echo "📝 Generating Prisma client..."
  npx prisma generate
else
  echo "✅ Prisma client already exists"
fi

# Clean any existing build artifacts
echo "🧹 Cleaning previous build artifacts..."
rm -rf .next
mkdir -p public

# Pre-build checks
echo "🔍 Pre-build validation:"
echo "   Package.json exists: $(test -f package.json && echo 'Yes' || echo 'No')"
echo "   Next.config.js exists: $(test -f next.config.js && echo 'Yes' || echo 'No')"
echo "   Src directory exists: $(test -d src && echo 'Yes' || echo 'No')"
echo "   Public directory exists: $(test -d public && echo 'Yes' || echo 'No')"

# Function to monitor build with detailed logging
monitor_build_progress() {
  local line_count=0
  local last_heartbeat=$(date +%s)
  
  while IFS= read -r line; do
    line_count=$((line_count + 1))
    current_time=$(date +%s)
    timestamp=$(date "+%H:%M:%S")
    
    echo "[$timestamp] BUILD: $line"
    
    # Enhanced pattern matching for build phases
    case "$line" in
      *"Creating an optimized production build"*)
        echo "[$timestamp] PHASE: 🚀 Starting build process (line $line_count)"
        ;;
      *"PWA"*"Compile server"*)
        echo "[$timestamp] PHASE: 📱 PWA server compilation (line $line_count)"
        ;;
      *"PWA"*"Compile client"*)
        echo "[$timestamp] PHASE: 🌐 PWA client compilation (line $line_count)"
        ;;
      *"Compiled successfully"*)
        echo "[$timestamp] PHASE: ✅ Compilation successful (line $line_count)"
        ;;
      *"Skipping linting"*)
        echo "[$timestamp] PHASE: ⏭️ Linting skipped as configured (line $line_count)"
        ;;
      *"Checking validity of types"*)
        echo "[$timestamp] PHASE: 🔍 Type checking started (line $line_count)"
        ;;
      *"Collecting page data"*)
        echo "[$timestamp] PHASE: 📄 Page data collection started (line $line_count)"
        ;;
      *"Generating static pages"*)
        echo "[$timestamp] PHASE: 🎯 Static page generation (line $line_count)"
        ;;
      *"Collecting build traces"*)
        echo "[$timestamp] PHASE: 📋 Build traces collection (line $line_count)"
        ;;
      *"Finalizing page optimization"*)
        echo "[$timestamp] PHASE: 🚀 Final optimization phase (line $line_count)"
        ;;
      *"Route (app)"*)
        echo "[$timestamp] PHASE: 📊 Build statistics generation (line $line_count)"
        ;;
      "")
        # Heartbeat every 30 seconds for empty lines
        if [ $((current_time - last_heartbeat)) -gt 30 ]; then
          echo "[$timestamp] HEARTBEAT: Build active (processed $line_count lines)"
          last_heartbeat=$current_time
        fi
        ;;
      *"ERROR"*|*"Error"*|*"error"*)
        echo "[$timestamp] ERROR: $line (line $line_count)"
        ;;
      *"WARNING"*|*"Warning"*|*"warning"*)
        echo "[$timestamp] WARNING: $line (line $line_count)"
        ;;
    esac
  done
  
  echo "[$timestamp] SUMMARY: Build monitoring completed, processed $line_count lines"
}

# Run the build with comprehensive monitoring
echo "🏗️ Starting Next.js build with comprehensive monitoring..."
echo "⏰ Build command started at: $(date '+%Y-%m-%d %H:%M:%S UTC')"

if timeout 2400 npm run build:production 2>&1 | monitor_build_progress; then
  BUILD_SUCCESS=true
else
  BUILD_EXIT_CODE=$?
  BUILD_SUCCESS=false
fi

echo "⏰ Build monitoring completed at: $(date '+%Y-%m-%d %H:%M:%S UTC')"

# Post-build analysis
if [ "$BUILD_SUCCESS" = "true" ]; then
  echo "✅ Build completed successfully!"
  
  echo "📊 Build Analysis:"
  if [ -d ".next" ]; then
    echo "   .next directory: ✅ Present"
    echo "   .next size: $(du -sh .next)"
    echo "   .next contents:"
    ls -la .next/ | head -10
  else
    echo "   .next directory: ❌ Missing"
  fi
  
  if [ -f "public/sw.js" ]; then
    echo "   Service worker: ✅ Generated ($(wc -c < public/sw.js) bytes)"
  else
    echo "   Service worker: ⚠️ Not found"
  fi
  
  if ls public/workbox-*.js 1> /dev/null 2>&1; then
    echo "   Workbox files: ✅ Generated ($(ls public/workbox-*.js | wc -l) files)"
  else
    echo "   Workbox files: ⚠️ Not found"
  fi
  
else
  echo "❌ Build failed or timed out!"
  if [ -n "$BUILD_EXIT_CODE" ]; then
    if [ "$BUILD_EXIT_CODE" = "124" ]; then
      echo "   Reason: Build timed out after 40 minutes"
    else
      echo "   Exit code: $BUILD_EXIT_CODE"
    fi
  fi
  
  echo "🔍 Debugging information:"
  echo "   Available memory: $(free -h 2>/dev/null || echo 'unknown')"
  echo "   Disk space: $(df -h . 2>/dev/null || echo 'unknown')"
  
  if [ -d ".next" ]; then
    echo "   Partial .next directory found:"
    ls -la .next/ 2>/dev/null || echo "   Cannot list .next contents"
  else
    echo "   No .next directory found"
  fi
  
  exit 1
fi

echo "🎉 CapRover debug build process completed successfully!"
echo "⏰ Total build time: Build completed at $(date '+%Y-%m-%d %H:%M:%S UTC')"