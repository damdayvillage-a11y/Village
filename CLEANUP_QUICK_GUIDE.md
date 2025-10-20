# Docker Cleanup - Quick Reference Guide

## 🚀 Quick Commands

### One-Time Setup
```bash
# SSH to your server
ssh root@your-server

# Navigate to app directory
cd /var/lib/docker/volumes/captain--my-village-app/_data

# Setup automated cleanup (runs daily at 2 AM)
sudo ./scripts/setup-auto-cleanup.sh
```

### Manual Cleanup
```bash
# Run cleanup anytime
sudo ./scripts/auto-docker-cleanup.sh

# View logs
tail -f /var/log/docker-cleanup.log

# Check disk usage
df -h
docker system df
```

## 📋 What Gets Cleaned

| Item | When | Details |
|------|------|---------|
| Stopped containers | Always | Safe to remove |
| Unused networks | Always | Safe to remove |
| Unused volumes | Always | ⚠️ May contain data |
| Dangling images | Always | Untagged intermediate images |
| Old images | When disk < 5GB | Images older than 48 hours |
| Build cache | When disk < 5GB | Docker build layer cache |
| Old logs | Always | Logs older than 7 days |

## ⚙️ Configuration

Edit `/scripts/auto-docker-cleanup.sh`:

```bash
MIN_FREE_SPACE_GB=5    # Trigger aggressive cleanup below 5GB
RETENTION_HOURS=48     # Keep images created in last 48 hours
```

## 📊 Monitoring

### Check Scheduled Jobs
```bash
crontab -l
```

### View Cleanup Logs
```bash
# Real-time log monitoring
tail -f /var/log/docker-cleanup.log

# View last 50 lines
tail -50 /var/log/docker-cleanup.log

# Search for errors
grep -i error /var/log/docker-cleanup.log
```

### Check Docker Disk Usage
```bash
# Summary
docker system df

# Detailed view
docker system df -v

# Disk space
df -h /
```

## 🔧 Troubleshooting

### Script Not Running
```bash
# Check if cron service is running
systemctl status cron

# Check cron logs
grep docker-cleanup /var/log/syslog
```

### Permission Denied
```bash
# Ensure script is executable
chmod +x /scripts/auto-docker-cleanup.sh

# Run with sudo
sudo /scripts/auto-docker-cleanup.sh
```

### Not Enough Space Freed
```bash
# Run aggressive cleanup manually
# Edit script to set AGGRESSIVE_CLEANUP=true

# Or manually prune everything
docker system prune -a -f --volumes
```

## ⚠️ Important Notes

1. **Volume Cleanup**: Be careful with volume cleanup - it may remove data
2. **Running Containers**: Never removes running containers
3. **Recent Images**: Keeps images from last 48 hours (configurable)
4. **Root Access**: Requires sudo/root for full functionality
5. **Logs**: All operations logged to `/var/log/docker-cleanup.log`

## 📅 Recommended Schedule

Default: Daily at 2:00 AM

To change schedule, edit cron:
```bash
crontab -e

# Examples:
# Every day at 3 AM:      0 3 * * * /path/to/script
# Twice daily (2AM, 2PM): 0 2,14 * * * /path/to/script
# Weekly on Sunday:       0 2 * * 0 /path/to/script
```

## 🎯 Before/After Deployment

### Before Deployment
```bash
# Check available space
df -h

# Run cleanup if needed
sudo ./scripts/auto-docker-cleanup.sh

# Verify space is available
df -h
```

### After Deployment
```bash
# Setup automated cleanup (one-time)
sudo ./scripts/setup-auto-cleanup.sh

# Verify cron job
crontab -l

# Monitor first run
tail -f /var/log/docker-cleanup.log
```

## 💡 Best Practices

1. ✅ Set up automated cleanup immediately after deployment
2. ✅ Monitor logs weekly for first month
3. ✅ Adjust retention settings based on your needs
4. ✅ Keep at least 10GB free for comfortable builds
5. ✅ Review cleanup logs before increasing build frequency

## 🆘 Emergency Cleanup

If build is failing due to disk space:

```bash
# 1. Immediate cleanup
docker system prune -a -f

# 2. Remove build cache
docker builder prune -a -f

# 3. Check space
df -h

# 4. If still low, remove all stopped containers
docker container prune -f

# 5. Last resort - remove unused volumes (⚠️ may lose data)
docker volume prune -f
```

## 📞 Support

If cleanup doesn't resolve issues:
1. Check server disk allocation
2. Consider upgrading server storage
3. Review application log sizes
4. Check for other disk-consuming processes

---

**Remember**: Prevention is better than cure! Set up automated cleanup from day one.
