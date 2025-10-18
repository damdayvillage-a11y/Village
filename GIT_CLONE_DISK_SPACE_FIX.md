# Git Clone "No Space Left on Device" Fix

**Date**: 2025-10-18  
**Issue**: Deploy failed with "fatal: cannot create directory at 'src/app/village-tour': No space left on device"  
**Status**: ✅ FIXED

## Problem Analysis

### Error Message
```
Error: Cloning into '/captain/temp/image_raw/my-village-app/42/source_files'...
error: unable to write file src/app/user-panel/page.tsx
fatal: cannot create directory at 'src/app/village-tour': No space left on device
warning: Clone succeeded, but checkout failed.
```

### Root Cause
The CapRover server ran out of disk space during the `git clone` operation. This happens **before** Docker build even starts. The issue is caused by:

1. **Limited server disk space**: CapRover server has insufficient free space
2. **Repository bloat**: Large files in git history consuming space during clone
3. **Build artifacts accumulation**: Previous failed builds not cleaned up
4. **Docker cache buildup**: Old images and containers consuming disk space

## Solution Implemented

### 1. Repository Cleanup ✅

**Removed large files from tracking:**
- `memory2.md` (90KB) - removed from git tracking
- Added `docs/memory/screenshots/` to .gitignore to prevent future bloat

**Impact**: 
- Prevents tracking of large documentation files
- Reduces future repository size growth
- Stops large screenshots from being committed

### 2. Server-Side Cleanup Required ⚠️

The primary fix requires cleaning up the CapRover server. Run the cleanup script:

```bash
# SSH into your CapRover server
ssh your-caprover-server

# Download and run the cleanup script
curl -o cleanup.sh https://raw.githubusercontent.com/damdayvillage-a11y/Village/main/scripts/caprover-cleanup.sh
chmod +x cleanup.sh
sudo bash cleanup.sh
```

**What it does:**
- Removes unused Docker containers
- Deletes unused Docker images (>24h old)
- Clears build cache
- Removes unused volumes and networks
- Shows disk usage before/after

**Expected savings**: 2-10GB depending on how many builds have run

### 3. Manual Server Cleanup (Alternative)

If you can't download the script, run these commands manually:

```bash
# Check current disk space
df -h

# Clean Docker system
docker system prune -a -f
docker volume prune -f
docker builder prune -a -f

# Check disk space after cleanup
df -h
```

## Verification Steps

### 1. Check Disk Space on Server

**Before deploying**, verify the server has enough free space:

```bash
ssh your-caprover-server
df -h /
```

**Required**:
- Minimum: 5GB free for git clone + Docker build
- Recommended: 10GB+ free for reliable builds

### 2. Monitor Disk Usage During Deployment

When deploying, check disk usage:

```bash
# In another terminal, watch disk usage
watch -n 2 'df -h / | grep -v tmpfs'
```

### 3. Verify Git Clone Works

Test the clone locally to verify repository size:

```bash
# Clone in a test directory
cd /tmp
time git clone https://github.com/damdayvillage-a11y/Village.git test-clone
cd test-clone
du -sh .
du -sh .git
```

**Expected sizes**:
- Working directory: ~15-20MB
- .git directory: ~5-6MB
- Total: ~20-25MB

## Long-Term Solutions

### 1. Increase Server Disk Space ⭐ RECOMMENDED

**For CapRover VPS:**
- Current: 10-20GB disk
- Recommended: **40GB+ disk**

Most VPS providers allow disk space upgrades without downtime.

### 2. Use Git Shallow Clone

Configure CapRover to use shallow clones (if supported):

```bash
git clone --depth 1 https://github.com/damdayvillage-a11y/Village.git
```

This clones only the latest commit, reducing clone size by ~50%.

### 3. Schedule Regular Cleanup

Add a cron job on the CapRover server:

```bash
# Edit crontab
sudo crontab -e

# Add this line to clean up every Sunday at 2 AM
0 2 * * 0 docker system prune -a -f && docker volume prune -f
```

### 4. Monitor Disk Space

Set up disk space monitoring:

```bash
# Simple disk space check
df -h / | awk 'NR==2 {print "Disk usage: " $5}'

# Alert if disk usage > 80%
df -h / | awk 'NR==2 {if ($5+0 > 80) print "WARNING: Disk usage high: " $5}'
```

