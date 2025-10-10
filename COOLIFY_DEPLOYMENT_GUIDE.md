# 🚀 Coolify Deployment Guide - Village App

> **Complete guide for deploying the Village application on Coolify with PostgreSQL database**

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Database Setup](#database-setup)
4. [Application Deployment](#application-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Post-Deployment](#post-deployment)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Prerequisites

Before starting, ensure you have:

- ✅ Coolify instance installed and running
- ✅ Domain name configured (or use Coolify's default domain)
- ✅ Git repository access
- ✅ Basic understanding of Docker and PostgreSQL

---

## ⚡ Quick Start

### 1. Create New Project in Coolify

1. Log in to your Coolify dashboard
2. Click **"+ New"** → **"Project"**
3. Enter project name: `village-app`
4. Save the project

### 2. Add PostgreSQL Database

1. In your project, click **"+ New Resource"** → **"Database"**
2. Select **"PostgreSQL"**
3. Configure database:
   - **Name**: `village-db`
   - **Database Name**: `villagedb`
   - **Username**: `villageuser`
   - **Password**: Generate a strong password (save it!)
   - **Version**: PostgreSQL 15 or higher
4. Click **"Create"**
5. Wait for the database to start (check status should be green)

**Important:** Save your database credentials! You'll need them for the DATABASE_URL.

### 3. Add the Application

1. In your project, click **"+ New Resource"** → **"Application"**
2. Select **"Public Repository"**
3. Enter repository URL: `https://github.com/damdayvillage-a11y/Village`
4. Configure:
   - **Branch**: `main` (or your deployment branch)
   - **Build Pack**: `Dockerfile`
   - **Dockerfile Location**: `./Dockerfile.simple`
   - **Port**: `80`
5. Click **"Continue"**

---

## 🗄️ Database Setup

### Get Database Connection URL

After creating the PostgreSQL database in Coolify:

1. Go to your database resource
2. Find the **"Connection Details"** section
3. Copy the **Internal Connection String**
4. It should look like: `postgresql://villageuser:password@village-db:5432/villagedb`

**Format:**
```
postgresql://[username]:[password]@[host]:[port]/[database_name]
```

### Database Connection Examples

**Internal Connection (within Coolify network):**
```bash
postgresql://villageuser:YourStrongPassword@village-db:5432/villagedb
```

**External Connection (if enabled):**
```bash
postgresql://villageuser:YourStrongPassword@your-server-ip:5432/villagedb
```

---

## 🚀 Application Deployment

### Configure Build Settings

In your application resource in Coolify:

1. Go to **"Build"** section
2. Set **Dockerfile**: `Dockerfile.simple`
3. Enable **"Health Check"**
   - Health Check URL: `/api/health`
   - Health Check Port: `80`

### Configure Network Settings

1. Go to **"Networking"** section
2. Set **Port Mapping**: `80` (internal) → `443` (external with SSL)
3. Enable **"Automatic SSL/TLS"** (Coolify will handle Let's Encrypt)
4. Set your domain or use Coolify's provided domain

---

## 🔧 Environment Configuration

### Required Environment Variables

Go to your application → **"Environment Variables"** and add:

#### 1. Core Configuration (REQUIRED)

```bash
# Node Environment
NODE_ENV=production

# Application URL (IMPORTANT: Use your actual domain!)
NEXTAUTH_URL=https://your-domain.com
# Or if using Coolify subdomain:
# NEXTAUTH_URL=https://village-app.yourdomain.com

# NextAuth Secret (Generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your-generated-secret-here-32-characters-minimum

# Database Connection (Use the internal connection string from above)
DATABASE_URL=postgresql://villageuser:YourStrongPassword@village-db:5432/villagedb
```

#### 2. Build Optimization (REQUIRED)

```bash
# Disable telemetry for faster builds
NEXT_TELEMETRY_DISABLED=1

# Disable sourcemaps for smaller builds
GENERATE_SOURCEMAP=false

# CI flag for optimized builds
CI=true
```

#### 3. Optional Services

Only add these if you're using these services:

```bash
# Payment Providers (Optional)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_SECRET=your-razorpay-secret

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Email Service (Optional)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@example.com
EMAIL_SERVER_PASSWORD=your-email-password
EMAIL_FROM=noreply@yourdomain.com

# MQTT/IoT (Optional)
MQTT_BROKER_URL=mqtt://broker.example.com:1883
```

### ⚠️ Critical: Validate Your Environment Variables

**Check these before deploying:**

1. ✅ `NEXTAUTH_URL` must be your **actual domain** (not localhost)
2. ✅ `NEXTAUTH_SECRET` must be at least **32 characters** (generate with OpenSSL)
3. ✅ `DATABASE_URL` must use **internal connection** from Coolify (`village-db` as host)
4. ✅ **No placeholders** like `$$cap_*$$` or `your-domain.com`
5. ✅ Database password matches what you set when creating the database

---

## 📦 Post-Deployment

### Step 1: Deploy the Application

1. In Coolify, go to your application
2. Click **"Deploy"**
3. Monitor the build logs
4. Wait for deployment to complete (~2-3 minutes)
5. Check status shows green ✅

### Step 2: Run Database Migrations

Once the app is deployed, you need to set up the database schema.

**Option A: Using Coolify Terminal**

1. Go to your application in Coolify
2. Click on **"Terminal"** or **"Execute Command"**
3. Run:
```bash
npx prisma migrate deploy
```

**Option B: Using SSH**

If you have SSH access to the Coolify server:

```bash
# Get the container ID
docker ps | grep village-app

# Execute migration
docker exec -it <container-id> npx prisma migrate deploy
```

### Step 3: Seed Initial Data

Create the admin user and sample data:

**In Coolify Terminal:**
```bash
npm run db:seed
```

This will create:
- ✅ Admin user: `admin@damdayvillage.org` / `Admin@123`
- ✅ Host user: `host@damdayvillage.org` / `Host@123`
- ✅ Sample village data
- ✅ Sample homestay
- ✅ IoT devices

### Step 4: Verify Deployment

#### Check Application Health

Visit your domain + health check endpoint:
```
https://your-domain.com/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "services": {
    "database": {
      "status": "healthy",
      "responseTime": "25ms"
    },
    "api": {
      "status": "healthy"
    }
  }
}
```

#### Check Authentication Status

```
https://your-domain.com/api/auth/status
```

**Expected Response:**
```json
{
  "status": "healthy",
  "healthy": true,
  "checks": {
    "nextauth_url": {
      "configured": true,
      "value": "OK"
    },
    "nextauth_secret": {
      "configured": true,
      "valid": true
    },
    "database": {
      "configured": true,
      "connected": true,
      "admin_exists": true
    }
  }
}
```

#### Check Environment Configuration

```
https://your-domain.com/api/admin/check-env
```

This will validate all environment variables are properly configured.

### Step 5: Login to Admin Panel

1. Visit: `https://your-domain.com/admin-panel/login`
2. Login with:
   - **Email**: `admin@damdayvillage.org`
   - **Password**: `Admin@123`
3. **IMMEDIATELY** change your password after first login!

---

## 🔍 Troubleshooting

### Issue 1: Build Fails

**Symptoms:**
- Build logs show errors
- Deployment fails
- "npm install" hangs

**Solutions:**

1. **Check Dockerfile Location:**
   - Ensure `Dockerfile.simple` is set in Build settings
   - Verify the file exists in repository

2. **Increase Build Resources:**
   - In Coolify, go to application settings
   - Increase memory limit to at least 2GB
   - Increase CPU limit if available

3. **Clear Build Cache:**
   - In application settings, enable "Force Rebuild"
   - Deploy again

### Issue 2: Database Connection Failed

**Symptoms:**
- Application starts but can't connect to database
- Health check shows database unhealthy
- Error: "ECONNREFUSED" or "Connection refused"

**Solutions:**

1. **Verify Database is Running:**
   - Go to database resource in Coolify
   - Check status is green
   - Restart if necessary

2. **Check DATABASE_URL:**
   - Use internal connection string (with service name, not IP)
   - Format: `postgresql://user:pass@village-db:5432/villagedb`
   - Verify password matches database password

3. **Check Network:**
   - Both database and app should be in same project
   - Coolify automatically handles networking within project

4. **Test Connection:**
   - Use terminal in application container:
   ```bash
   psql $DATABASE_URL
   ```

### Issue 3: 500 Error on Admin Panel Login

**Symptoms:**
- Homepage works fine
- Admin panel shows 500 Internal Server Error
- Can't login

**Solutions:**

1. **Check Environment Variables:**
   - Verify `NEXTAUTH_URL` is your actual domain
   - Verify `NEXTAUTH_SECRET` is set (min 32 chars)
   - No placeholders remaining

2. **Check Database Migrations:**
   - Run migrations if not done:
   ```bash
   npx prisma migrate deploy
   ```

3. **Check Admin User Exists:**
   - Run seed script:
   ```bash
   npm run db:seed
   ```

4. **Check Application Logs:**
   - In Coolify, go to application → Logs
   - Look for authentication or database errors

### Issue 4: Domain/SSL Issues

**Symptoms:**
- Can't access application
- SSL certificate errors
- "Site can't be reached"

**Solutions:**

1. **Verify Domain Configuration:**
   - Check DNS records point to Coolify server
   - Wait for DNS propagation (can take up to 48 hours)

2. **Check SSL Certificate:**
   - Coolify auto-generates Let's Encrypt certificates
   - May take a few minutes after deployment
   - Check application → Networking for SSL status

3. **Use Coolify Default Domain:**
   - Temporarily use the Coolify-provided domain
   - Update `NEXTAUTH_URL` to match
   - Redeploy application

### Issue 5: Application Crashes/Restarts

**Symptoms:**
- Application keeps restarting
- Health check fails
- "Container exited"

**Solutions:**

1. **Check Memory Usage:**
   - Increase memory limit to at least 2GB
   - Check application logs for OOM (Out of Memory) errors

2. **Check Health Check:**
   - Verify health check URL: `/api/health`
   - Ensure health check port is `80`
   - Increase health check timeout if needed

3. **Check Startup:**
   - Review application logs for startup errors
   - Verify all required env vars are set
   - Check database connection

---

## 📊 Performance Optimization

### Recommended Resource Allocation

**Minimum:**
- Memory: 2GB
- CPU: 2 cores
- Disk: 10GB

**Recommended (for production):**
- Memory: 4GB
- CPU: 4 cores
- Disk: 50GB

### Database Optimization

For better performance:

1. **In Coolify Database Settings:**
   - Increase max_connections (default is usually fine)
   - Set shared_buffers to 25% of available memory
   - Enable connection pooling

2. **Add Indexes (if needed):**
   ```sql
   -- Connect to database
   psql $DATABASE_URL
   
   -- Add performance indexes
   CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users(email);
   CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_user ON bookings(user_id);
   ```

---

## 🔐 Security Best Practices

### 1. Environment Variables

- ✅ Never commit `.env` files to Git
- ✅ Use strong, unique passwords
- ✅ Rotate secrets regularly
- ✅ Use different credentials for staging/production

### 2. Database Security

- ✅ Use strong database password (min 16 chars)
- ✅ Don't expose database port externally
- ✅ Regular database backups (Coolify has built-in backup)
- ✅ Limit database user permissions

### 3. Application Security

- ✅ Change default admin password immediately
- ✅ Enable HTTPS (SSL/TLS) - Coolify handles this
- ✅ Set secure NEXTAUTH_SECRET (32+ characters)
- ✅ Monitor application logs regularly

### 4. Enable Automatic Backups

In Coolify:
1. Go to database resource
2. Navigate to **"Backups"** section
3. Enable **"Automatic Backups"**
4. Set schedule (recommended: daily)
5. Set retention period (recommended: 7-30 days)

---

## 📚 Additional Resources

### Documentation

- [Coolify Official Docs](https://coolify.io/docs)
- [CapRover Migration Guide](./CAPROVER_TO_COOLIFY_MIGRATION.md)
- [Environment Variables Guide](./ENVIRONMENT_VARIABLES.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)

### Useful Commands

```bash
# View application logs
# In Coolify: Application → Logs

# Access application terminal
# In Coolify: Application → Terminal

# Restart application
# In Coolify: Application → Restart button

# Database backup (manual)
# In Coolify: Database → Backups → Create Backup

# Database connection test
docker exec -it <container-id> psql $DATABASE_URL
```

---

## ✅ Deployment Checklist

Use this checklist to ensure everything is set up correctly:

### Pre-Deployment
- [ ] Coolify instance is running
- [ ] Domain DNS is configured (if using custom domain)
- [ ] Git repository is accessible
- [ ] Database credentials prepared

### Database Setup
- [ ] PostgreSQL database created in Coolify
- [ ] Database is running (green status)
- [ ] Database credentials saved securely
- [ ] DATABASE_URL connection string copied

### Application Configuration
- [ ] Application created in Coolify
- [ ] Repository URL configured
- [ ] Dockerfile path set: `Dockerfile.simple`
- [ ] Port set to `80`
- [ ] All environment variables added
- [ ] NEXTAUTH_URL set to actual domain
- [ ] NEXTAUTH_SECRET generated and set
- [ ] DATABASE_URL configured with internal connection

### Deployment
- [ ] Application deployed successfully
- [ ] Build completed without errors (~2-3 minutes)
- [ ] Container is running (green status)
- [ ] Health check passes

### Post-Deployment
- [ ] Database migrations run: `npx prisma migrate deploy`
- [ ] Database seeded: `npm run db:seed`
- [ ] Health check endpoint working: `/api/health`
- [ ] Auth status check passes: `/api/auth/status`
- [ ] Homepage accessible
- [ ] Admin panel accessible
- [ ] Successfully logged in to admin panel
- [ ] Admin password changed from default

### Security
- [ ] Default admin password changed
- [ ] Database password is strong (16+ chars)
- [ ] NEXTAUTH_SECRET is strong (32+ chars)
- [ ] SSL/HTTPS enabled
- [ ] Database backups configured

### Verification
- [ ] All features working
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Monitoring set up (optional)

---

## 🎉 Success!

Once all checks pass, your Village application is successfully deployed on Coolify!

### Next Steps

1. **Customize Your Instance:**
   - Update branding and content
   - Configure payment providers (if needed)
   - Set up email notifications (if needed)

2. **Monitor Your Application:**
   - Check logs regularly
   - Monitor resource usage
   - Set up uptime monitoring

3. **Maintain Your Deployment:**
   - Update application regularly
   - Monitor security advisories
   - Backup database regularly
   - Review and rotate credentials

---

## 🆘 Getting Help

If you encounter issues not covered in this guide:

1. **Check Application Logs:**
   - Coolify Dashboard → Application → Logs
   - Look for error messages and stack traces

2. **Check Database Logs:**
   - Coolify Dashboard → Database → Logs
   - Look for connection or query errors

3. **Review Documentation:**
   - [Coolify Docs](https://coolify.io/docs)
   - [Repository README](./README.md)
   - [Troubleshooting Guide](./TROUBLESHOOTING.md)

4. **Community Support:**
   - GitHub Issues: [Repository Issues](https://github.com/damdayvillage-a11y/Village/issues)
   - Coolify Discord: [Join Here](https://coolify.io/discord)

---

**Version:** 1.0  
**Last Updated:** January 2025  
**Status:** Production-Ready ✅

**Quick Links:**
- [Migration from CapRover](./CAPROVER_TO_COOLIFY_MIGRATION.md)
- [Environment Variables Reference](./ENVIRONMENT_VARIABLES.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
