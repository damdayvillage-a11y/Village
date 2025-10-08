#!/bin/sh
set -e

echo "📦 NPM Install Debug Script for CapRover"
echo "⏰ Started at: $(date '+%Y-%m-%d %H:%M:%S UTC')"

# System information
echo "🖥️ System Information:"
echo "   OS: $(uname -a)"
echo "   Node: $(node --version)"
echo "   NPM: $(npm --version)"
echo "   Memory: $(free -h 2>/dev/null || echo 'Memory info not available')"
echo "   Disk: $(df -h . 2>/dev/null || echo 'Disk info not available')"

# Configure npm for debugging
echo "🔧 Configuring npm for debugging..."
npm config set strict-ssl false
npm config set registry https://registry.npmjs.org/
npm config set fund false
npm config set update-notifier false
npm config set audit false
npm config set progress true
npm config set loglevel info

echo "📋 NPM Configuration:"
npm config list | grep -E "(registry|loglevel|progress|fund|audit|strict-ssl)" || npm config list

# Check package.json
echo "📝 Checking package.json..."
if [ -f "package.json" ]; then
  echo "   ✅ package.json exists"
  echo "   Dependencies count: $(cat package.json | grep -o '"[^"]*":' | grep -v scripts | wc -l)"
else
  echo "   ❌ package.json not found!"
  exit 1
fi

if [ -f "package-lock.json" ]; then
  echo "   ✅ package-lock.json exists ($(wc -l < package-lock.json) lines)"
else
  echo "   ⚠️ package-lock.json not found - will generate during install"
fi

# Pre-install cleanup
echo "🧹 Pre-install cleanup..."
rm -rf node_modules package-lock.json npm-debug.log 2>/dev/null || true

# Install with comprehensive monitoring
echo "🚀 Starting npm ci with detailed monitoring..."
echo "⏰ Install started at: $(date '+%Y-%m-%d %H:%M:%S UTC')"

install_monitor() {
  local line_count=0
  local last_heartbeat=$(date +%s)
  local package_count=0
  
  while IFS= read -r line; do
    line_count=$((line_count + 1))
    current_time=$(date +%s)
    timestamp=$(date "+%H:%M:%S")
    
    # Always show the line for debugging
    echo "[$timestamp] NPM: $line"
    
    # Pattern matching for npm install phases
    case "$line" in
      *"added"*"packages"*)
        package_count=$(echo "$line" | grep -o "added [0-9]*" | grep -o "[0-9]*" || echo "0")
        echo "[$timestamp] PROGRESS: 📦 Installed $package_count packages (line $line_count)"
        ;;
      *"vulnerabilities"*)
        echo "[$timestamp] PROGRESS: 🔒 Security audit completed (line $line_count)"
        ;;
      *"funding"*)
        echo "[$timestamp] INFO: 💰 Funding information (ignored) (line $line_count)"
        ;;
      *"deprecated"*)
        echo "[$timestamp] WARNING: ⚠️ Deprecated package detected (line $line_count)"
        ;;
      *"WARN"*)
        echo "[$timestamp] WARNING: ⚠️ $line (line $line_count)"
        ;;
      *"ERROR"*|*"Error"*|*"error"*)
        echo "[$timestamp] ERROR: ❌ $line (line $line_count)"
        ;;
      *"gyp"*)
        echo "[$timestamp] BUILD: 🔧 Native module compilation (line $line_count)"
        ;;
      *"node-pre-gyp"*)
        echo "[$timestamp] BUILD: 📦 Pre-built binary download (line $line_count)"
        ;;
      "")
        # Heartbeat every 15 seconds for empty lines during install
        if [ $((current_time - last_heartbeat)) -gt 15 ]; then
          echo "[$timestamp] HEARTBEAT: npm install active (processed $line_count lines)"
          last_heartbeat=$current_time
        fi
        ;;
    esac
  done
  
  echo "[$timestamp] SUMMARY: Install monitoring completed, processed $line_count lines"
}

# Run npm ci with timeout and monitoring
if timeout 1800 npm ci --include=dev --no-audit --no-fund 2>&1 | install_monitor; then
  INSTALL_SUCCESS=true
else
  INSTALL_EXIT_CODE=$?
  INSTALL_SUCCESS=false
fi

echo "⏰ Install completed at: $(date '+%Y-%m-%d %H:%M:%S UTC')"

# Post-install analysis
if [ "$INSTALL_SUCCESS" = "true" ]; then
  echo "✅ npm ci completed successfully!"
  
  echo "📊 Installation Analysis:"
  if [ -d "node_modules" ]; then
    echo "   node_modules: ✅ Present"
    echo "   node_modules size: $(du -sh node_modules)"
    echo "   Top-level packages: $(ls node_modules | wc -l)"
  else
    echo "   node_modules: ❌ Missing"
  fi
  
  if [ -f "package-lock.json" ]; then
    echo "   package-lock.json: ✅ Generated/Updated"
  else
    echo "   package-lock.json: ❌ Missing"
  fi
  
else
  echo "❌ npm ci failed or timed out!"
  if [ -n "$INSTALL_EXIT_CODE" ]; then
    if [ "$INSTALL_EXIT_CODE" = "124" ]; then
      echo "   Reason: Install timed out after 30 minutes"
    else
      echo "   Exit code: $INSTALL_EXIT_CODE"
    fi
  fi
  
  echo "🔍 Debugging information:"
  echo "   Available memory: $(free -h 2>/dev/null || echo 'unknown')"
  echo "   Disk space: $(df -h . 2>/dev/null || echo 'unknown')"
  
  if [ -d "node_modules" ]; then
    echo "   Partial node_modules found: $(ls node_modules | wc -l) packages"
  else
    echo "   No node_modules directory found"
  fi
  
  if [ -f "npm-debug.log" ]; then
    echo "   Debug log available: npm-debug.log"
    echo "   Last 10 lines of npm-debug.log:"
    tail -10 npm-debug.log
  fi
  
  exit 1
fi

echo "🎉 NPM install debug completed successfully!"