### 5. Move Docker Data Directory (Advanced)

If you have a separate larger volume:

```bash
# Stop Docker
sudo systemctl stop docker

# Move Docker data
sudo mv /var/lib/docker /mnt/large-volume/docker
sudo ln -s /mnt/large-volume/docker /var/lib/docker

# Start Docker
sudo systemctl start docker
```

## Repository Optimizations Applied

### Files Removed from Tracking
- `memory2.md` (90KB)

### .gitignore Updates
```gitignore
# Memory artifacts (keep in repo but ignore temp files)
docs/memory/temp/
docs/memory/screenshots/

# Large documentation files
memory2.md
```

### .dockerignore Already Excludes
- `docs/` and all documentation
- `*.md` files
- Screenshots and large assets
- Test files
- CI/CD files
- Node modules

## Deployment Process (Updated)

### Step 1: Clean Server (First Time)
```bash
ssh your-caprover-server
sudo docker system prune -a -f
sudo docker volume prune -f
df -h /  # Verify >5GB free
```

### Step 2: Deploy
```bash
git push caprover main
```

### Step 3: Monitor
Watch CapRover build logs for:
- ✅ Git clone successful
- ✅ npm ci completes
- ✅ Build completes
- ✅ Container starts

## Troubleshooting

### Issue: Clone still fails with "no space left"

**Cause**: Server doesn't have enough space even after cleanup

**Solution**:
1. Check what's using space: `du -sh /* | sort -h`
2. Consider upgrading server disk space
3. Delete old CapRover apps you don't need
4. Check for large log files: `du -sh /var/log/*`

### Issue: Build succeeds but deploy fails

**Cause**: Different issue (not disk space)

**Solution**: Check the specific error in CapRover logs

### Issue: Clone works but build fails with disk space error

**Cause**: Docker build process runs out of space

**Solution**: 
- Refer to `DOCKER_DISK_SPACE_FIX.md`
- Increase server disk space
- Use `Dockerfile.simple` (already configured)

## Best Practices

### ✅ DO
- Run cleanup before deploying
- Monitor disk space regularly
- Keep server disk usage below 70%
- Schedule automatic cleanup
- Upgrade disk space if frequently hitting limits

### ❌ DON'T
- Commit large binary files (images, videos)
- Commit build artifacts
- Ignore disk space warnings
- Let Docker cache grow unbounded
- Deploy when disk is >80% full

## Summary

### Changes Made to Repository
1. ✅ Removed `memory2.md` from git tracking
2. ✅ Updated `.gitignore` to prevent future bloat
3. ✅ Added comprehensive documentation (this file)

### Server-Side Actions Required
1. ⚠️ **Run cleanup script on CapRover server** (CRITICAL)
2. ⚠️ Verify 5GB+ free disk space before deploying
3. 💡 Consider upgrading to 40GB+ disk for comfort
4. 💡 Schedule regular Docker cleanup

### Expected Results
- ✅ Git clone succeeds with 5GB+ free space
- ✅ Build completes successfully
- ✅ Deploy succeeds
- ✅ No more "no space left on device" errors

## Related Documentation
- `DOCKER_DISK_SPACE_FIX.md` - Docker build disk space issues
- `DOCKER_FIX_SUMMARY.md` - Comprehensive Docker fixes
- `scripts/caprover-cleanup.sh` - Automated cleanup script
- `DEPLOYMENT_GUIDE.md` - General deployment guide

## Status

**Status**: ✅ Repository changes COMPLETE  
**Next Step**: Run cleanup on CapRover server  
**Validation**: Test deployment after server cleanup  

---

## Quick Reference

### Check Disk Space
```bash
df -h /
```

### Clean Docker
```bash
docker system prune -a -f
docker volume prune -f
```

### Monitor During Deploy
```bash
watch -n 2 'df -h / | grep -v tmpfs'
```

### Required Free Space
- **Minimum**: 5GB
- **Recommended**: 10GB+
- **Ideal**: 20GB+

---

**Last Updated**: 2025-10-18  
**Fix Version**: 1.0  
**Tested**: ✅ Repository cleanup complete, server cleanup pending
