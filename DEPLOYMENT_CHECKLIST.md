# Deployment Checklist - Post Cleanup

**Date**: 2025-10-18  
**Repository**: damdayvillage-a11y/Village  
**Branch**: copilot/debug-fix-deploy-issues  
**Status**: Ready for Deployment Testing

## Pre-Deployment Verification ✅

### Repository Cleanup Complete
- [x] Removed 16 screenshot files (4.6MB)
- [x] Removed 15 redundant documentation files
- [x] Removed 3 unused Dockerfile variants
- [x] Updated .gitignore to prevent future bloat
- [x] Updated .dockerignore
- [x] Updated documentation references
- [x] Repository size reduced by 27%

### Build Configuration Verified
- [x] `captain-definition` points to `Dockerfile.simple`
- [x] `Dockerfile.simple` exists and is valid
- [x] Required scripts exist:
  - `scripts/docker-entrypoint.sh`
  - `scripts/startup-check.js`
  - `scripts/seed.ts`
- [x] `next.config.js` configured correctly
- [x] `package.json` build scripts present

### Files Integrity Check
- [x] All source code intact (`src/`, `lib/`, `prisma/`)
- [x] Configuration files intact
- [x] Dependencies unchanged
- [x] Essential documentation preserved

## CapRover Server Preparation

### Before Deployment, Run on Server:

```bash
# SSH into your CapRover server
ssh your-caprover-server

# 1. Check available disk space
df -h /

# Should show at least 10GB free
# If less than 10GB, run cleanup:

# 2. Clean Docker system
docker system prune -a -f
docker volume prune -f
docker builder prune -a -f

# 3. Verify disk space after cleanup
df -h /

# 4. Check Docker service is running
docker ps

# 5. Optional: Check server resources
free -h
top -bn1 | head -15
```

### Expected Server State:
- Minimum 10GB free disk space
- Docker service running
- Network connectivity to GitHub
- PostgreSQL database available (if deploying with database)

## Deployment Environment Variables

### Required Variables (Set in CapRover):

```env
# Node Environment
NODE_ENV=production

# NextAuth Configuration
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=https://your-domain.com

# Database Configuration
DATABASE_URL=postgresql://username:password@host:5432/database_name

# Build Optimization
NEXT_TELEMETRY_DISABLED=1
CI=true
DISABLE_ESLINT_PLUGIN=true
GENERATE_SOURCEMAP=false
TYPESCRIPT_NO_TYPE_CHECK=true

# Optional: Build Memory Limit
BUILD_MEMORY_LIMIT=1024
```

### Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## Deployment Process

### Step 1: Push to GitHub
```bash
# From local repository
git push origin copilot/debug-fix-deploy-issues
```

### Step 2: Deploy to CapRover

**Option A: Via Git Push**
```bash
git push caprover copilot/debug-fix-deploy-issues:main
```

**Option B: Via CapRover Dashboard**
1. Go to CapRover dashboard
2. Navigate to your app
3. Click "Deployment" tab
4. Select "Deploy from GitHub"
5. Choose repository and branch

### Step 3: Monitor Deployment

Watch for these stages in CapRover logs:

1. **Git Clone** ✅
   ```
   Cloning into '/captain/temp/image_raw/...'
   ```
   - Should complete without "no space left" error

2. **Docker Build Start** ✅
   ```
   Step 1/X : FROM node:20-alpine AS deps
   ```

3. **NPM Install** ✅
   ```
   📦 Installing dependencies...
   ```
   - Should complete in 2-5 minutes

4. **Prisma Generate** ✅
   ```
   🔧 Generating Prisma client...
   ```

5. **Next.js Build** ✅
   ```
   🏗️ Building application...
   ```
   - Should complete in 3-8 minutes

6. **Container Start** ✅
   ```
   🚀 Starting Damday Village application...
   ```

### Step 4: Post-Deployment Verification

```bash
# 1. Check if app is running
curl https://your-domain.com

# 2. Check health endpoint (if available)
curl https://your-domain.com/api/health

# 3. Check admin panel
curl https://your-domain.com/admin-panel

# 4. Monitor logs
# In CapRover dashboard, check "App Logs"
```

## Troubleshooting Guide

### Issue: Git Clone Fails with "No Space Left"

**Cause**: Server disk space still insufficient

**Solution**:
```bash
# 1. Check disk space
df -h /

# 2. Find what's using space
du -sh /var/lib/docker/* | sort -h | tail -10

# 3. Clean Docker more aggressively
docker system prune -a -f --volumes
docker builder prune -a -f

# 4. Check if old builds are accumulated
docker images | grep my-village-app

# 5. Remove old images
docker rmi $(docker images 'my-village-app' -q)

# 6. Verify space after cleanup
df -h /
```

