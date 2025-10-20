#!/bin/bash
# Setup automatic Docker cleanup via cron
# Run this script on your server to enable automated cleanup

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLEANUP_SCRIPT="${SCRIPT_DIR}/auto-docker-cleanup.sh"

echo "🔧 Docker Cleanup Automation Setup"
echo "=================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  This script should be run as root for cron setup"
    echo "   Run: sudo bash $0"
    exit 1
fi

# Verify cleanup script exists
if [ ! -f "$CLEANUP_SCRIPT" ]; then
    echo "❌ Cleanup script not found at: $CLEANUP_SCRIPT"
    exit 1
fi

# Make cleanup script executable
chmod +x "$CLEANUP_SCRIPT"

# Create cron job entry
CRON_JOB="0 2 * * * $CLEANUP_SCRIPT >> /var/log/docker-cleanup.log 2>&1"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "$CLEANUP_SCRIPT"; then
    echo "✓ Cron job already exists for docker cleanup"
else
    # Add cron job
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    echo "✓ Added cron job: Daily cleanup at 2:00 AM"
fi

# Create log directory and file
touch /var/log/docker-cleanup.log
chmod 644 /var/log/docker-cleanup.log

echo ""
echo "✅ Setup Complete!"
echo ""
echo "Configuration:"
echo "  - Cleanup runs daily at 2:00 AM"
echo "  - Logs: /var/log/docker-cleanup.log"
echo "  - Script: $CLEANUP_SCRIPT"
echo ""
echo "Manual execution:"
echo "  sudo $CLEANUP_SCRIPT"
echo ""
echo "View scheduled jobs:"
echo "  crontab -l"
echo ""
echo "View cleanup logs:"
echo "  tail -f /var/log/docker-cleanup.log"
echo ""
echo "To change schedule, edit cron:"
echo "  crontab -e"
echo ""
