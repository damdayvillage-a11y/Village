# Admin Panel 500 Error - Quick Fix Guide

## 🚨 Getting a 500 Error on `/admin-panel`?

Follow these steps in order:

## Step 1: Check System Status 🩺

**Visit:** `https://your-domain.com/admin-panel/status`

This page shows you exactly what's wrong:
- ✅ **Green** = Everything works, you can login
- ⚠️ **Yellow** = Degraded (database OK but admin user missing)
- ❌ **Red** = Configuration error (must fix before login works)

## Step 2: Fix Based on Status

### If you see "NEXTAUTH_URL contains placeholders"

```bash
# In CapRover Dashboard:
# 1. Go to your app → App Configs → Environment Variables
# 2. Find NEXTAUTH_URL
# 3. Change from: https://$$cap_appname$$.$$cap_root_domain$$
# 4. Change to:   https://damdayvillage.com  (your actual domain)
# 5. Click "Save & Update"
```

### If you see "NEXTAUTH_SECRET invalid"

```bash
# Generate a secure secret:
openssl rand -base64 32

# In CapRover Dashboard:
# 1. Go to your app → App Configs → Environment Variables
# 2. Find NEXTAUTH_SECRET
# 3. Paste the generated secret
# 4. Click "Save & Update"
```

### If you see "Database connection refused"

```bash
# In CapRover Dashboard:
# 1. Go to your app → App Configs → Environment Variables
# 2. Find DATABASE_URL
# 3. Change from: $$cap_database_url$$
# 4. Change to:   postgresql://user:password@host:5432/database
#    (use your actual database credentials)
# 5. Click "Save & Update"
```

### If you see "Admin user not found"

**Option 1: Use the Auto-Init API (Easiest)**
```bash
curl -X POST https://your-domain.com/api/admin/init
```

**Option 2: SSH into your server and run:**
```bash
npm run db:seed
```

**Option 3: Manual SQL (if you have database access)**
```sql
-- Connect to your database, then run seed script
```

## Step 3: Verify Fix

1. **Refresh the status page:** `/admin-panel/status`
2. All checks should be **green** ✅
3. Click "Go to Admin Login"
4. Login with:
   - Email: `admin@damdayvillage.org`
   - Password: `Admin@123`

## Step 4: Change Default Password

⚠️ **IMPORTANT:** Immediately after first login:

1. Go to admin panel settings
2. Change the default password
3. Use a strong, unique password

## Common Issues

### "Still getting 500 after following steps"

1. **Check if app restarted:**
   - In CapRover, changes require app restart
   - Wait 30-60 seconds after "Save & Update"

2. **Clear browser cache:**
   - Hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
   - Or try in incognito/private window

3. **Check CapRover logs:**
   - In CapRover Dashboard → Apps → Your App → App Logs
   - Look for error messages

### "Can't access status page either"

If `/admin-panel/status` also shows 500:

1. **The app isn't starting at all**
2. **Check CapRover logs for startup errors**
3. **Most likely: Environment variables contain placeholders**

```bash
# In CapRover, check these MUST NOT contain $$cap_*$$:
- NEXTAUTH_URL
- DATABASE_URL  
- NEXTAUTH_SECRET
```

### "Database exists but connection fails"

1. **Check if database service is running:**
   - In CapRover Dashboard → Apps → (your database app)
   - Should show as "Running"

2. **Verify DATABASE_URL format:**
   ```
   postgresql://username:password@hostname:5432/database_name
   ```

3. **Test connection from your app:**
   ```bash
   # SSH into your CapRover app container
   # Then test: psql $DATABASE_URL -c "SELECT 1"
   ```

## Quick Commands Reference

```bash
# Check system status (API)
curl https://your-domain.com/api/auth/status

# Check general health
curl https://your-domain.com/api/health

# Create admin user
curl -X POST https://your-domain.com/api/admin/init

# Validate environment (if you have CLI access)
npm run validate:env

# Verify admin exists (if you have CLI access)
npm run admin:verify

# Create admin via seed (if you have CLI access)
npm run db:seed
```

## Still Stuck?

1. **Read the comprehensive guide:**
   - [ADMIN_500_ERROR_FIX.md](./ADMIN_500_ERROR_FIX.md)

2. **Check related docs:**
   - [ADMIN_PANEL_SETUP.md](./ADMIN_PANEL_SETUP.md)
   - [CAPROVER_ENV_CHECK.md](./CAPROVER_ENV_CHECK.md)
   - [docs/PRODUCTION_LOGIN_TROUBLESHOOTING.md](./docs/PRODUCTION_LOGIN_TROUBLESHOOTING.md)

3. **Check CapRover logs** for specific error messages

4. **Verify all environment variables** are set correctly (no `$$cap_*$$` placeholders)

## Success Checklist

- [ ] Status page shows all green ✅
- [ ] Can access `/admin-panel/login` without errors
- [ ] Can login with admin credentials
- [ ] Changed default password
- [ ] Admin panel dashboard loads properly

---

**Remember:** The `/admin-panel/status` page is your friend! It tells you exactly what's wrong and how to fix it.
