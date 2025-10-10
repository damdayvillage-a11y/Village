# Admin Panel 500 Error - Complete Fix Guide

## Problem
After deploying to CapRover, the admin panel login shows a "500 Internal Server Error" and authentication fails.

## Root Causes

1. **CapRover placeholders not replaced** - Environment variables still contain `$$cap_*$$` patterns
2. **Database not configured** - DATABASE_URL is invalid or PostgreSQL is not accessible
3. **Admin user doesn't exist** - Database is connected but admin user was never created
4. **Authentication misconfiguration** - NEXTAUTH_URL or NEXTAUTH_SECRET are invalid

## Quick Diagnosis

### Step 1: Check System Status

Visit your deployment's status page:
```
https://your-domain.com/admin-panel/status
```

This page will show you:
- ✅ or ❌ for each system component
- Specific error messages
- Recommended fixes

### Step 2: Check Environment Variables

```bash
curl https://your-domain.com/api/admin/check-env
```

This will validate:
- All required environment variables are set
- No dummy or placeholder values remain
- Proper format and security requirements

### Step 3: Verify Admin User

```bash
curl https://your-domain.com/api/admin/verify-setup
```

This checks if the admin user exists and is properly configured.

## Solutions

### Solution 1: Auto-Fix (Recommended for Quick Setup)

If your database is connected but admin user is missing:

**Visit in Browser:**
```
https://your-domain.com/api/admin/init
```

**Or via Command Line:**
```bash
curl -X POST https://your-domain.com/api/admin/init
```

This will:
- ✅ Create admin user if it doesn't exist
- ✅ Use default credentials: `admin@damdayvillage.org` / `Admin@123`
- ✅ Return success message with credentials

⚠️ **IMPORTANT:** Change the password immediately after first login!

### Solution 2: Fix CapRover Environment Variables

1. **Access CapRover Dashboard**
   - Go to: `https://captain.your-domain.com`
   - Navigate to your app
   - Click "App Configs" tab

2. **Replace ALL Placeholders**

   Find and replace these variables:

   ```bash
   # CRITICAL - Replace these!
   NEXTAUTH_URL=https://your-actual-domain.com
   NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
   DATABASE_URL=postgresql://user:password@host:5432/database
   ```

   **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

3. **Verify Configuration**
   ```bash
   npm run validate:env
   ```

4. **Restart Application**
   - In CapRover dashboard, click "Save & Restart"

### Solution 3: Database Setup

If database is not connected:

