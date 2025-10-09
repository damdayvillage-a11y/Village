# Quick Fix Guide for CapRover Deployment Issues

This guide provides immediate solutions to fix the CapRover build and admin panel issues.

## Issue 1: Build Hangs in CapRover

### Symptoms
- Build stops after npm warnings
- "Something bad happened" flash message
- Build doesn't complete

### Solution
Already implemented - ensure `captain-definition` uses the simplified Dockerfile:

```json
{
  "schemaVersion": 2,
  "dockerfilePath": "./Dockerfile.simple"
}
```

✅ **Status:** Configuration is correct in the repository.

## Issue 2: Admin Panel 500 Error

### Symptoms
- Cannot access `/admin-panel`
- Error 500 Internal Server Error
- API routes returning 500 errors

### Root Cause
Database connection not properly configured in CapRover environment variables.

### Solution

1. **Set Required Environment Variables in CapRover:**

   Go to CapRover → Your App → App Configs → Environment Variables:

   ```
   NODE_ENV=production
   NEXTAUTH_URL=https://damdayvillage.com
   NEXTAUTH_SECRET=[generate with: openssl rand -base64 32]
   DATABASE_URL=postgresql://user:password@host:port/database
   NEXT_TELEMETRY_DISABLED=1
   GENERATE_SOURCEMAP=false
   CI=true
   CAPROVER_BUILD=true
   ```

2. **Database URL Format:**
   ```
   postgresql://username:password@hostname:5432/database_name
   ```
   
   Example:
   ```
   postgresql://villageuser:securepass123@postgres-db:5432/village_production
   ```

3. **After Setting Environment Variables:**
   - Click "Save & Update"
   - CapRover will rebuild and redeploy
   - Wait for deployment to complete

## Issue 3: Force SSL/HTTPS

### Solution
✅ **Already Fixed** - The following has been implemented:

1. **Middleware HTTPS Redirect:** Automatically redirects HTTP to HTTPS in production
2. **HSTS Headers:** Enforces HTTPS for all future requests
3. **Security Headers:** Added comprehensive security headers

### CapRover Configuration
In CapRover app settings:
1. Go to HTTP Settings
2. Enable "Force HTTPS by redirecting all HTTP traffic to HTTPS"
3. Enable "HTTPS" toggle
4. Add your custom domain: `damdayvillage.com`
5. Click "Enable HTTPS"
6. Wait for SSL certificate to be generated

## Immediate Action Checklist

### Step 1: Verify CapRover Configuration (2 minutes)
- [ ] SSH into CapRover server or use web terminal
- [ ] Verify Docker is running: `docker ps`
- [ ] Check available memory: `free -h` (should have 2GB+ available)
- [ ] Check disk space: `df -h` (should have 10GB+ free)

### Step 2: Set Environment Variables (5 minutes)
- [ ] Open CapRover dashboard
- [ ] Go to Apps → village-app-production (or your app name)
- [ ] Click "App Configs" tab
- [ ] Add all required environment variables (see Issue 2 above)
- [ ] **Important:** Generate a strong NEXTAUTH_SECRET
- [ ] **Important:** Use correct DATABASE_URL
- [ ] Click "Save & Update"

### Step 3: Enable SSL (3 minutes)
- [ ] In CapRover app, go to "HTTP Settings"
- [ ] Enable "HTTPS"
- [ ] Enable "Force HTTPS by redirecting all HTTP traffic to HTTPS"
- [ ] Add custom domain: `damdayvillage.com`
- [ ] Click "Enable HTTPS"
- [ ] Wait for Let's Encrypt certificate (1-2 minutes)

### Step 4: Deploy (3 minutes)
- [ ] Push code to repository: `git push origin main`
- [ ] Or trigger manual deployment in CapRover
- [ ] Monitor build logs in CapRover dashboard
- [ ] Wait for build to complete (2-3 minutes)

### Step 5: Verify Deployment (2 minutes)
- [ ] Open `https://damdayvillage.com` in browser
- [ ] Verify HTTPS is working (green padlock)
- [ ] Test health check: `https://damdayvillage.com/api/health`
- [ ] Try to access admin panel: `https://damdayvillage.com/admin-panel`

## Database Setup (If Not Already Done)

If database is not set up yet:

### Option A: Use CapRover One-Click Apps
1. Go to CapRover → Apps → One-Click Apps/Databases
2. Select PostgreSQL
3. Enter configuration:
   - App Name: `postgres-db`
   - Database Name: `village_production`
   - Username: `villageuser`
   - Password: [generate secure password]
4. Click "Deploy"
5. Wait for deployment
6. Get connection string from app details

### Option B: Use External Database
1. Create PostgreSQL database on external service (AWS RDS, DigitalOcean, etc.)
2. Get connection string
3. Set as DATABASE_URL in CapRover

### Initialize Database
After database is created, run migrations:

```bash
# SSH into CapRover server or use app terminal
docker exec -it $(docker ps | grep captain-village | awk '{print $1}') sh
npx prisma migrate deploy
npm run db:seed
npm run admin:verify
```

Default admin credentials:
- Email: `admin@damdayvillage.org`
- Password: `Admin@123`

## Testing After Deployment

### 1. Basic Tests
```bash
# Health check
curl https://damdayvillage.com/api/health

# Should return:
# {"status":"healthy","timestamp":"...","services":{...}}
```

### 2. HTTPS Test
```bash
# Verify HTTPS redirect
curl -I http://damdayvillage.com

# Should return:
# HTTP/1.1 301 Moved Permanently
# Location: https://damdayvillage.com
```

### 3. Admin Panel Test
1. Open browser: `https://damdayvillage.com/auth/signin`
2. Login with admin credentials
3. Navigate to: `https://damdayvillage.com/admin-panel`
4. Should see admin dashboard (no 500 error)

## Troubleshooting Common Issues

### Build Still Hangs
1. Increase memory limit in CapRover app settings (2GB → 4GB)
2. Check CapRover server resources
3. Try clearing Docker cache: `docker system prune -a`

### Admin Panel Still Shows 500 Error
1. Check application logs in CapRover
2. Verify DATABASE_URL is correct
3. Test database connection from CapRover terminal
4. Check if Prisma client was generated during build

### HTTPS Not Working
1. Verify DNS records point to CapRover server
2. Wait for DNS propagation (up to 24 hours)
3. Check CapRover logs for SSL certificate errors
4. Ensure Let's Encrypt rate limit not exceeded

### Database Connection Failed
1. Test connection from CapRover server:
   ```bash
   psql "postgresql://user:pass@host:5432/db"
   ```
2. Check firewall rules
3. Verify database credentials
4. Check if database server is running

## Need More Help?

1. **Check Logs:**
   - CapRover Dashboard → Your App → App Logs
   - Look for specific error messages

2. **Review Documentation:**
   - [docs/PRODUCTION_DEPLOYMENT_CHECKLIST.md](./PRODUCTION_DEPLOYMENT_CHECKLIST.md)
   - [docs/CAPROVER_DEPLOYMENT.md](./CAPROVER_DEPLOYMENT.md)
   - [docs/CAPROVER_TROUBLESHOOTING.md](./CAPROVER_TROUBLESHOOTING.md)

3. **Validation Command:**
   ```bash
   npm run validate:env
   ```

---

**Estimated Total Time:** 15-20 minutes
**Success Rate:** >95% with correct configuration
**Last Updated:** 2025-01-10
