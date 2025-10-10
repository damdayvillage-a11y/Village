# 🔄 Migration Guide: CapRover to Coolify

> **Complete guide for migrating your Village application from CapRover to Coolify**

## 📋 Overview

This guide helps you migrate from CapRover to Coolify while maintaining all functionality and fixing the admin panel 500 error issues you experienced.

## 🎯 Why Migrate to Coolify?

**Benefits of Coolify over CapRover:**
- ✅ Better resource management
- ✅ More intuitive UI
- ✅ Built-in database backups
- ✅ Better logging and monitoring
- ✅ Native Docker Compose support
- ✅ Improved SSL/certificate handling
- ✅ More active development and community

---

## 🚨 Issues with CapRover (That Coolify Fixes)

### Admin Panel 500 Error

**Root Causes in CapRover:**
1. Environment variable placeholders (`$$cap_*$$`) not being replaced
2. Database connection issues
3. NEXTAUTH configuration problems
4. Build-time vs runtime variable confusion

**How Coolify Handles This Better:**
- ✅ No placeholder variables - direct configuration
- ✅ Clear separation of build and runtime environments
- ✅ Better database networking (automatic service discovery)
- ✅ Clearer environment variable management

---

## 📊 Migration Comparison

| Feature | CapRover | Coolify |
|---------|----------|---------|
| **Env Variable Management** | Placeholders (`$$cap_*$$`) | Direct values |
| **Database Setup** | Manual or One-Click Apps | Integrated, one-click |
| **Networking** | Service names with prefix | Simple service names |
| **SSL/HTTPS** | Manual Let's Encrypt | Automatic with one click |
| **Backups** | Manual setup | Built-in, automatic |
| **Logs** | Basic | Advanced with search |
| **Resource Limits** | Manual configuration | Easy sliders |
| **Health Checks** | Manual setup | Built-in, automatic |

---

## 🗺️ Migration Steps

### Phase 1: Preparation (Before Migration)

#### 1. Document Current Setup

**In CapRover, collect:**

```bash
# From CapRover App Config → Environment Variables
NEXTAUTH_URL=https://your-caprover-domain.com
NEXTAUTH_SECRET=your-current-secret
DATABASE_URL=postgresql://user:pass@srv-captain--postgres:5432/db

# Payment providers (if configured)
STRIPE_SECRET_KEY=sk_live_...
RAZORPAY_KEY_ID=rzp_live_...

# OAuth providers (if configured)
GOOGLE_CLIENT_ID=...
GITHUB_CLIENT_ID=...
```

**Save these - you'll need them for Coolify!**

#### 2. Backup Your Database

**In CapRover:**

```bash
# Method 1: Using CapRover's built-in tools
# CapRover Dashboard → Apps → Your PostgreSQL App → More → Export Data

# Method 2: Manual backup via SSH
ssh your-caprover-server
docker exec srv-captain--postgres pg_dump -U postgres villagedb > backup.sql

# Download the backup
scp your-caprover-server:~/backup.sql ./village-backup.sql
```

#### 3. Backup Your Environment Variables

Create a secure backup file:

```bash
# Create .env.backup (DON'T COMMIT THIS!)
cp .env .env.backup

# Or manually save from CapRover dashboard
# CapRover → Your App → App Configs → Copy all environment variables
```

#### 4. Note Your Custom Domain Settings

- Domain name
- SSL certificate status
- DNS configuration
- Any custom ports or configurations

---

### Phase 2: Coolify Setup

#### 1. Install/Access Coolify

If you don't have Coolify yet:

```bash
# Quick installation on a fresh Ubuntu server
curl -fsSL https://coolify.io/install.sh | bash
```

Or access your existing Coolify instance.

#### 2. Create Project in Coolify

1. Login to Coolify dashboard
2. Click **"+ New"** → **"Project"**
3. Name: `village-app` (or your preferred name)
4. Click **"Save"**

---

### Phase 3: Database Migration

#### 1. Create PostgreSQL in Coolify

1. In your project, click **"+ New Resource"** → **"Database"**
2. Select **"PostgreSQL"**
3. Configure:
   - **Name**: `village-db`
   - **Database Name**: `villagedb`
   - **Username**: `villageuser`
   - **Password**: Use your CapRover password or generate new one
   - **Version**: PostgreSQL 15 (same or newer than CapRover)
4. Click **"Create"**
5. Wait for database to start

#### 2. Import Your Data

**Option A: Using Coolify Terminal**