1. **Create PostgreSQL Database** (if using CapRover's One-Click Apps):
   - In CapRover, go to Apps → One-Click Apps/Databases
   - Deploy PostgreSQL
   - Note the connection details

2. **Update DATABASE_URL**:
   ```
   postgresql://postgres:YOUR_PASSWORD@srv-captain--postgres:5432/village_db
   ```

3. **Run Migrations**:
   ```bash
   npx prisma migrate deploy
   ```

4. **Seed Database** (creates admin user):
   ```bash
   npm run db:seed
   ```

### Solution 4: Manual Admin User Creation

If automatic methods don't work:

1. **Connect to Database**:
   ```bash
   psql postgresql://user:password@host:5432/database
   ```

2. **Or use Prisma Studio**:
   ```bash
   npx prisma studio
   ```

3. **Create Admin User** with these values:
   - Email: `admin@damdayvillage.org`
   - Password: Hash of `Admin@123` (use argon2)
   - Role: `ADMIN`
   - Verified: `true`
   - Active: `true`

## Default Admin Credentials

After any of the above solutions, you can login with:

- **Email:** `admin@damdayvillage.org`
- **Password:** `Admin@123`

**You can customize the default password** by setting environment variable:
```bash
ADMIN_DEFAULT_PASSWORD=YourSecurePassword123
```

Then run the init endpoint again.

## Testing the Fix

1. **Visit Status Page**:
   ```
   https://your-domain.com/admin-panel/status
   ```
   All checks should be green (✅)

2. **Try Admin Login**:
   ```
   https://your-domain.com/admin-panel/login
   ```
   Login with: `admin@damdayvillage.org` / `Admin@123`

3. **Change Password**:
   - After successful login, go to Profile Settings
   - Change password immediately
   - Update email if needed

## Common Issues & Fixes

### Issue: "Database connection failed"

**Check:**
```bash
# Test database connectivity
curl https://your-domain.com/api/health

# Check if PostgreSQL is running
docker ps | grep postgres  # If using Docker
```

**Fix:**
- Verify DATABASE_URL format: `postgresql://user:pass@host:5432/db`
- Check firewall rules allow connection
- Ensure PostgreSQL service is running
- Verify credentials are correct

### Issue: "NEXTAUTH_URL contains placeholders"

**Fix:**
```bash
# In CapRover App Configs, set:
NEXTAUTH_URL=https://damdayvillage.com

# NOT:
NEXTAUTH_URL=https://$$cap_appname$$.$$cap_root_domain$$
```

### Issue: "NEXTAUTH_SECRET is too short"

**Fix:**
```bash
# Generate secure secret:
openssl rand -base64 32

# Then set in CapRover:
NEXTAUTH_SECRET=<paste-generated-value>
```

### Issue: "Admin user exists but can't login"

**Possible causes:**
1. Password incorrect
2. User not verified
3. User not active
4. Wrong role

**Fix:**
```bash
# Verify admin setup
npm run admin:verify

# Reset admin user
npm run db:seed  # This will upsert (update or create)
```

## Advanced Diagnostics

### Enable Debug Logging

Add to environment variables:
```bash
NODE_ENV=development  # Temporarily, for detailed errors
DEBUG=*               # Enable all debug logs
```

Then check logs:
```bash
# In CapRover
# Go to App → Logs tab

# Or if you have SSH access
docker logs <container-name>
```

### Check Application Logs

Look for these patterns:
- `Database connection failed` - DB issue
- `Invalid credentials` - Wrong username/password
- `ECONNREFUSED` - Service not running
- `ENOTFOUND` - Hostname resolution failed

### Validate Configuration Script

Run comprehensive validation:
```bash
npm run validate:env
```

This checks:
- ✅ All required variables present
- ✅ No dummy/placeholder values
- ✅ Proper format and length
- ✅ Security requirements met

## Post-Fix Security Checklist

After fixing the 500 error:

- [ ] Changed default admin password
- [ ] NEXTAUTH_SECRET is 32+ characters and random
- [ ] DATABASE_URL uses strong password
- [ ] HTTPS/SSL is enabled (not HTTP)
- [ ] Admin email changed from default
- [ ] Database backups configured
- [ ] Monitoring/alerts enabled
- [ ] Rate limiting configured
- [ ] CORS properly set up

## Support & Resources

- **Status Page:** `/admin-panel/status`
- **Health Check:** `/api/health`
- **Admin Init:** `/api/admin/init`
- **Environment Check:** `/api/admin/check-env`
- **Admin Verification:** `/api/admin/verify-setup`

**Documentation:**
- `ADMIN_PANEL_SETUP.md` - Complete setup guide
- `ADMIN_PANEL_FIX_COMPLETE.md` - Previous fixes
- `PRODUCTION_READINESS.md` - Production checklist
- `CAPROVER_DEPLOYMENT_GUIDE.md` - CapRover specific guide

## Need More Help?

1. Check system status: `https://your-domain.com/admin-panel/status`
2. Review logs in CapRover dashboard
3. Run diagnostic script: `./scripts/diagnose-production.sh`
4. Check documentation in `/docs` directory
5. Open an issue with:
   - Status page screenshot
   - Relevant log excerpts (mask sensitive data!)
   - Environment variable validation results

---

**Remember:** The new auto-initialization feature (`/api/admin/init`) makes it easy to recover from missing admin user issues. Just visit that endpoint after ensuring your database is properly configured!
