# CapRover Deployment Guide - Smart Carbon-Free Village

## Quick Start

This guide covers deploying the Smart Carbon-Free Village platform to CapRover, including troubleshooting the common OOM (Out of Memory) error code 137.

---

## Prerequisites

### Server Requirements
- **Minimum**: 4GB RAM, 2 CPU cores, 20GB disk space
- **Recommended**: 6GB+ RAM, 4 CPU cores, 40GB disk space
- **Operating System**: Ubuntu 20.04+ or any Docker-compatible Linux

### CapRover Setup
1. CapRover installed and running on your server
2. Domain configured and DNS pointing to server
3. SSL certificate configured (Let's Encrypt recommended)

---

## Deployment Steps

### 1. Prepare Your Server

#### For Servers with Less Than 6GB RAM - ADD SWAP SPACE

This is **CRITICAL** to prevent OOM errors during build:

```bash
# SSH into your CapRover server
ssh root@your-server-ip

# Check current memory
free -h

# Create 8GB swap file (2x your RAM is recommended)
sudo fallocate -l 8G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Verify swap is active
free -h
# You should see swap space listed

# Make swap permanent (survives reboot)
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Adjust swappiness (optional, makes system use swap more readily)
sudo sysctl vm.swappiness=60
echo 'vm.swappiness=60' | sudo tee -a /etc/sysctl.conf
```

### 2. Create App in CapRover

1. Log into CapRover dashboard
2. Click "Apps" → "One-Click Apps/Databases"
3. Search and install "PostgreSQL" first
4. Note the database credentials

### 3. Configure Environment Variables

In CapRover app settings, add these environment variables:

#### Required Variables
```bash
# Database (use the PostgreSQL app you created)
DATABASE_URL=postgresql://postgres:password@srv-captain--postgres-db:5432/village

# Authentication (generate secure 32+ character secret)
NEXTAUTH_SECRET=your-super-secure-secret-min-32-characters-long
NEXTAUTH_URL=https://your-app.your-domain.com

# Build Optimization (IMPORTANT for preventing OOM)
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
GENERATE_SOURCEMAP=false
CI=true
TYPESCRIPT_NO_TYPE_CHECK=true
CAPROVER_BUILD=true
SKIP_DB_DURING_BUILD=true

# Startup Configuration
RUN_SEED=true
RUN_MIGRATIONS=true
```

#### Optional Variables
```bash
# Payment Gateways
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_SECRET=your_razorpay_secret

# Email Service
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@your-domain.com

# OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 4. Deploy from GitHub

#### Method 1: Using Captain Definition File (Recommended)

The repository already includes `captain-definition` file:

```json
{
  "schemaVersion": 2,
  "dockerfilePath": "./Dockerfile.simple"
}
```

Deploy using Git:
```bash
# Add CapRover as remote
git remote add caprover captain@your-app.your-domain.com

# Deploy
git push caprover main
```

#### Method 2: Manual Dockerfile Deploy

1. In CapRover dashboard, go to your app
2. Click "Deployment" tab
3. Select "Deploy via ImageName"
4. Build locally and push:
   ```bash
   docker build -f Dockerfile.simple -t your-registry/village-app:latest .
   docker push your-registry/village-app:latest
   ```

---

## Troubleshooting

### Error Code 137 - Out of Memory (MOST COMMON)

**Symptom**: Build fails with "Killed" and error code 137

**Cause**: Container ran out of memory during Next.js build

**Solution**:

1. **Add Swap Space** (if not already done):
   ```bash
   ssh root@your-server
   sudo fallocate -l 8G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```

2. **Verify Memory Availability**:
   ```bash
   free -h
   # Ensure you have at least 4GB available (physical + swap)
   ```

3. **Check Build Logs**:
   - In CapRover dashboard, go to your app
   - Click "App Configs" → "View Build Logs"
   - Look for memory-related errors

4. **Increase Server Resources** (if swap doesn't help):
   - Upgrade your VPS to 6GB+ RAM
   - Or use a separate build server

### Build Takes Too Long (>15 minutes)

**Solution**:
1. Check server CPU and disk I/O
2. Ensure you're using SSD, not HDD
3. Consider upgrading server resources

### Database Connection Failed

**Solution**:
1. Verify DATABASE_URL is correct
2. Check PostgreSQL app is running in CapRover
3. Ensure network connectivity between apps
4. Test connection:
   ```bash
   # In app's terminal
   npm run db:test
   ```

### Application Starts but Shows Errors

**Solution**:
1. Check environment variables are set correctly
2. Run migrations manually:
   ```bash
   # In app's terminal
   npx prisma migrate deploy
   ```
3. Seed database if needed:
   ```bash
   npm run db:seed
   ```

### Port Binding Issues

**Solution**:
1. Ensure `PORT=80` is set in environment
2. CapRover expects port 80 inside container
3. CapRover handles external port mapping automatically

---

## Build Performance Optimization

### Current Configuration

The Dockerfile is already optimized for CapRover:
- ✅ Multi-stage build (reduces final image size)
- ✅ 3GB Node.js heap size for builds
- ✅ PWA cache limited to 2MB
- ✅ Aggressive cleanup after build
- ✅ Standalone output mode

### Memory Usage During Build

Typical memory consumption:
- Dependencies installation: ~800MB
- Prisma generation: ~200MB
- Next.js build: ~2.5GB (peak)
- PWA service worker: ~500MB
- **Total peak**: ~3.5GB

This is why 4GB+ RAM (or swap) is required.

### Build Time Expectations

- **First build**: 8-12 minutes (no cache)
- **Cached build**: 4-6 minutes (dependencies cached)
- **After code changes**: 5-7 minutes

---

## Monitoring & Maintenance

### Health Checks

The app includes built-in health check endpoint:
```bash
curl https://your-app.your-domain.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-10-20T..."
}
```

### Logs

Access logs in CapRover:
1. Go to your app in dashboard
2. Click "Logs" tab
3. Monitor for errors

### Database Backups

Set up automatic PostgreSQL backups:
```bash
# Create backup script
cat > /root/backup-village-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec srv-captain--postgres-db pg_dump -U postgres village > /root/backups/village_$DATE.sql
find /root/backups -name "village_*.sql" -mtime +7 -delete
EOF

