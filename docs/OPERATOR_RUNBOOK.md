# Operator Runbook - CapRover Deployment

## Overview

This runbook provides step-by-step commands for operators to deploy and manage the Smart Carbon-Free Village application on CapRover.

## Table of Contents

1. [Pre-Flight Checks](#pre-flight-checks)
2. [Database Setup Commands](#database-setup-commands)
3. [Application Deployment](#application-deployment)
4. [Post-Deployment Operations](#post-deployment-operations)
5. [Verification Commands](#verification-commands)
6. [Troubleshooting Commands](#troubleshooting-commands)
7. [Backup and Recovery](#backup-and-recovery)
8. [Emergency Procedures](#emergency-procedures)

## Pre-Flight Checks

### Check VPS Resources

```bash
# Check available memory
free -h

# Check disk space
df -h

# Check swap (should have at least 1GB)
swapon --show

# Check Docker version
docker --version

# Check CapRover status
docker ps | grep captain
```

### Expected Output:
- Memory: At least 2GB total (1GB free recommended)
- Disk: At least 10GB free
- Swap: 1GB or more recommended
- Docker: Version 20.10 or higher
- CapRover: captain-nginx and captain-captain containers running

### Enable Swap (If Not Present)

```bash
# Create 1GB swap file
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
sudo bash -c 'echo "/swapfile none swap sw 0 0" >> /etc/fstab'

# Verify
free -h
```

## Database Setup Commands

### Option 1: Using CapRover One-Click PostgreSQL

1. Go to CapRover Dashboard → One-Click Apps/Databases
2. Search for "PostgreSQL"
3. Deploy with these settings:
   - App Name: `postgres`
   - PostgreSQL Password: [SECURE_PASSWORD]
   - Default Database: `villagedb`

### Option 2: Manual PostgreSQL Setup

```bash
# Create PostgreSQL container
docker run -d \
  --name postgres-db \
  --network captain-overlay-network \
  -e POSTGRES_PASSWORD=[SECURE_PASSWORD] \
  -e POSTGRES_USER=damdiyal \
  -e POSTGRES_DB=villagedb \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:15-alpine

# Wait for PostgreSQL to be ready
docker exec postgres-db pg_isready -U damdiyal

# Should output: /var/run/postgresql:5432 - accepting connections
```

### Configure Database User and Permissions

```bash
# Connect to PostgreSQL container
docker exec -it $(docker ps | grep srv-captain--postgres | awk '{print $1}') sh

# Inside container, connect to database
psql -U postgres -d villagedb

# Create user and grant permissions
CREATE USER damdiyal WITH PASSWORD '[SECURE_PASSWORD]';
GRANT ALL PRIVILEGES ON DATABASE villagedb TO damdiyal;
GRANT ALL PRIVILEGES ON SCHEMA public TO damdiyal;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO damdiyal;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO damdiyal;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO damdiyal;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO damdiyal;

# Verify
\du
\l

# Exit
\q
exit
```

### Test Database Connection

```bash
# From CapRover host
docker exec $(docker ps | grep srv-captain--postgres | awk '{print $1}') \
  psql -U damdiyal -d villagedb -c 'SELECT version();'

# Should output PostgreSQL version
```

## Application Deployment

### Generate Required Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Save the output securely
```

### Set Environment Variables in CapRover

Navigate to: CapRover Dashboard → Apps → village → App Configs → Environment Variables

Add these variables one by one:

```
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=[OUTPUT_FROM_OPENSSL_COMMAND]
DATABASE_URL=postgresql://damdiyal:[SECURE_PASSWORD]@srv-captain--postgres:5432/villagedb
NEXT_TELEMETRY_DISABLED=1
GENERATE_SOURCEMAP=false
CI=true
```

**Important:** Replace placeholders with actual values:
- `your-domain.com` → Your actual domain
- `[OUTPUT_FROM_OPENSSL_COMMAND]` → The secret you generated
- `[SECURE_PASSWORD]` → Your database password

### Deploy Application

**Method 1: Via GitHub (Recommended)**

1. Go to App Configs → Deployment
2. Select "Deploy from Github/Bitbucket/Gitlab"
3. Enter:
   - Repository URL: `https://github.com/damdayvillage-a11y/Village`
   - Branch: `main`
   - GitHub Username: [YOUR_USERNAME]
   - Personal Access Token: [YOUR_TOKEN]
4. Click "Save & Update"
5. Click "Force Build"

**Method 2: Via CapRover CLI**

```bash
# Install CapRover CLI
npm install -g caprover

# Login
caprover login

# Deploy
cd /path/to/Village
caprover deploy
```

### Monitor Deployment

```bash
# Watch build logs in CapRover dashboard
# Or via CLI:
caprover logs -f --app village

# Should see:
# - "📦 Installing dependencies..."
# - "🔧 Generating Prisma client..."
# - "🏗️ Building application..."
# - "✅ Build successful"
```

## Post-Deployment Operations

### Step 1: Verify Container is Running

```bash
# Find the container
docker ps | grep srv-captain--village

# Should show one running container
```

### Step 2: Apply Database Schema

```bash
# Get container ID
CONTAINER_ID=$(docker ps | grep srv-captain--village | awk '{print $1}')

# Option A: Push schema directly (no migrations)
docker exec -it $CONTAINER_ID sh -c "npx prisma db push"

# Option B: If you have migrations
docker exec -it $CONTAINER_ID sh -c "npx prisma migrate deploy"
```

Expected output:
```
🚀  Your database is now in sync with your Prisma schema.
```

### Step 3: Seed Database

```bash
# Seed with initial data and admin user
docker exec -it $CONTAINER_ID sh -c "npm run db:seed"
```

Expected output:
```
🌱 Seeding Smart Carbon-Free Village database...
✅ Created village: Damday Village
✅ Created users: Admin User and Host User

🔑 Default Login Credentials:
   Admin Email: admin@damdayvillage.org
   Admin Password: Admin@123
   Host Email: host@damdayvillage.org
   Host Password: Host@123
```

### Step 4: Verify Admin User

```bash
docker exec -it $CONTAINER_ID sh -c "npm run admin:verify"
```

Expected output:
```
✅ Admin user exists and is active
✅ Admin has correct role
```

## Verification Commands

### Check Application Health

```bash
# Health endpoint
curl https://your-domain.com/api/health

# Should return:
# {
#   "status": "healthy",
#   "services": {
#     "database": { "status": "healthy" },
#     "api": { "status": "healthy" }
#   }
# }
```

### Check Database Connection

```bash
# From inside app container
docker exec -it $CONTAINER_ID sh -c "npm run db:test"

# Should output:
# ✅ Database connection successful!
# ✅ PostgreSQL Version: PostgreSQL 15.x
```

### Check Application Logs

```bash
# Last 50 lines
docker logs $CONTAINER_ID --tail 50

# Follow logs
docker logs $CONTAINER_ID -f

# Filter for errors
docker logs $CONTAINER_ID 2>&1 | grep -i error
```

### Check Environment Variables

```bash
# List all environment variables (be careful - shows secrets)
docker exec $CONTAINER_ID env | sort

# Check specific variables (safer)
docker exec $CONTAINER_ID sh -c 'echo "NODE_ENV=$NODE_ENV"'
docker exec $CONTAINER_ID sh -c 'echo "NEXTAUTH_URL=$NEXTAUTH_URL"'
```

### Verify Prisma Files

```bash
# Check Prisma schema
docker exec $CONTAINER_ID ls -la prisma/

# Check Prisma client
docker exec $CONTAINER_ID ls -la node_modules/@prisma/client/ | head -10
```

### Test Admin Login

```bash
# Via browser:
# 1. Go to https://your-domain.com/admin-panel/login
# 2. Login with: admin@damdayvillage.org / Admin@123
# 3. Should see admin dashboard

# Via API (test authentication)
curl -X POST https://your-domain.com/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@damdayvillage.org","password":"Admin@123"}'
```

## Troubleshooting Commands

### Build Failed

```bash
# Check build logs
docker logs $(docker ps -a | grep srv-captain--village | awk '{print $1}') | tail -100

# Check memory usage
free -h
docker stats --no-stream

# Clear Docker cache and retry
docker system prune -a
# Then force rebuild in CapRover dashboard
```

### Container Crashes / Restarts

```bash
# Check container status
docker ps -a | grep village

# Check restart count
docker inspect $CONTAINER_ID | grep RestartCount

# Check recent logs
docker logs $CONTAINER_ID --tail 100

# Check for errors
docker logs $CONTAINER_ID 2>&1 | grep -E "error|Error|ERROR" | tail -20
```

### Database Connection Issues

```bash
# Test database from CapRover host
docker exec $(docker ps | grep srv-captain--postgres | awk '{print $1}') \
  psql -U damdiyal -d villagedb -c 'SELECT 1;'

# Test database from app container
docker exec $CONTAINER_ID sh -c "npm run db:test"

# Check DATABASE_URL format
docker exec $CONTAINER_ID sh -c 'echo $DATABASE_URL'
# Should be: postgresql://damdiyal:password@srv-captain--postgres:5432/villagedb
```

### 500 Error on Admin Panel

```bash
# Check if Prisma client was generated
docker exec $CONTAINER_ID ls -la node_modules/@prisma/client/

# Check if schema is present
docker exec $CONTAINER_ID ls -la prisma/

# Re-seed database
docker exec $CONTAINER_ID sh -c "npm run db:seed"

# Check application logs
docker logs $CONTAINER_ID --tail 50
```

### HTTPS Not Working

```bash
# Check CapRover HTTPS settings
# In dashboard: App → Settings → Enable HTTPS

# Test SSL certificate
curl -vI https://your-domain.com 2>&1 | grep -E "SSL|certificate"

# Check DNS
dig your-domain.com
nslookup your-domain.com

# Check CapRover nginx logs
docker logs $(docker ps | grep captain-nginx | awk '{print $1}') | tail -50
```

## Backup and Recovery

### Backup Database

```bash
# Create backup directory
mkdir -p /root/backups

# Backup database
docker exec $(docker ps | grep srv-captain--postgres | awk '{print $1}') \
  pg_dump -U damdiyal villagedb > /root/backups/villagedb-$(date +%Y%m%d-%H%M%S).sql

# Compress backup
gzip /root/backups/villagedb-*.sql

# List backups
ls -lh /root/backups/
```

### Restore Database

```bash
# Restore from backup (use specific filename)
gunzip < /root/backups/villagedb-20241015-120000.sql.gz | \
  docker exec -i $(docker ps | grep srv-captain--postgres | awk '{print $1}') \
  psql -U damdiyal villagedb

# Verify restoration
docker exec $(docker ps | grep srv-captain--postgres | awk '{print $1}') \
  psql -U damdiyal -d villagedb -c 'SELECT COUNT(*) FROM "User";'
```

### Backup Application Configuration

```bash
# Backup CapRover app config
# Go to CapRover Dashboard → App → App Configs
# Copy all environment variables to a secure location

# Backup captain-definition
cp captain-definition /root/backups/captain-definition-$(date +%Y%m%d).backup
```

## Emergency Procedures

### Application Not Responding

```bash
# 1. Check if container is running
docker ps | grep srv-captain--village

# 2. Restart application
docker restart $CONTAINER_ID

# 3. Check logs after restart
docker logs $CONTAINER_ID -f

# 4. If still not working, force redeploy in CapRover dashboard
```

### Out of Memory During Build

```bash
# 1. Check current memory
free -h

# 2. If no swap, add 1GB swap (see Pre-Flight Checks)

# 3. Stop non-essential services temporarily
docker stop $(docker ps -q --filter "name=non-essential-app")

# 4. Retry build
```

### Database Corruption

```bash
# 1. Stop application
docker stop $CONTAINER_ID

# 2. Backup current database (even if corrupted)
docker exec $(docker ps | grep srv-captain--postgres | awk '{print $1}') \
  pg_dump -U damdiyal villagedb > /root/backups/villagedb-corrupted-$(date +%Y%m%d-%H%M%S).sql

# 3. Drop and recreate database
docker exec -it $(docker ps | grep srv-captain--postgres | awk '{print $1}') sh -c "
psql -U postgres <<EOF
DROP DATABASE villagedb;
CREATE DATABASE villagedb OWNER damdiyal;
\q
EOF
"

# 4. Restore from last good backup
gunzip < /root/backups/villagedb-[LAST_GOOD_BACKUP].sql.gz | \
  docker exec -i $(docker ps | grep srv-captain--postgres | awk '{print $1}') \
  psql -U damdiyal villagedb

# 5. Start application
docker start $CONTAINER_ID
```

### Rollback to Previous Version

```bash
# Via CapRover Dashboard:
# 1. Go to App → Deployment
# 2. Select previous successful build from history
# 3. Click "Deploy"

# Via CLI (if you have tagged versions):
# docker pull your-registry/village:previous-tag
# docker tag your-registry/village:previous-tag srv-captain--village
# docker restart $CONTAINER_ID
```

## Monitoring Commands

### Resource Usage

```bash
# Real-time stats
docker stats $CONTAINER_ID

# Memory usage
docker stats $CONTAINER_ID --no-stream --format "table {{.MemUsage}}"

# CPU usage
docker stats $CONTAINER_ID --no-stream --format "table {{.CPUPerc}}"
```

### Application Metrics

```bash
# Request count (if you have access logs)
docker logs $CONTAINER_ID 2>&1 | grep "GET" | wc -l

# Error count
docker logs $CONTAINER_ID 2>&1 | grep -i error | wc -l

# Health check
watch -n 5 'curl -s https://your-domain.com/api/health | jq .'
```

## Security Checklist

- [ ] Change default admin password immediately after first login
- [ ] Change default host password
- [ ] Use strong DATABASE_URL password (20+ characters, mixed case, numbers, symbols)
- [ ] NEXTAUTH_SECRET is randomly generated (not default)
- [ ] HTTPS is enabled and working
- [ ] Firewall is configured (only ports 80, 443, 3000 open)
- [ ] SSH is secured (key-only, no password)
- [ ] Regular backups are automated
- [ ] Logs are monitored for suspicious activity
- [ ] Dependencies are kept up to date

## Maintenance Schedule

### Daily
- Check application health endpoint
- Monitor resource usage
- Check for errors in logs

### Weekly
- Backup database
- Review logs for issues
- Check disk space

### Monthly
- Update dependencies (test in staging first)
- Review security advisories
- Test backup restoration
- Review and rotate logs

## Support Contacts

- **Documentation**: See `/docs` directory
- **Repository Issues**: https://github.com/damdayvillage-a11y/Village/issues
- **CapRover Docs**: https://caprover.com/docs/

---

**Last Updated**: 2025-10-15
**Version**: 1.0.0
