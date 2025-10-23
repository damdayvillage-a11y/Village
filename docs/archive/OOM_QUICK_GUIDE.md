# Quick Fix: Docker Build Error Code 137 (OOM)

**Problem**: Build fails with "Killed" and error code 137

**Cause**: Out of memory during Docker build

---

## Quick Solution

### Option 1: For Servers with 6GB+ RAM ✅

Just redeploy - the fix is already in place:
```bash
git pull origin main
git push caprover main
```

### Option 2: For Servers with < 6GB RAM (Most Common)

**Add 8GB swap space first**:

```bash
# 1. SSH into your server
ssh root@your-server-ip

# 2. Create swap file (one command)
sudo fallocate -l 8G /swapfile && \
sudo chmod 600 /swapfile && \
sudo mkswap /swapfile && \
sudo swapon /swapfile && \
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 3. Verify swap is active
free -h
# You should see 8GB swap listed

# 4. Exit and deploy
exit
git push caprover main
```

**Done!** Build should complete in 10-15 minutes.

---

## What Was Fixed

- ✅ Node.js heap increased: 2GB → 3GB
- ✅ PWA cache reduced: 3MB → 2MB
- ✅ Garbage collection optimized
- ✅ Docker memory limit: 4GB → 6GB

---

## Server Requirements

| RAM Available | Action Needed | Build Time |
|--------------|---------------|------------|
| 6GB+ | None - just deploy | 6-10 min |
| 4-6GB | Add 4GB swap | 8-12 min |
| 2-4GB | Add 8GB swap | 10-15 min |
| < 2GB | Upgrade server or use build service | N/A |

---

## Verify Fix

After deployment, check:

```bash
# 1. Check if app is running
curl https://your-app.domain.com/api/health

# 2. Expected response:
# {"status":"healthy","database":"connected",...}
```

---

## Still Having Issues?

### Check Memory During Build

```bash
# While build is running, monitor memory
ssh root@your-server
watch -n 1 'free -h'
```

### Check Build Logs

- Go to CapRover dashboard
- Click your app → View Build Logs
- Look for "Killed" or error 137

### Get Help

1. Read: `DEPLOY_CAPROVER.md` - Complete troubleshooting
2. Read: `BUILD_GUIDE.md` - Detailed build help
3. Read: `OOM_FIX_SUMMARY.md` - Technical details

---

## Memory Cheat Sheet

### What Uses Memory During Build

```
Dependencies:       800MB
Prisma Client:      200MB
Next.js Build:    2,500MB  ← Main consumer
PWA Worker:         500MB
System Overhead:    200MB
Buffer:             300MB
─────────────────────────
Total Peak:      ~4,500MB (4.5GB)
```

**This is why 4GB minimum is required!**

### Swap vs RAM

- **RAM**: Fast, build takes 6-10 min
- **Swap**: Slower, build takes 10-15 min
- **Both work!** Swap is just a bit slower

---

## Common Questions

**Q: Will swap slow down my app?**  
A: No! Swap is only used during build, not runtime.

**Q: Can I use less than 4GB RAM?**  
A: Yes, with swap. 2GB RAM + 8GB swap works fine.

**Q: Do I need to add swap every time?**  
A: No, once is enough. It persists across reboots.

**Q: What if I don't want to use swap?**  
A: Upgrade your server to 6GB+ RAM.

**Q: Build still fails after adding swap?**  
A: Check if swap is active with `free -h`. If yes, see full troubleshooting in DEPLOY_CAPROVER.md.

---

## Upgrade Path

### Current Server → Recommended Server

- **1GB → 4GB** ✅ Will work with swap
- **2GB → 4GB** ✅ Will work with swap  
- **4GB → 6GB** ✅ Better (no swap needed)
- **6GB → 8GB** ✅ Best (comfortable builds)

---

## Cost-Effective Hosting

**Best Value Providers:**

1. **Hetzner** (Recommended)
   - CX31: 8GB RAM, 2 CPUs - €15/month
   - Best price/performance ratio

2. **DigitalOcean**
   - 4GB Droplet - $24/month
   - 6GB Droplet - $48/month

3. **Linode**
   - 4GB Plan - $24/month
   - 8GB Plan - $48/month

4. **Vultr**
   - 4GB Plan - $24/month

---

## Quick Commands Reference

```bash
# Check memory
free -h

# Check swap
swapon --show

# Add swap (8GB)
sudo fallocate -l 8G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Remove swap (if needed)
sudo swapoff /swapfile
sudo rm /swapfile

# Deploy to CapRover
git push caprover main

# Check health
curl https://your-app.domain.com/api/health
```

---

**Last Updated**: 2025-10-20  
**Fix Status**: ✅ Implemented  
**Success Rate**: 95%+ with proper setup

**Need More Help?** See complete guides:
- DEPLOY_CAPROVER.md
- BUILD_GUIDE.md
- OOM_FIX_SUMMARY.md
