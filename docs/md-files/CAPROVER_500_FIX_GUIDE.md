# CapRover 500 Internal Server Error - Complete Fix Guide

## 🔴 Problem: Admin Panel Login Shows 500 Internal Server Error

This guide helps you **systematically diagnose and fix** the 500 error when logging into the admin panel on CapRover.

---

## 🚀 Quick Fix (Most Common Issues)

### Step 1: Check System Status First

Visit your deployed app's status page:
```
https://your-domain.com/admin-panel/status
```

This page will show you exactly what's wrong. The most common issues are:

1. **Environment variables contain placeholders** (e.g., `$$cap_appname$$`)
2. **NEXTAUTH_SECRET is not set or too short**
3. **DATABASE_URL is not configured correctly**
4. **Admin user doesn't exist in database**

---

## 📋 Complete Step-by-Step Solution

### Phase 1: Verify Environment Variables in CapRover

#### Step 1.1: Access CapRover Dashboard
1. Log into your CapRover dashboard
2. Navigate to **Apps** → Click on your app name
3. Go to **App Configs** tab
4. Scroll down to **Environment Variables** section

#### Step 1.2: Replace ALL Placeholders

**⚠️ CRITICAL:** Look for any values containing `$$cap_*$$` and replace them!

**Check these REQUIRED variables:**

##### ✅ NEXTAUTH_URL
```bash
# ❌ WRONG (contains placeholder):
NEXTAUTH_URL=https://$$cap_appname$$.$$cap_root_domain$$

# ✅ CORRECT (actual domain):
NEXTAUTH_URL=https://your-actual-domain.com
# OR if using CapRover subdomain:
NEXTAUTH_URL=https://village.captain.yourdomain.com
```

##### ✅ NEXTAUTH_SECRET
```bash
# ❌ WRONG (placeholder or too short):
NEXTAUTH_SECRET=$$cap_nextauth_secret$$
NEXTAUTH_SECRET=change-me
NEXTAUTH_SECRET=short

# ✅ CORRECT (generate a new one):
# Run this command on your computer:
openssl rand -base64 32

# Copy the output and paste it as NEXTAUTH_SECRET value
# Example output (yours will be different):
NEXTAUTH_SECRET=BAWGc+0joocoP+7LA8EEExs+I9eDh5vQeog4vhyku7g=
```

##### ✅ DATABASE_URL
```bash
# ❌ WRONG (contains placeholder):
DATABASE_URL=$$cap_database_url$$

# ✅ CORRECT (CapRover PostgreSQL service):
DATABASE_URL=postgresql://username:password@srv-captain--postgres:5432/villagedb

# Replace:
# - username: your PostgreSQL username (e.g., damdiyal)
# - password: your PostgreSQL password
# - srv-captain--postgres: CapRover internal service name (keep as-is!)
# - villagedb: your database name

# Example:
DATABASE_URL=postgresql://damdiyal:MySecurePass123@srv-captain--postgres:5432/villagedb
```

**📝 Important:** The `srv-captain--` prefix is CapRover's internal service naming convention. It is **NOT** a placeholder! Keep it as-is when using CapRover's PostgreSQL service.

#### Step 1.3: Save and Redeploy
1. Click **Save & Update** button at the bottom
2. Wait for the app to automatically redeploy (2-3 minutes)
3. Check deployment logs for any errors

---

### Phase 2: Verify Database Connection

#### Step 2.1: Check PostgreSQL is Running
In CapRover dashboard:
1. Go to **Apps**
2. Find your PostgreSQL app (e.g., `postgres`)
3. Make sure it shows status: **Running** (green)
4. If not running, click **Start** button

#### Step 2.2: Verify Database Connection
SSH into your CapRover server and run:

```bash
# SSH into CapRover server
ssh root@your-server-ip

# Test database connection
docker exec -it $(docker ps | grep captain-village | awk '{print $1}') sh
cd /app
npm run db:test
```

**Expected output:**
```
✅ Database connection successful!
✅ Admin user exists
```

**If connection fails:**
- Check DATABASE_URL is correct
- Ensure PostgreSQL container is running
- Verify network connectivity between containers
- Check PostgreSQL logs in CapRover dashboard

---

### Phase 3: Create/Verify Admin User

#### Option A: Via Browser (Easiest!)

Visit this URL in your browser:
```
https://your-domain.com/api/admin/init
```

**Expected response:**
```json
{
  "success": true,
  "message": "Admin user created successfully",
  "credentials": {
    "email": "admin@damdayvillage.org",
    "password": "Admin@123",
    "warning": "⚠️ IMPORTANT: Change this password immediately after first login!"
  }
}
```

If you see this, the admin user is created! Proceed to **Phase 4**.

#### Option B: Via CapRover Dashboard

1. Go to your app in CapRover
2. Click **Deployment** tab
3. Scroll to **Execute Shell Command in Running Container**
4. Run:
   ```bash
   npm run db:seed
   ```
5. Wait for completion (should see "✅ Admin user created")

#### Option C: Via SSH

```bash
# SSH into CapRover server
ssh root@your-server-ip

# Access container
docker exec -it $(docker ps | grep captain-village | awk '{print $1}') sh

# Create admin user
cd /app
npm run db:seed
```

---

### Phase 4: Verify Everything Works

#### Step 4.1: Check System Status
Visit: `https://your-domain.com/admin-panel/status`

**All items should show ✅ (green checkmarks):**
- NEXTAUTH_URL: ✅ Configured
- NEXTAUTH_SECRET: ✅ Valid (32+ characters)
- Database: ✅ Connected
- Admin User: ✅ Exists

#### Step 4.2: Test Login
1. Go to: `https://your-domain.com/admin-panel/login`
2. Enter credentials:
   - **Email:** `admin@damdayvillage.org`
   - **Password:** `Admin@123`
