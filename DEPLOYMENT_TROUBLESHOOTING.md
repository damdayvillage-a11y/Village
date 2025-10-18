# Deployment Troubleshooting Guide

Quick reference for common deployment issues and their solutions.

## 🚨 "No Space Left on Device" During Git Clone

**Error Message:**
```
Error: Cloning into '/captain/temp/image_raw/my-village-app/42/source_files'...
error: unable to write file src/app/user-panel/page.tsx
fatal: cannot create directory at 'src/app/village-tour': No space left on device
warning: Clone succeeded, but checkout failed.
```

**Cause:** CapRover server disk space is full

**Solution:**
1. **SSH into your CapRover server:**
   ```bash
   ssh your-caprover-server
   ```

2. **Check disk space:**
   ```bash
   df -h /
   ```

3. **Clean up Docker:**
   ```bash
   docker system prune -a -f
   docker volume prune -f
   docker builder prune -a -f
   ```

4. **Check space again:**
   ```bash
   df -h /
   ```
   
   ✅ You need at least **5GB free** before deploying

5. **Try deployment again:**
   ```bash
   git push caprover main
   ```

**Long-term fix:** Upgrade your server to have **40GB+ disk space**

📖 **Full guide:** See [GIT_CLONE_DISK_SPACE_FIX.md](./GIT_CLONE_DISK_SPACE_FIX.md)

---

## 🚨 "No Space Left on Device" During Docker Build

**Error Message:**
```
Error: (HTTP code 500) server error - write /memory2.md: no space left on device
```

**Cause:** Docker build process exhausted disk space

**Solution:**
1. Follow the git clone cleanup steps above first
2. Verify you're using `Dockerfile.simple` (check `captain-definition`)
3. Check `.dockerignore` excludes large files

📖 **Full guide:** See [DOCKER_DISK_SPACE_FIX.md](./DOCKER_DISK_SPACE_FIX.md)

---

## 🚨 Build Fails at `npm ci`

**Error Message:**
```
npm error A complete log of this run can be found in: /root/.npm/_logs/...
The command returned a non-zero code: 1
```

**Cause:** Missing build dependencies for `argon2` package

**Solution:**
Verify your Dockerfile includes:
```dockerfile
RUN apk add --no-cache python3 make g++ linux-headers
```

This is already in `Dockerfile.simple` - make sure you're using it.

📖 **Full guide:** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 🚨 Database Connection Errors

**Error Message:**
```
PrismaClientConstructorValidationError: Invalid datasource
```

**Cause:** DATABASE_URL not set correctly

**Solution:**
1. Go to CapRover → Your App → App Configs → Environment Variables
2. Set `DATABASE_URL` to your PostgreSQL connection string:
   ```
   postgresql://username:password@host:5432/database_name
   ```
3. Make sure there are no `$$cap_*$$` placeholders
4. Restart the app

📖 **Full guide:** See [CAPGUIDE.md](./docs/md-files/CAPGUIDE.md)

---

## 🚨 Admin 500 Error

**Error Message:**
Admin panel shows 500 Internal Server Error

**Cause:** Missing environment variables or admin user not seeded

**Solution:**

### English Help Page:
Visit: `https://your-app.com/help/admin-500`

### Hindi Help Page (हिंदी):
Visit: `https://your-app.com/help/admin-500-hi`

**Quick fix:**
1. Check `NEXTAUTH_SECRET` is set (min 32 chars)
2. Check `NEXTAUTH_URL` matches your app URL
3. Run seed script to create admin user:
   ```bash
   docker exec -it <container-id> npm run db:seed
   ```

📖 **Full guide:** See [docs/ADMIN_LOGIN_500_FIX.md](./docs/ADMIN_LOGIN_500_FIX.md)

---

## 🚨 Memory Issues During Build

**Error Message:**
```
JavaScript heap out of memory
```

**Cause:** Node.js ran out of memory during build

**Solution:**
1. Set in CapRover environment variables (custom app variable used by Dockerfile):
   ```
   BUILD_MEMORY_LIMIT=2048
   ```
   (Default is 1024MB, increase to 2048MB or 4096MB)

