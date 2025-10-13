# CapRover Deployment Guide - Smart Carbon-Free Village

Complete guide for deploying the Smart Carbon-Free Village application to CapRover.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Environment Variables](#environment-variables)
4. [Deployment Steps](#deployment-steps)
5. [Post-Deployment Setup](#post-deployment-setup)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying to CapRover, ensure you have:

- ✅ CapRover server installed and running
- ✅ Domain configured and pointing to your CapRover server
- ✅ CapRover CLI installed: `npm install -g caprover`
- ✅ Git repository access
- ✅ OpenSSL installed (for generating secrets)

---

## Database Setup

### Step 1: Deploy PostgreSQL on CapRover

1. Log into CapRover dashboard: `https://captain.your-domain.com`
2. Go to **Apps** → **One-Click Apps/Databases**
3. Search for **PostgreSQL**
4. Fill in the details:
   - **App Name:** `postgres` (or any name you prefer)
   - **PostgreSQL Password:** Choose a strong password
   - **Database Name:** `villagedb`
5. Click **Deploy**
6. Wait for deployment to complete

### Step 2: Create Database Schema

After PostgreSQL is deployed, you need to initialize the database schema.

**Database URL Format:**
```
postgresql://postgres:YOUR_PASSWORD@srv-captain--postgres:5432/villagedb
```

The database schema includes:

**Core Tables:**
- `users` - User accounts and authentication
- `villages` - Village information
- `homestays` - Tourist accommodation listings
- `bookings` - Homestay reservations
- `products` - Marketplace items
- `orders` - E-commerce transactions
- `projects` - Community initiatives
- `sensor_readings` - IoT device data (TimescaleDB hypertable)
- `devices` - IoT device registry
- `events` - Community events
- `reviews` - User reviews and ratings
- `messages` - User messaging
- `media` - File uploads
- `accounts` - OAuth provider accounts
- `sessions` - User sessions

**Key Features:**
- TimescaleDB extension for time-series IoT data
- Full-text search support
- Geospatial data for locations
- Multi-role authentication (ADMIN, HOST, GUEST)
- Secure password storage with Argon2

---

## Environment Variables

### Required Variables

Copy these to CapRover **App Configs** and replace ALL `$$cap_*$$` placeholders with actual values:

```bash
# =============================================================================
# REQUIRED - Application Core
# =============================================================================
NODE_ENV=production

# Your actual domain (CRITICAL - NO PLACEHOLDERS!)
# Example: https://damdayvillage.com or https://village.yourdomain.com
NEXTAUTH_URL=https://your-actual-domain.com

# Generate with: openssl rand -base64 32
# Must be 32+ characters for security
NEXTAUTH_SECRET=your-generated-secret-here

# =============================================================================
# REQUIRED - Database
# =============================================================================
# PostgreSQL connection string
# Format: postgresql://username:password@host:port/database
# CapRover internal: postgresql://postgres:PASSWORD@srv-captain--postgres:5432/villagedb
# External: postgresql://user:password@external-host.com:5432/dbname
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@srv-captain--postgres:5432/villagedb

# =============================================================================
# REQUIRED - Build Optimization
# =============================================================================
NEXT_TELEMETRY_DISABLED=1
GENERATE_SOURCEMAP=false
CI=true
CAPROVER_BUILD=true
```

### Optional Variables

Add these only if you need the specific features:

```bash
# =============================================================================
# OPTIONAL - Payment Gateways
# =============================================================================
# Stripe (International payments)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Razorpay (India-specific payments)
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=your_secret...

# =============================================================================
# OPTIONAL - OAuth Providers
# =============================================================================
# Google Sign-In
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret

# GitHub Sign-In
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-secret

# =============================================================================
# OPTIONAL - Email Service
# =============================================================================
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@damdayvillage.org

# =============================================================================
# OPTIONAL - IoT/MQTT
# =============================================================================
MQTT_BROKER_URL=mqtt://broker.hivemq.com:1883
MQTT_USERNAME=your-username
MQTT_PASSWORD=your-password

# =============================================================================
# OPTIONAL - Monitoring
# =============================================================================
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### How to Generate NEXTAUTH_SECRET

On your local machine or server:
```bash
openssl rand -base64 32
```

Copy the output and paste it as the value for `NEXTAUTH_SECRET`.

---

## Deployment Steps

### Method 1: Using CapRover Dashboard (Recommended)

1. **Log into CapRover Dashboard**
   ```
   https://captain.your-domain.com
   ```

2. **Create New App**
   - Click **Apps** → **Create New App**
   - App Name: `village` (or your preferred name)
   - Check **Has Persistent Data** (for uploads and media)
   - Click **Create New App**

3. **Configure Environment Variables**
   - Go to your app → **App Configs** tab
   - Scroll to **Environment Variables**
   - Copy all required variables from above
   - **IMPORTANT:** Replace ALL `$$cap_*$$` placeholders with actual values
   - Click **Save & Update**

4. **Enable HTTPS**
   - Go to **HTTP Settings** tab
   - Check **Enable HTTPS**
   - Check **Force HTTPS by redirecting all HTTP traffic**
   - Check **Websocket Support** (if using real-time features)
   - Click **Save & Update**

5. **Deploy from GitHub**
   - Go to **Deployment** tab
   - Select **Method 3: Deploy from Github/Bitbucket/Gitlab**
   - Repository: `https://github.com/damdayvillage-a11y/Village`
   - Branch: `main`
   - Username: Your GitHub username
   - Password: GitHub Personal Access Token (classic with `repo` scope)
   - Click **Save & Update**

6. **Force Build**
   - Click **Force Build** button
   - Wait 5-10 minutes for build to complete
   - Check **App Logs** for progress

### Method 2: Using CapRover CLI

1. **Initialize CapRover**
   ```bash
   caprover login
   ```
   Follow prompts to connect to your CapRover server.

2. **Create captain-definition**
   
   Create `captain-definition` in project root (if not exists):
   ```json
   {
     "schemaVersion": 2,
     "dockerfilePath": "./Dockerfile"
   }
   ```

3. **Deploy**
   ```bash
   caprover deploy
   ```

---

## Post-Deployment Setup

After deployment completes successfully:

### Step 1: Run Database Migrations

**Option A: Via CapRover Dashboard**
1. Go to your app → **Deployment** tab
2. Scroll to **Execute Shell Command in Running Container**
3. Run:
   ```bash
   npx prisma migrate deploy
   ```
4. Wait for migrations to complete

**Option B: Via SSH**
```bash
# SSH into CapRover server
ssh root@your-server-ip

# Access container
docker exec -it $(docker ps | grep captain-village | awk '{print $1}') sh

# Run migrations
cd /app
npx prisma migrate deploy
```

### Step 2: Seed Initial Data

This creates the admin user and sample data.

**Option A: Via Browser (Easiest)**

Simply visit:
```
https://your-domain.com/api/admin/init
```

This will automatically:
- Create admin user
- Return credentials
- Set up initial data

**Response:**
```json
{
  "success": true,
  "message": "Admin user created successfully",
  "credentials": {
    "email": "admin@damdayvillage.org",
    "password": "Admin@123"
  }
}
```

**Option B: Via Shell Command**

In CapRover shell or SSH:
```bash
npm run db:seed
```

### Step 3: Verify System Health

Visit the status page:
```
https://your-domain.com/admin-panel/status
```

Check that all indicators are green:
- ✅ NEXTAUTH_URL configured
- ✅ NEXTAUTH_SECRET valid
- ✅ Database connected
- ✅ Admin user exists

### Step 4: Login to Admin Panel

1. Go to: `https://your-domain.com/admin-panel/login`
2. Use credentials:
   - **Email:** `admin@damdayvillage.org`
   - **Password:** `Admin@123`
3. **CRITICAL:** Change password immediately after first login!

### Step 5: Configure Domain

If using custom domain:
1. Add domain in CapRover → your app → **HTTP Settings**
2. Update DNS records to point to CapRover server
3. Enable HTTPS for the custom domain
4. Update `NEXTAUTH_URL` in App Configs to use the custom domain
5. Click **Save & Update** and restart app

---

## Troubleshooting

### Issue 1: "500 Internal Server Error" on Login

**Diagnosis:**
Visit: `https://your-domain.com/help/admin-500` or `https://your-domain.com/admin-panel/status`

**Common Causes:**

1. **Environment variables have placeholders**
   - Check App Configs for `$$cap_*$$` patterns
   - Replace with actual values
   - Save & Update

2. **Database not connected**
   - Verify DATABASE_URL is correct
   - Check PostgreSQL app is running in CapRover
   - Test connection: `psql $DATABASE_URL` in container

3. **Admin user not created**
   - Visit: `https://your-domain.com/api/admin/init`
   - Or run: `npm run db:seed` in container

4. **NEXTAUTH_SECRET invalid**
   - Ensure it's 32+ characters
   - No dummy values like "change-me"
   - Generate new: `openssl rand -base64 32`

### Issue 2: Build Fails

**Check logs in CapRover dashboard:**

1. **Out of memory**
   - Increase container memory in App Configs
   - Recommended: 2GB minimum

2. **npm install fails**
   - Check network connectivity
   - Clear build cache: Force rebuild

3. **Prisma generation fails**
   - Ensure DATABASE_URL is set (even with dummy value for build)
   - Check `.env.build` file exists

### Issue 3: Cannot Access Admin Panel

1. **Clear browser cache and cookies**
2. **Check NEXTAUTH_URL matches actual domain** (including https://)
3. **Verify admin user exists:**
   ```bash
   npm run admin:verify
   ```
4. **Check app logs for errors**

### Issue 4: Database Connection Issues

1. **PostgreSQL not running**
   - Check in CapRover Apps list
   - Restart PostgreSQL app if needed

2. **Wrong credentials**
   - Verify password in DATABASE_URL
   - Check PostgreSQL app environment

3. **Hostname not resolving**
   - For CapRover internal: Use `srv-captain--postgres`
   - For external: Ensure host is reachable

### Issue 5: Environment Variables Not Applied

After changing environment variables:
1. **Click "Save & Update"** (not just Save)
2. **Wait for app to restart** (check in App Logs)
3. If still not working, try **Force Rebuild**

---

## Quick Reference

### Essential URLs

| URL | Purpose |
|-----|---------|
| `https://your-domain.com` | Homepage |
| `https://your-domain.com/admin-panel/login` | Admin login |
| `https://your-domain.com/admin-panel/status` | System diagnostics |
| `https://your-domain.com/help/admin-500` | Troubleshooting guide (English) |
| `https://your-domain.com/help/admin-500-hi` | Troubleshooting guide (Hindi) |
| `https://your-domain.com/api/admin/init` | Create admin user |
| `https://your-domain.com/api/health` | Health check |

### Essential Commands

| Command | Purpose |
|---------|---------|
| `npx prisma migrate deploy` | Run database migrations |
| `npm run db:seed` | Create sample data and admin user |
| `npm run admin:verify` | Verify admin user exists |
| `npm run validate:env` | Validate environment variables |
| `openssl rand -base64 32` | Generate NEXTAUTH_SECRET |

### Default Credentials

| Service | Email | Password |
|---------|-------|----------|
| Admin | `admin@damdayvillage.org` | `Admin@123` |
| Host (sample) | `host@damdayvillage.org` | `Host@123` |

**⚠️ Change these passwords immediately after first login!**

---

## Security Best Practices

1. **Change default passwords** - Do this immediately after first login
2. **Use strong NEXTAUTH_SECRET** - Minimum 32 characters, randomly generated
3. **Enable HTTPS** - Always use SSL/TLS in production
4. **Secure database passwords** - Use complex passwords for PostgreSQL
5. **Keep secrets confidential** - Never commit secrets to git
6. **Regular backups** - Set up automated database backups in CapRover
7. **Update regularly** - Keep application and dependencies updated
8. **Monitor logs** - Check App Logs regularly for security issues

---

## Getting Help

If you encounter issues not covered here:

1. **In-App Help**
   - Visit: `https://your-domain.com/help/admin-500` (English)
   - Visit: `https://your-domain.com/help/admin-500-hi` (Hindi)

2. **Check System Status**
   - Visit: `https://your-domain.com/admin-panel/status`

3. **Review Logs**
   - CapRover Dashboard → Your App → App Logs

4. **GitHub Issues**
   - https://github.com/damdayvillage-a11y/Village/issues

---

## Summary Checklist

Before deployment:
- [ ] CapRover server ready
- [ ] Domain configured
- [ ] PostgreSQL deployed
- [ ] NEXTAUTH_SECRET generated

During deployment:
- [ ] All environment variables set
- [ ] No `$$cap_*$$` placeholders remaining
- [ ] HTTPS enabled
- [ ] Build completed successfully

After deployment:
- [ ] Database migrations run
- [ ] Admin user created
- [ ] System status all green
- [ ] Default password changed
- [ ] Can access admin panel

---

**Documentation Version:** 1.0  
**Last Updated:** January 2025  
**Application:** Smart Carbon-Free Village  
**Target Platform:** CapRover
