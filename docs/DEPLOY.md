# Production Deployment Guide

## ⚠️ IMPORTANT: Running Commands via SSH

If you're SSHing into your CapRover server to run commands, **you must run them inside the Docker container**, not on the host machine.

**Quick examples:**
```bash
# ❌ WRONG (on host - will fail)
npm run db:seed

# ✅ CORRECT (in container)
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run db:seed
```

**See:** [Quick SSH Reference](./QUICK_SSH_REFERENCE.md) | [Full SSH Troubleshooting Guide](./SSH_TROUBLESHOOTING.md)

---

## Overview

This guide provides step-by-step instructions for deploying the Smart Carbon-Free Village application to CapRover on a 2GB VPS.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [CapRover Setup](#caprover-setup)
4. [Database Configuration](#database-configuration)
5. [Application Deployment](#application-deployment)
6. [Post-Deployment Steps](#post-deployment-steps)
7. [Troubleshooting](#troubleshooting)
8. [VPS Memory Optimization](#vps-memory-optimization)

## Prerequisites

### Required Resources

- **VPS**: 2GB RAM minimum, 20GB disk space
- **CapRover**: Installed and configured on your VPS
- **Domain**: Custom domain pointing to your server (optional but recommended)
- **PostgreSQL**: Database instance (managed or CapRover one-click app)

### Required Access

- CapRover dashboard access
- SSH access to VPS (for advanced troubleshooting)
- GitHub repository access (if using GitHub integration)

## Pre-Deployment Checklist

### 1. Environment Variables

Prepare the following environment variables for CapRover:

```bash
# Required Core Variables
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<generate-with-command-below>
DATABASE_URL=postgresql://user:password@srv-captain--postgres:5432/villagedb

# Build Optimization (automatically set in Dockerfile)
NEXT_TELEMETRY_DISABLED=1
GENERATE_SOURCEMAP=false
CI=true
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 2. Database Setup

- [ ] PostgreSQL database created and accessible
- [ ] Database user created with appropriate permissions
- [ ] Database credentials secured
- [ ] Database connection tested

### 3. SSL/HTTPS Configuration

- [ ] Custom domain configured in CapRover
- [ ] SSL certificate enabled
- [ ] Force HTTPS enabled
- [ ] DNS records pointing to CapRover server

## CapRover Setup

### Step 1: Create PostgreSQL Database

1. Go to CapRover Dashboard → **One-Click Apps/Databases**
2. Search for **PostgreSQL**
3. Fill in the details:
   - **App Name:** `postgres` (creates service `srv-captain--postgres`)
   - **PostgreSQL Version:** 15 or 16
   - **PostgreSQL Password:** Your secure password
   - **PostgreSQL Default Database:** `villagedb`
4. Click **Deploy** and wait for completion

### Step 2: Configure Database

SSH into the PostgreSQL container:

```bash
docker exec -it $(docker ps | grep srv-captain--postgres | awk '{print $1}') sh
```

Connect to PostgreSQL:

```bash
psql -U postgres -d villagedb
```

Create application user:

```sql
CREATE USER damdiyal WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE villagedb TO damdiyal;
GRANT ALL PRIVILEGES ON SCHEMA public TO damdiyal;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO damdiyal;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO damdiyal;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO damdiyal;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO damdiyal;
\q
```

Exit the container:
```bash
exit
```

### Step 3: Create Application in CapRover

1. Go to CapRover Dashboard → **Apps**
2. Click **Create New App**
3. Enter app name: `village` (creates `srv-captain--village`)
4. Click **Create**

### Step 4: Configure Application

1. Go to **App Configs** → **Environment Variables**
2. Add the following variables (one by one):

```
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<your-generated-secret>
DATABASE_URL=postgresql://damdiyal:your_password@srv-captain--postgres:5432/villagedb
NEXT_TELEMETRY_DISABLED=1
GENERATE_SOURCEMAP=false
CI=true
```

3. Click **Add New Parameter** for each variable
4. Click **Save & Update**

## Database Configuration

### DATABASE_URL Format

```
postgresql://[user]:[password]@[host]:[port]/[database]
```

**For CapRover internal PostgreSQL:**
```
postgresql://damdiyal:password@srv-captain--postgres:5432/villagedb
```

**For external managed database:**
```
postgresql://user:password@external-host.com:5432/villagedb
```

### Special Characters in Password

If your password contains special characters, URL-encode them:

- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`

Example:
```
Password: my@pass#word
Encoded: my%40pass%23word
```

## Application Deployment

### Method 1: GitHub Integration (Recommended)

1. Go to **App Configs** → **Deployment**
2. Select **Method 3: Deploy from Github/Bitbucket/Gitlab**
3. Enter your repository URL: `https://github.com/damdayvillage-a11y/Village`
4. Enter branch: `main`
5. Enter your GitHub username and personal access token
6. Click **Save & Update**
7. Click **Force Build** to start deployment

### Method 2: CapRover CLI

Install CapRover CLI:
```bash
npm install -g caprover
```

Login to your CapRover server:
```bash
caprover login
```

Deploy from local repository:
```bash
cd /path/to/Village
caprover deploy
```

### Method 3: Docker Image Upload

Build locally:
```bash
docker build -f Dockerfile.simple -t village:latest .
docker save village:latest | gzip > village-latest.tar.gz
```

Upload via CapRover dashboard:
1. Go to **App Configs** → **Deployment**
2. Select **Method 4: Deploy via ImageName**
3. Upload the tar.gz file

## Post-Deployment Steps

### Step 1: Verify Deployment

Check the build logs in CapRover dashboard:
- Look for "✅ Build successful"
- Verify no errors in the logs

### Step 2: Run Database Migrations

SSH into the application container:

```bash
# Find the container ID
docker ps | grep srv-captain--village

# Execute shell in container
docker exec -it <container-id> sh
```

Run migrations (if you have migrations):
```bash
npx prisma migrate deploy
```

Or push schema directly:
```bash
npx prisma db push
```

### Step 3: Seed Database

Create initial data and admin user:

```bash
npm run db:seed
```

**⚠️ IMPORTANT:** If you're running this via SSH on your CapRover server, you must run it **inside the Docker container**, not on the host. See [Quick SSH Reference](./QUICK_SSH_REFERENCE.md) for correct commands.

**Inside Docker container (on CapRover):**
```bash
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run db:seed
```

This will create:
- Admin user: `admin@damdayvillage.org` / `Admin@123`
- Host user: `host@damdayvillage.org` / `Host@123`
- Sample village data
- Sample homestays
- Sample IoT devices

### Step 4: Verify Admin User

```bash
npm run admin:verify
```

**⚠️ IMPORTANT:** If running via SSH on CapRover, run inside the container:
```bash
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run admin:verify
```

Expected output:
```
✅ Admin user exists and is active
✅ Admin has correct role
```

### Step 5: Test Application

1. Visit your domain: `https://your-domain.com`
2. Check health endpoint: `https://your-domain.com/api/health`
3. Login to admin panel: `https://your-domain.com/admin-panel/login`
4. Verify system status: `https://your-domain.com/admin-panel/status`

## Troubleshooting

### Build Fails with "Out of Memory"

The application is configured to use 1GB of memory during build, which should work on a 2GB VPS. If you still encounter memory issues:

#### Option 1: Enable Swap (Recommended)

SSH into your VPS and create swap:

```bash
# Check current swap
sudo swapon --show

# Create 1GB swap file
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make it permanent
sudo bash -c 'echo "/swapfile none swap sw 0 0" >> /etc/fstab'

# Verify
free -h
```

#### Option 2: Increase Container Memory

In CapRover App Configs:
1. Enable **Websocket Support** (helps with memory management)
2. Set **Instance Count** to 1
3. Restart the build

### Build Hangs or Times Out

1. Check CapRover server resources:
```bash
docker stats
free -h
df -h
```

2. Clear Docker cache:
```bash
docker system prune -a
```

3. Force rebuild in CapRover dashboard

### Database Connection Fails

1. Test connection from CapRover server:
```bash
# For internal PostgreSQL
docker exec -it $(docker ps | grep srv-captain--postgres | awk '{print $1}') sh -c "psql -U damdiyal -d villagedb -c 'SELECT 1'"
```

2. Verify DATABASE_URL format:
   - Must start with `postgresql://` or `postgres://`
   - Host should be `srv-captain--postgres` for internal database
   - Port should be `5432`
   - Special characters must be URL-encoded

3. Check PostgreSQL logs:
```bash
docker logs $(docker ps | grep srv-captain--postgres | awk '{print $1}') | tail -50
```

### Admin Panel Shows 500 Error

1. Check application logs:
```bash
docker logs $(docker ps | grep srv-captain--village | awk '{print $1}') | tail -100
```

2. Verify Prisma Client is generated:
```bash
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') sh -c "ls -la node_modules/@prisma/client"
```

3. Verify environment variables are set:
```bash
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') sh -c "env | grep -E 'DATABASE_URL|NEXTAUTH'"
```

4. Re-run seed script:
```bash
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') sh -c "npm run db:seed"
```

### HTTPS Not Working

1. Verify DNS records:
```bash
dig your-domain.com
nslookup your-domain.com
```

2. Check CapRover SSL settings:
   - Enable HTTPS in App Configs
   - Enable Force HTTPS
   - Wait for certificate generation (can take 1-2 minutes)

3. Check Let's Encrypt rate limits:
   - Maximum 5 certificates per domain per week
   - Use staging environment for testing

## VPS Memory Optimization

### Current Configuration

The application is optimized for 2GB VPS:
- Build memory limit: 1GB (`--max-old-space-size=1024`)
- Next.js standalone output: Minimal runtime dependencies
- Alpine Linux base image: Small footprint (~150MB)

### Memory Monitoring

Check memory usage:
```bash
# System memory
free -h

# Docker containers
docker stats

# Specific container
docker stats srv-captain--village
```

### Memory Optimization Tips

1. **Limit concurrent builds:**
   - Build one application at a time
   - Pause other applications during build

2. **Use swap:**
   - See "Enable Swap" section above

3. **Optimize Docker:**
```bash
# Clean up unused resources
docker system prune -a

# Remove old images
docker image prune -a

# Remove stopped containers
docker container prune
```

4. **Monitor application memory:**
```bash
# Watch real-time memory
watch -n 2 'docker stats --no-stream'
```

## GitHub Secrets (If Using GitHub Actions)

If deploying via GitHub Actions, add these secrets to your repository:

```
CAPROVER_SERVER=captain.your-domain.com
CAPROVER_APP_TOKEN=<from-caprover-dashboard>
CAPROVER_PRODUCTION_APP=village
CAPROVER_STAGING_APP=village-staging (optional)
```

To get app token:
1. Go to CapRover Dashboard → **Settings** → **App Tokens**
2. Generate new token
3. Copy and save in GitHub repository secrets

## Backup and Recovery

### Database Backup

```bash
# Backup
docker exec $(docker ps | grep srv-captain--postgres | awk '{print $1}') pg_dump -U damdiyal villagedb > backup-$(date +%Y%m%d).sql

# Restore
docker exec -i $(docker ps | grep srv-captain--postgres | awk '{print $1}') psql -U damdiyal villagedb < backup-20241015.sql
```

### Application Backup

1. Export environment variables from CapRover
2. Save captain-definition configuration
3. Backup database regularly
4. Keep repository up to date

## Production Checklist

Before considering deployment complete:

- [ ] Application builds successfully
- [ ] Health endpoint returns 200: `/api/health`
- [ ] Database connection is healthy
- [ ] Admin user can log in
- [ ] System status page works: `/admin-panel/status`
- [ ] HTTPS is enabled and working
- [ ] Environment variables are set correctly
- [ ] Database is seeded with initial data
- [ ] Backups are configured
- [ ] Monitoring is set up (optional)

## Support and Resources

- **Documentation**: See `/docs` directory for additional guides
- **Troubleshooting**: See `TROUBLESHOOTING.md` for common issues
- **CapRover Docs**: https://caprover.com/docs/
- **Repository Issues**: https://github.com/damdayvillage-a11y/Village/issues

## Quick Reference

### Essential URLs

| URL | Purpose |
|-----|---------|
| `/` | Homepage |
| `/api/health` | Health check |
| `/admin-panel/login` | Admin login |
| `/admin-panel/status` | System diagnostics |

### Essential Commands

| Command | Purpose |
|---------|---------|
| `npx prisma db push` | Apply schema to database |
| `npm run db:seed` | Create sample data and admin user |
| `npm run admin:verify` | Verify admin user exists |
| `npm run validate:env` | Validate environment variables |
| `openssl rand -base64 32` | Generate NEXTAUTH_SECRET |

### Default Credentials

After seeding:
- **Admin**: `admin@damdayvillage.org` / `Admin@123`
- **Host**: `host@damdayvillage.org` / `Host@123`

**⚠️ Change these passwords immediately after first login!**

## Security Notes

1. **Never commit secrets** to the repository
2. **Change default passwords** immediately after deployment
3. **Enable HTTPS** in production
4. **Regularly update** dependencies
5. **Monitor logs** for suspicious activity
6. **Backup database** regularly
7. **Use strong passwords** for all accounts
8. **Limit SSH access** to trusted IPs
9. **Enable firewall** on VPS
10. **Keep CapRover updated**

---

**Last Updated**: 2025-10-15
**Version**: 1.0.0