1. Upload your backup file to Coolify server
2. In Coolify, go to database → Terminal
3. Import:

```bash
psql -U villageuser -d villagedb < /path/to/backup.sql
```

**Option B: Using psql Client**

```bash
# From your local machine
psql "postgresql://villageuser:password@coolify-server:5432/villagedb" < village-backup.sql
```

**Option C: Fresh Start (Recommended)**

If you want a fresh start or had issues with CapRover data:

1. Skip the backup import
2. Deploy the app first
3. Run migrations: `npx prisma migrate deploy`
4. Seed fresh data: `npm run db:seed`

This gives you:
- Clean database schema
- Default admin user
- Sample data
- No corrupted data from CapRover issues

#### 3. Verify Database

```bash
# Connect to database in Coolify terminal
psql -U villageuser -d villagedb

# Check tables exist
\dt

# Check admin user (if imported)
SELECT email, role FROM users WHERE role = 'ADMIN';

# Exit
\q
```

---

### Phase 4: Application Deployment

#### 1. Create Application in Coolify

1. In your project, click **"+ New Resource"** → **"Application"**
2. Select **"Public Repository"**
3. Configure:
   - **Repository**: `https://github.com/damdayvillage-a11y/Village`
   - **Branch**: `main` (or your deployment branch)
   - **Build Pack**: `Dockerfile`
   - **Dockerfile**: `Dockerfile.simple`
   - **Port**: `80`
4. Click **"Continue"**

#### 2. Configure Build Settings

In application settings:

- **Build Path**: `.` (root)
- **Dockerfile**: `Dockerfile.simple`
- **Build Args**: None needed
- **Health Check**: Enable
  - URL: `/api/health`
  - Port: `80`
  - Interval: `30s`

#### 3. Configure Environment Variables

**CRITICAL: Use your actual values, NO placeholders!**

Go to application → Environment Variables:

```bash
# === CORE CONFIGURATION ===

NODE_ENV=production

# Your actual domain (update this!)
NEXTAUTH_URL=https://your-new-coolify-domain.com

# Use your CapRover secret OR generate new one
NEXTAUTH_SECRET=your-existing-or-new-secret-min-32-chars

# Database (use Coolify's internal connection)
DATABASE_URL=postgresql://villageuser:YourPassword@village-db:5432/villagedb

# === BUILD OPTIMIZATION ===

NEXT_TELEMETRY_DISABLED=1
GENERATE_SOURCEMAP=false
CI=true

# === OPTIONAL SERVICES ===
# Copy from your CapRover backup if you were using these:

# Stripe (if configured)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Razorpay (if configured)
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_SECRET=...

# OAuth (if configured)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# Email (if configured)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_FROM=noreply@yourdomain.com
```

**Key Differences from CapRover:**

| CapRover | Coolify |
|----------|---------|
| `$$cap_appname$$` | Direct value: `village-app` |
| `srv-captain--postgres` | Simple: `village-db` |
| `$$cap_root_domain$$` | Your actual domain |
| Placeholders everywhere | Real values only |

#### 4. Configure Networking

