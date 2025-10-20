#!/bin/bash
# Automated Docker Cleanup Script for CapRover/Production
# This script automatically cleans up Docker resources to prevent disk space issues
# Can be run manually or scheduled via cron

set -e

# Configuration
LOG_FILE="/var/log/docker-cleanup.log"
MIN_FREE_SPACE_GB=5  # Minimum free space in GB before triggering aggressive cleanup
RETENTION_HOURS=48   # Keep images created in last 48 hours

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to log messages
log() {
    local message="[$(date +'%Y-%m-%d %H:%M:%S')] $1"
    echo -e "$message"
    # Try to write to log file if we have permission
    echo "$message" >> "$LOG_FILE" 2>/dev/null || true
}

# Function to check disk space
check_disk_space() {
    local available_kb=$(df / | tail -1 | awk '{print $4}')
    local available_gb=$((available_kb / 1024 / 1024))
    echo $available_gb
}

# Function to get Docker disk usage in GB
get_docker_disk_usage() {
    docker system df --format "{{.Type}}\t{{.Size}}" 2>/dev/null | \
    awk '{gsub(/[^0-9.]/, "", $2); sum += $2} END {print sum}'
}

log "${GREEN}🧹 Starting Automated Docker Cleanup${NC}"
log "================================"

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    log "${RED}❌ Docker is not installed or not in PATH${NC}"
    exit 1
fi

# Check Docker daemon
if ! docker info &> /dev/null; then
    log "${RED}❌ Docker daemon is not running${NC}"
    exit 1
fi

# Display initial status
INITIAL_FREE_SPACE=$(check_disk_space)
INITIAL_DOCKER_USAGE=$(get_docker_disk_usage)

log "${YELLOW}📊 Initial Status:${NC}"
log "   Free disk space: ${INITIAL_FREE_SPACE}GB"
log "   Docker disk usage: ${INITIAL_DOCKER_USAGE}GB"
log ""

# Determine cleanup level based on available space
if [ "$INITIAL_FREE_SPACE" -lt "$MIN_FREE_SPACE_GB" ]; then
    AGGRESSIVE_CLEANUP=true
    log "${RED}⚠️  Low disk space detected (< ${MIN_FREE_SPACE_GB}GB)${NC}"
    log "   Performing aggressive cleanup..."
else
    AGGRESSIVE_CLEANUP=false
    log "${GREEN}✓ Sufficient disk space available${NC}"
    log "   Performing standard cleanup..."
fi
log ""

# Step 1: Remove stopped containers
log "🗑️  Removing stopped containers..."
REMOVED_CONTAINERS=$(docker container prune -f 2>&1 | grep "Total reclaimed space" || echo "0B")
log "   ${REMOVED_CONTAINERS}"

# Step 2: Remove unused networks
log "🌐 Cleaning unused networks..."
REMOVED_NETWORKS=$(docker network prune -f 2>&1 | grep "deleted" || echo "None")
log "   ${REMOVED_NETWORKS}"

# Step 3: Remove unused volumes (be careful with this)
log "💾 Removing unused volumes..."
REMOVED_VOLUMES=$(docker volume prune -f 2>&1 | grep "Total reclaimed space" || echo "0B")
log "   ${REMOVED_VOLUMES}"

# Step 4: Remove dangling images
log "🖼️  Removing dangling images..."
REMOVED_DANGLING=$(docker image prune -f 2>&1 | grep "Total reclaimed space" || echo "0B")
log "   ${REMOVED_DANGLING}"

# Step 5: Remove old images (aggressive cleanup only)
if [ "$AGGRESSIVE_CLEANUP" = true ]; then
    log "🗄️  Removing images older than ${RETENTION_HOURS} hours..."
    REMOVED_OLD_IMAGES=$(docker image prune -a -f --filter "until=${RETENTION_HOURS}h" 2>&1 | grep "Total reclaimed space" || echo "0B")
    log "   ${REMOVED_OLD_IMAGES}"
fi

# Step 6: Remove build cache (aggressive cleanup only)
if [ "$AGGRESSIVE_CLEANUP" = true ]; then
    log "🏗️  Removing build cache..."
    REMOVED_BUILD_CACHE=$(docker builder prune -a -f 2>&1 | grep "Total reclaimed space" || echo "0B")
    log "   ${REMOVED_BUILD_CACHE}"
else
    # Remove only dangling build cache
    log "🏗️  Removing dangling build cache..."
    REMOVED_BUILD_CACHE=$(docker builder prune -f 2>&1 | grep "Total reclaimed space" || echo "0B")
    log "   ${REMOVED_BUILD_CACHE}"
fi

# Step 7: Clean up old logs (if running as root)
if [ "$EUID" -eq 0 ]; then
    log "📝 Cleaning Docker logs..."
    find /var/lib/docker/containers/ -name "*.log" -type f -mtime +7 -delete 2>/dev/null || true
    log "   ✓ Removed logs older than 7 days"
fi

# Display final status
FINAL_FREE_SPACE=$(check_disk_space)
FINAL_DOCKER_USAGE=$(get_docker_disk_usage)
SPACE_FREED=$((INITIAL_FREE_SPACE - FINAL_FREE_SPACE))

log ""
log "${GREEN}📊 Final Status:${NC}"
log "   Free disk space: ${FINAL_FREE_SPACE}GB (was ${INITIAL_FREE_SPACE}GB)"
log "   Docker disk usage: ${FINAL_DOCKER_USAGE}GB (was ${INITIAL_DOCKER_USAGE}GB)"

if [ "$FINAL_FREE_SPACE" -gt "$INITIAL_FREE_SPACE" ]; then
    SPACE_RECOVERED=$((FINAL_FREE_SPACE - INITIAL_FREE_SPACE))
    log "${GREEN}   ✓ Recovered ${SPACE_RECOVERED}GB of disk space${NC}"
else
    log "${YELLOW}   ℹ Minimal space recovered${NC}"
fi

log ""
log "${GREEN}✅ Cleanup Complete!${NC}"

# Final warning if still low on space
if [ "$FINAL_FREE_SPACE" -lt "$MIN_FREE_SPACE_GB" ]; then
    log ""
    log "${RED}⚠️  WARNING: Still low on disk space!${NC}"
    log "${YELLOW}Consider:${NC}"
    log "   1. Upgrading server storage"
    log "   2. Moving Docker data to separate volume"
    log "   3. Removing unused applications"
    log "   4. Checking for large log files: find /var/log -type f -size +100M"
fi

# Provide usage statistics
log ""
log "${YELLOW}💡 Docker System Information:${NC}"
docker system df

exit 0
