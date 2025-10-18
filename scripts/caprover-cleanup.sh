#!/bin/bash
# CapRover Server Disk Space Optimizer
# Run this script on your CapRover server to free up disk space

set -e

echo "🧹 CapRover Disk Space Optimizer"
echo "================================"
echo ""

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo "⚠️  This script should be run as root for full functionality"
   echo "   Run: sudo bash $0"
   echo ""
fi

# Show current disk usage
echo "📊 Current Disk Usage:"
df -h / | tail -n 1
echo ""

# Show Docker disk usage
echo "🐳 Docker Disk Usage:"
docker system df
echo ""

# Ask for confirmation
read -p "Do you want to clean up Docker system? (y/N) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧹 Cleaning Docker system..."
    
    # Stop unused containers
    echo "Stopping unused containers..."
    docker container prune -f
    
    # Remove unused images
    echo "Removing unused images..."
    docker image prune -a -f --filter "until=24h"
    
    # Remove unused volumes
    echo "Removing unused volumes..."
    docker volume prune -f
    
    # Remove build cache
    echo "Removing build cache..."
    docker builder prune -a -f
    
    # Clean up networks
    echo "Cleaning up networks..."
    docker network prune -f
    
    echo "✅ Docker cleanup complete!"
    echo ""
fi

# Show disk usage after cleanup
echo "📊 Disk Usage After Cleanup:"
df -h / | tail -n 1
echo ""

# Show Docker disk usage after cleanup
echo "🐳 Docker Disk Usage After Cleanup:"
docker system df
echo ""

# Additional recommendations
echo "💡 Additional Recommendations:"
echo ""
echo "1. Schedule regular cleanup:"
echo "   Add to crontab: 0 2 * * 0 docker system prune -a -f"
echo ""
echo "2. Monitor disk usage:"
echo "   df -h"
echo ""
echo "3. Check large Docker objects:"
echo "   docker system df -v"
echo ""
echo "4. If disk space is still low (<2GB free), consider:"
echo "   - Upgrading to a larger VPS"
echo "   - Adding a separate volume for /var/lib/docker"
echo "   - Moving Docker data directory to external storage"
echo ""
echo "✅ Optimization complete!"