2. Make sure your VPS has at least 2GB RAM

---

## 🚨 Build Succeeds but App Crashes

**Symptoms:** Container starts but immediately exits

**Solution:**
1. Check environment variables are set:
   - `DATABASE_URL` ✅
   - `NEXTAUTH_SECRET` ✅ (min 32 characters)
   - `NEXTAUTH_URL` ✅ (your app URL)

2. Check logs in CapRover dashboard

3. Test database connection:
   ```bash
   docker exec -it <container-id> npm run db:test
   ```

---

## 📊 Server Requirements

### Minimum (for testing):
- **Disk**: 20GB free space
- **RAM**: 2GB
- **CPU**: 1 core

### Recommended (for production):
- **Disk**: 40GB+ total disk space (with at least 10GB free)
- **RAM**: 4GB+
- **CPU**: 2+ cores

---

## 🛠️ Preventive Maintenance

### Schedule Regular Cleanup

Add to your server's crontab:
```bash
# Edit crontab
sudo crontab -e

# Add this line (runs every Sunday at 2 AM)
# WARNING: This removes ALL unused Docker objects. Ensure you're okay with this.
# For production, consider removing '-f' flag to require confirmation.
0 2 * * 0 docker system prune -a -f && docker volume prune -f
```

### Monitor Disk Space

Check disk space regularly:
```bash
df -h /
```

Set up alerts when disk usage > 80%

---

## 📚 Related Documentation

### Deployment Guides:
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - General deployment
- [CAPGUIDE.md](./docs/md-files/CAPGUIDE.md) - CapRover specific
- [docker-compose.coolify.yml](./docker-compose.coolify.yml) - Coolify deployment

### Fix Guides:
- [GIT_CLONE_DISK_SPACE_FIX.md](./GIT_CLONE_DISK_SPACE_FIX.md) - Git clone disk space
- [DOCKER_DISK_SPACE_FIX.md](./DOCKER_DISK_SPACE_FIX.md) - Docker build disk space
- [DOCKER_FIX_SUMMARY.md](./DOCKER_FIX_SUMMARY.md) - Comprehensive fixes
- [docs/ADMIN_LOGIN_500_FIX.md](./docs/ADMIN_LOGIN_500_FIX.md) - Admin panel errors

### Optimization Guides:
- [BUILD_OPTIMIZATION_V2.md](./BUILD_OPTIMIZATION_V2.md) - Build optimizations
- [QUICK_FIX_V2.md](./QUICK_FIX_V2.md) - Quick reference

### Scripts:
- [scripts/caprover-cleanup.sh](./scripts/caprover-cleanup.sh) - Server cleanup
- [scripts/validate-docker-build.sh](./scripts/validate-docker-build.sh) - Pre-deployment validation

---

## 🆘 Getting Help

### Quick Diagnosis

Run the diagnostic script:
```bash
npm run diagnose
# or
npm run caprover:diagnose
```

### Check System Health

```bash
# Disk space
df -h /

# Docker disk usage
docker system df

# Running containers
docker ps

# Container logs
docker logs <container-id>

# App logs
docker logs $(docker ps | grep village | awk '{print $1}')
```

### Need More Help?

1. Check the specific error in CapRover logs
2. Review the relevant documentation guide above
3. Run diagnostics to get detailed information
4. Check environment variables are set correctly

---

## ✅ Pre-Deployment Checklist

Before deploying, verify:

- [ ] Server has 5GB+ free disk space (`df -h /`)
- [ ] Docker cleanup done recently
- [ ] Using `Dockerfile.simple` (check `captain-definition`)
- [ ] Environment variables set in CapRover:
  - [ ] `DATABASE_URL`
  - [ ] `NEXTAUTH_SECRET` (min 32 chars)
  - [ ] `NEXTAUTH_URL`
- [ ] Database is accessible from CapRover
- [ ] `.dockerignore` is present in repository
- [ ] Server has at least 2GB RAM

---

**Last Updated:** 2025-10-18  
**Version:** 1.0

For the most up-to-date information, always check the individual guide files.