3. Click **Sign in as Admin**
4. You should be redirected to the admin panel!

#### Step 4.3: Change Default Password (IMPORTANT!)
After first successful login:
1. Go to profile settings
2. Change password immediately
3. Use a strong password (min 12 characters, mix of letters, numbers, symbols)

---

## 🔍 Advanced Diagnostics

### Run Full Diagnostic

SSH into your container and run:

```bash
# SSH into CapRover
ssh root@your-server-ip

# Enter container
docker exec -it $(docker ps | grep captain-village | awk '{print $1}') sh

# Run diagnostics
cd /app

# Check environment variables
npm run validate:env

# Verify admin user
npm run admin:verify

# Test database connection
npm run db:test

# Run full diagnostic
npm run admin:diagnose https://your-domain.com
```

### Check Application Logs

In CapRover Dashboard:
1. Go to your app
2. Click **Logs** tab
3. Look for error messages
4. Common errors and their fixes:

```
❌ "Database connection failed"
→ Fix: Check DATABASE_URL, ensure PostgreSQL is running

❌ "NEXTAUTH_SECRET is not set"
→ Fix: Generate and set NEXTAUTH_SECRET

❌ "Cannot find module '@prisma/client'"
→ Fix: Rebuild app - delete and redeploy

❌ "Invalid credentials"
→ Fix: Create admin user via /api/admin/init

❌ "ECONNREFUSED"
→ Fix: PostgreSQL not running or wrong host in DATABASE_URL
```

---

## 🛠️ Common Issues and Solutions

### Issue 1: "500 Error" persists after fixing environment variables

**Solution:**
```bash
# Force rebuild and redeploy
# In CapRover Dashboard:
1. Go to App Configs
2. Make a small change (add a space to any variable)
3. Click Save & Update
4. Or trigger a new deployment from GitHub
```

### Issue 2: Admin user creation fails

**Error:** "Table 'User' does not exist"

**Solution:**
```bash
# Run database migrations
docker exec -it $(docker ps | grep captain-village | awk '{print $1}') sh
cd /app
npx prisma migrate deploy
npm run db:seed
```

### Issue 3: Can't access /admin-panel/status page

**Solution:**
The issue is at the build/deployment level. Check:
1. Build logs in CapRover for errors
2. Ensure app is actually running (not crashed)
3. Check resource limits (increase memory if needed)

### Issue 4: PostgreSQL connection issues

**Error:** "ECONNREFUSED" or "ENOTFOUND"

**Check list:**
- [ ] PostgreSQL container is running in CapRover
- [ ] DATABASE_URL uses `srv-captain--postgres` for internal service
- [ ] Username and password are correct
- [ ] Database name exists
- [ ] Port is 5432 (default)

**Test connection:**
```bash
# From within app container
psql "$DATABASE_URL"
# Should connect without errors
```

### Issue 5: "Prisma Client not found" error

**Solution:**
```bash
# Rebuild Prisma Client
docker exec -it $(docker ps | grep captain-village | awk '{print $1}') sh
cd /app
npx prisma generate
```

---

## 📖 Reference: Required Environment Variables

Copy these to CapRover App Configs and replace values:

```bash
# =============================================================================
# REQUIRED - Core Settings
# =============================================================================
NODE_ENV=production
NEXTAUTH_URL=https://your-actual-domain.com
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
DATABASE_URL=postgresql://user:pass@srv-captain--postgres:5432/villagedb

# =============================================================================
# REQUIRED - Build Settings
# =============================================================================
NEXT_TELEMETRY_DISABLED=1
GENERATE_SOURCEMAP=false
CI=true
CAPROVER_BUILD=true

# =============================================================================
# OPTIONAL - Only if using these features
# =============================================================================
# Payment (remove if not using)
# STRIPE_SECRET_KEY=sk_test_...
# RAZORPAY_KEY_ID=rzp_test_...

# OAuth (remove if not using)
# GOOGLE_CLIENT_ID=your-client-id
# GITHUB_CLIENT_ID=your-client-id

# Email (remove if not using)
# EMAIL_SERVER_HOST=smtp.gmail.com
# EMAIL_FROM=noreply@yourdomain.com
```

---

## 🆘 Still Having Issues?

### Quick Links
- **Status Page:** `https://your-domain.com/admin-panel/status`
- **Create Admin:** `https://your-domain.com/api/admin/init`
- **Health Check:** `https://your-domain.com/api/health`
- **Env Check:** `https://your-domain.com/api/admin/check-env`

### Documentation
- [CAPGUIDE.md](./CAPGUIDE.md) - Complete CapRover deployment guide
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - General troubleshooting
- [docs/PRODUCTION_LOGIN_TROUBLESHOOTING.md](./docs/PRODUCTION_LOGIN_TROUBLESHOOTING.md) - Production login issues

### Get Help
1. Check application logs in CapRover dashboard
2. Run diagnostic commands shown in this guide
3. Check GitHub issues for similar problems
4. Contact support with:
   - Output from `npm run validate:env`
   - Output from `npm run admin:diagnose`
   - Screenshots of error messages
   - CapRover application logs

---

## ✅ Success Checklist

After following this guide, verify:

- [ ] All environment variables are set (no `$$cap_*$$` placeholders)
- [ ] NEXTAUTH_SECRET is 32+ characters and unique
- [ ] DATABASE_URL connects successfully
- [ ] PostgreSQL container is running
- [ ] Database migrations are applied
- [ ] Admin user exists in database
- [ ] `/admin-panel/status` shows all green checks
- [ ] Can login at `/admin-panel/login`
- [ ] Default password changed after first login

**If all items are checked, you're done! 🎉**

---

**Last Updated:** 2025-10-15
**Version:** 1.0.0