### Issue: Build Hangs at npm ci

**Cause**: Network issues or npm registry problems

**Solution**:
```bash
# In Dockerfile.simple, npm is configured with:
# - registry: https://registry.npmjs.org/
# - strict-ssl: false
# - loglevel: error

# Check CapRover server network:
curl -I https://registry.npmjs.org/

# If needed, restart Docker:
sudo systemctl restart docker
```

### Issue: Build Hangs at "Checking Validity of Types"

**Cause**: TypeScript type checking enabled

**Solution**:
This should already be handled by environment variables in Dockerfile.simple:
- `TYPESCRIPT_NO_TYPE_CHECK=true`
- `DISABLE_ESLINT_PLUGIN=true`

If still happening, verify these are set in CapRover app environment.

### Issue: Prisma Generate Fails

**Cause**: Prisma schema issues or missing dependencies

**Solution**:
1. Check prisma schema is valid locally:
   ```bash
   npx prisma validate
   ```

2. Verify DATABASE_URL is set (even dummy value works for build):
   ```
   DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
   ```

### Issue: Build Succeeds but Container Fails to Start

**Cause**: Missing environment variables or database connection issues

**Solution**:
1. Check required environment variables are set in CapRover
2. Verify DATABASE_URL points to accessible database
3. Check NEXTAUTH_SECRET is at least 32 characters
4. Verify NEXTAUTH_URL matches your domain

## Success Indicators

### Deployment Successful When:
- ✅ Git clone completes without errors
- ✅ npm ci completes in 2-5 minutes
- ✅ Prisma client generates successfully
- ✅ Next.js build completes in 3-8 minutes
- ✅ Container starts and listens on port 80
- ✅ Homepage loads at https://your-domain.com
- ✅ No errors in CapRover app logs

### Expected Build Time:
- **Minimum**: 6 minutes
- **Average**: 8-10 minutes
- **Maximum**: 15 minutes

### Expected Disk Usage During Build:
- **Git Clone**: ~15MB
- **npm ci**: ~300MB
- **Next.js Build**: ~500MB
- **Final Image**: ~350MB
- **Peak Usage**: ~800MB

## Post-Deployment Tasks

### 1. Database Setup (if first deployment)

```bash
# Run migrations
docker exec -it <container-name> sh -c "npx prisma migrate deploy"

# Seed database (optional)
docker exec -it <container-name> sh -c "npx tsx scripts/seed.ts"
```

### 2. Verify Admin Login

```
URL: https://your-domain.com/auth/signin
Email: admin@damdayvillage.org
Password: Admin@123

⚠️ Change the password immediately after first login!
```

### 3. Configure Domain & SSL

1. In CapRover dashboard, go to app settings
2. Enable HTTPS
3. Force HTTPS
4. Add custom domain (if needed)
5. Enable HTTP to HTTPS redirect

### 4. Monitor Resource Usage

```bash
# Check container resources
docker stats <container-name>

# Check disk space
df -h /

# Check app logs
# Use CapRover dashboard "App Logs" tab
```

### 5. Schedule Regular Cleanup

```bash
# Add to server crontab
sudo crontab -e

# Add this line for weekly cleanup:
0 2 * * 0 docker system prune -a -f && docker volume prune -f
```

## Rollback Plan

If deployment fails and you need to rollback:

### Option 1: Via CapRover Dashboard
1. Go to app deployment history
2. Click "Redeploy" on previous successful version

### Option 2: Via Git
```bash
# Find last working commit
git log --oneline

# Deploy specific commit
git push caprover <commit-hash>:main
```

## Documentation References

- [Repository Cleanup Summary](./REPOSITORY_CLEANUP_SUMMARY.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [CapRover Troubleshooting](./docs/CAPROVER_TROUBLESHOOTING.md)
- [Environment Variables](./docs/md-files/ENVIRONMENT_VARIABLES.md)

## Support and Resources

- **Documentation**: See `/docs` directory for additional guides
- **SSH Commands**: See [Quick SSH Reference](./docs/QUICK_SSH_REFERENCE.md) for running commands in container
- **Admin Login Issues**: See [SSH Troubleshooting Guide](./docs/SSH_TROUBLESHOOTING.md)
- **Troubleshooting**: See `TROUBLESHOOTING.md` for common issues
- **CapRover Docs**: https://caprover.com/docs/
- **Repository Issues**: https://github.com/damdayvillage-a11y/Village/issues

---

**Status**: Ready for Deployment  
**Last Updated**: 2025-10-18  
**Changes**: Repository cleaned up, ready for testing

**Next Action**: Deploy to CapRover following this checklist