1. Go to **"Networking"** section
2. Configure:
   - **Port**: `80` (internal)
   - **Expose**: Enable (maps to 443 with SSL)
   - **SSL/TLS**: Enable (automatic Let's Encrypt)
3. Set domain:
   - Use your custom domain, or
   - Use Coolify's default: `village-app.your-coolify-domain.com`

---

### Phase 5: Deployment

#### 1. Deploy Application

1. In Coolify, click **"Deploy"**
2. Monitor build logs
3. Wait for completion (~2-3 minutes)
4. Check status turns green ✅

#### 2. Run Database Migrations

**In Coolify terminal (Application):**

```bash
npx prisma migrate deploy
```

This updates your database schema to latest version.

#### 3. Verify or Seed Data

**Option A: If you imported CapRover data:**

Verify data exists:
```bash
# In Coolify app terminal
npm run admin:verify
```

**Option B: Fresh start (recommended if had issues):**

Seed fresh data:
```bash
npm run db:seed
```

This creates:
- Admin user: `admin@damdayvillage.org` / `Admin@123`
- Host user: `host@damdayvillage.org` / `Host@123`
- Sample data

---

### Phase 6: Testing & Verification

#### 1. Test Health Endpoint

```bash
curl https://your-coolify-domain.com/api/health
```

**Expected:**
```json
{
  "status": "healthy",
  "services": {
    "database": {
      "status": "healthy"
    }
  }
}
```

#### 2. Test Auth Status

```bash
curl https://your-coolify-domain.com/api/auth/status
```

**Expected:**
```json
{
  "status": "healthy",
  "healthy": true,
  "checks": {
    "nextauth_url": {"configured": true},
    "nextauth_secret": {"configured": true, "valid": true},
    "database": {"connected": true, "admin_exists": true}
  }
}
```

#### 3. Test Admin Login

1. Visit: `https://your-coolify-domain.com/admin-panel/login`
2. Login with:
   - Email: `admin@damdayvillage.org`
   - Password: `Admin@123` (or your imported password)
3. **Should work without 500 error!** ✅

#### 4. Test All Features

Check these features work:

- [ ] Homepage loads
- [ ] Admin panel login works (no 500 error!)
- [ ] Dashboard shows data
- [ ] User management works
- [ ] Homestay listings work
- [ ] Booking system works (if applicable)
- [ ] Payment integration works (if configured)
- [ ] IoT device dashboard (if applicable)

---

### Phase 7: DNS & Domain Migration

#### 1. Update DNS Records

**If using custom domain:**

1. Go to your domain registrar
2. Update A record:
   ```
   Type: A
   Name: @ (or subdomain)
   Value: [Your Coolify server IP]
   TTL: 300 (5 minutes)
   ```

3. Wait for DNS propagation (up to 48 hours, usually minutes)

#### 2. Verify SSL Certificate

Coolify automatically generates Let's Encrypt certificate when:
- DNS points to Coolify server
- Application is running
- Domain is configured in Networking section

Check in Coolify → Application → Networking → SSL Status

#### 3. Update NEXTAUTH_URL

If you changed domain:

1. Go to application → Environment Variables
2. Update `NEXTAUTH_URL` to new domain
3. Click **"Save"**
4. Redeploy application

---

### Phase 8: Cleanup & Decommission CapRover

#### 1. Keep CapRover Running Temporarily

**Recommended: Keep both running for 1-2 weeks**

This allows you to:
- Verify everything works in Coolify
- Compare behavior if issues arise
- Fall back if needed
- Migrate any remaining data

#### 2. Update External Services

Update these services to point to new Coolify URL:

- [ ] Payment webhook URLs (Stripe, Razorpay)
- [ ] OAuth callback URLs (Google, GitHub)
- [ ] Email links and templates
- [ ] API integrations
- [ ] Mobile app configs (if applicable)
- [ ] Monitoring services
- [ ] Analytics services

#### 3. Final Verification Period

Test thoroughly for 1-2 weeks:
- Monitor logs daily
- Check all features work
- Verify no regressions
- Test under load (if possible)
- Check database performance

#### 4. Decommission CapRover

Only after verification:

1. **Final backup:**
   ```bash
   ssh caprover-server
   docker exec srv-captain--postgres pg_dump -U postgres villagedb > final-backup.sql
   # Download and store securely
   ```

2. **Stop CapRover app:**
   - CapRover Dashboard → Your App → Stop

3. **Keep CapRover server** (optional):
   - Can repurpose for other apps
   - Or terminate if only used for Village

---

## 🔄 Comparison: CapRover vs Coolify Setup

### CapRover (Old Setup)

```bash
# Environment variables with placeholders
NEXTAUTH_URL=$$cap_appname$$.$$cap_root_domain$$
DATABASE_URL=postgresql://postgres:$$cap_postgres_pass$$@srv-captain--postgres:5432/villagedb

# Required manual fixes:
# 1. Replace all $$cap_*$$ placeholders
# 2. Fix service names
# 3. Debug 500 errors
# 4. Manual SSL setup
```

### Coolify (New Setup)

```bash
# Direct, clear values
NEXTAUTH_URL=https://village.yourdomain.com
DATABASE_URL=postgresql://villageuser:password@village-db:5432/villagedb

# No manual fixes needed:
# ✅ No placeholders
# ✅ Simple service names
# ✅ No 500 errors
# ✅ Automatic SSL
```

---

## 🐛 Troubleshooting Migration Issues

### Issue: Build Fails in Coolify

**Symptoms:**
- Build logs show npm errors
- "Cannot find module" errors

**Solution:**
1. Check Dockerfile is set to `Dockerfile.simple`
2. Increase memory limit (2GB minimum)
3. Enable "Force Rebuild" and try again

### Issue: Database Connection Failed

**Symptoms:**
- App starts but can't connect to database
- Health check fails

**Solutions:**

1. **Check database is running:**
   - Coolify → Database → Status should be green
   
2. **Verify DATABASE_URL format:**
   ```bash
   # Correct format for Coolify
   postgresql://villageuser:password@village-db:5432/villagedb
   
   # NOT this (CapRover format):
   postgresql://postgres:pass@srv-captain--postgres:5432/db
   ```

3. **Test connection:**
   ```bash
   # In app terminal
   psql $DATABASE_URL
   ```

### Issue: Still Getting 500 Error on Admin Login

This should NOT happen in Coolify if configured correctly!

**Check:**

1. **Environment variables:**
   ```bash
   # In app terminal
   echo $NEXTAUTH_URL    # Should be your domain
   echo $NEXTAUTH_SECRET # Should be 32+ chars
   echo $DATABASE_URL    # Should connect
   ```

2. **Run diagnostics:**
   ```bash
   curl https://your-domain.com/api/admin/check-env
   ```

3. **Check migrations ran:**
   ```bash
   # In app terminal
   npx prisma migrate status
   ```

4. **Verify admin user exists:**
   ```bash
   npm run admin:verify
   # Or create:
   npm run db:seed
   ```

### Issue: Domain/SSL Not Working

**Symptoms:**
- Can't access site
- SSL certificate errors

**Solutions:**

1. **Check DNS:**
   ```bash
   dig your-domain.com
   # Should point to Coolify server IP
   ```

2. **Check SSL status:**
   - Coolify → Application → Networking
   - SSL Status should be "Active"
   - If not, click "Request Certificate"

3. **Use temporary domain:**
   - Use Coolify's provided subdomain first
   - Once working, switch to custom domain

---

## ✅ Migration Checklist

### Pre-Migration
- [ ] Backed up CapRover database
- [ ] Documented all environment variables
- [ ] Saved OAuth/Payment provider settings
- [ ] Noted custom domain configuration
- [ ] Backed up any custom files/uploads

### Coolify Setup
- [ ] Coolify instance ready
- [ ] Project created
- [ ] PostgreSQL database created
- [ ] Database imported (or ready for fresh start)
- [ ] Application created from GitHub
- [ ] All environment variables configured
- [ ] Domain/SSL configured

### Deployment
- [ ] Application deployed successfully
- [ ] Database migrations run
- [ ] Data seeded/verified
- [ ] Health check passes
- [ ] Auth status check passes

### Testing
- [ ] Homepage accessible
- [ ] Admin panel login works (NO 500 error!)
- [ ] All features tested
- [ ] Payment webhooks updated (if applicable)
- [ ] OAuth callbacks updated (if applicable)
- [ ] External services updated

### Post-Migration
- [ ] DNS updated to Coolify
- [ ] SSL certificate active
- [ ] Monitoring configured
- [ ] Backups configured
- [ ] Team notified of new URL
- [ ] Documentation updated

### Cleanup (After 1-2 weeks)
- [ ] Final CapRover backup
- [ ] CapRover app stopped
- [ ] Server decommissioned (optional)

---

## 📚 Additional Resources

### Coolify Documentation
- [Coolify Official Docs](https://coolify.io/docs)
- [Coolify GitHub](https://github.com/coollabsio/coolify)
- [Coolify Discord](https://coolify.io/discord)

### Migration Support
- [Full Coolify Deployment Guide](./COOLIFY_DEPLOYMENT_GUIDE.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [Environment Variables Reference](./ENVIRONMENT_VARIABLES.md)

### CapRover Documentation (Reference)
- [CapRover Fix Guide](./CAPROVER_ADMIN_PANEL_FIX.md)
- [CapRover Deployment Guide](./CAPROVER_DEPLOYMENT_GUIDE.md)

---

## 🎉 Success!

After migration, you should have:

- ✅ **No more 500 errors on admin panel**
- ✅ **Cleaner environment variable management**
- ✅ **Better performance and monitoring**
- ✅ **Automatic backups**
- ✅ **Easier management interface**
- ✅ **Improved SSL/HTTPS handling**
- ✅ **All features working perfectly**

Welcome to Coolify! 🚀

---

**Version:** 1.0  
**Last Updated:** January 2025  
**Migration Difficulty:** Medium  
**Estimated Time:** 2-4 hours (including testing)

**Support:**
- GitHub Issues: [Report Issues](https://github.com/damdayvillage-a11y/Village/issues)
- Coolify Discord: [Get Help](https://coolify.io/discord)