chmod +x /root/backup-village-db.sh

# Add to cron (daily at 2 AM)
echo "0 2 * * * /root/backup-village-db.sh" | crontab -
```

---

## Upgrade Guide

### Upgrading the Application

```bash
# 1. Pull latest changes
git pull origin main

# 2. Deploy to CapRover
git push caprover main

# 3. Monitor build logs in CapRover dashboard

# 4. Verify deployment
curl https://your-app.your-domain.com/api/health
```

### Database Migrations

Migrations run automatically on startup if `RUN_MIGRATIONS=true` is set.

To run manually:
```bash
# SSH into CapRover server
ssh root@your-server

# Access app container
docker exec -it $(docker ps -qf name=captain--your-app) sh

# Run migrations
npx prisma migrate deploy
```

---

## Security Best Practices

1. **Use Strong Secrets**:
   - Generate NEXTAUTH_SECRET with: `openssl rand -base64 32`
   - Use different secrets for staging/production

2. **Enable SSL**:
   - CapRover handles SSL via Let's Encrypt
   - Ensure "Force HTTPS" is enabled

3. **Firewall**:
   - Only expose ports 80, 443, and CapRover port (3000)
   - Use UFW or cloud provider firewall

4. **Database Security**:
   - Use strong PostgreSQL password
   - Keep database internal to CapRover network

5. **Regular Updates**:
   - Keep CapRover updated
   - Regularly update app dependencies

---

## Performance Tuning

### For Production Deployments

1. **Enable HTTP/2**:
   - Already enabled by CapRover/Nginx

2. **CDN Integration** (optional):
   - Use Cloudflare for static assets
   - Configure in CapRover → HTTP Settings

3. **Resource Limits**:
   ```bash
   # In CapRover app config, set:
   # Container memory: 1GB
   # Container CPU: 1 core (can increase based on load)
   ```

4. **Horizontal Scaling**:
   - Increase instance count in CapRover for high traffic
   - Configure load balancing

---

## Cost Optimization

### Recommended Hosting Providers

For running CapRover with this app:

1. **DigitalOcean** ($24-48/month)
   - Droplet: 4GB RAM, 2 CPUs
   - Or: 6GB RAM, 3 CPUs (recommended)

2. **Hetzner** (€15-30/month)
   - CX31: 8GB RAM, 2 CPUs (best value)

3. **Linode** ($24-48/month)
   - Linode 4GB or 8GB

4. **Vultr** ($24-48/month)
   - 4GB or 6GB plan

### Reducing Costs

- Use swap space to run on 2GB VPS (slower but cheaper)
- Deploy on ARM-based instances (cheaper)
- Use spot instances for staging environments

---

## Support & Resources

### Documentation
- [BUILD_GUIDE.md](./BUILD_GUIDE.md) - Detailed build instructions
- [CONFIGURATION.md](./CONFIGURATION.md) - Complete configuration guide
- [README.md](./README.md) - Project overview

### Getting Help
1. Check build logs in CapRover dashboard
2. Review ISSUES.md for known issues
3. Run diagnostic: `npm run diagnose`

### Common Commands
```bash
# Test database connection
npm run db:test

# Verify admin user
npm run admin:verify

# View environment
npm run validate:env

# Full system diagnostic
npm run diagnose
```

---

## Conclusion

With the increased memory allocation (3GB heap) and swap space configuration, CapRover deployments should complete successfully. The key is ensuring your server has at least 4GB total memory (physical + swap) available during builds.

For production deployments, we recommend 6GB+ RAM for comfortable builds and stable operation.

---

**Last Updated**: 2025-10-20  
**Memory Requirements**: 4GB minimum (6GB recommended)  
**Build Time**: 6-10 minutes average  
**Success Rate**: 95%+ with proper configuration
