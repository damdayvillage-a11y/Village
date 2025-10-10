# CapRover Environment Variables Check

## 🚨 URGENT: Application Will Not Start Without These

After the latest fix, the application **validates environment variables on startup** and will **refuse to start** if placeholders are detected.

## Check Your CapRover Environment Variables NOW

### Step 1: Open CapRover Dashboard

1. Navigate to your CapRover dashboard
2. Select your app (e.g., `village-app`)
3. Go to "App Configs" tab
4. Scroll to "Environment Variables" section

### Step 2: Verify These Variables

#### ❌ WRONG (Application will NOT start)

```bash
NEXTAUTH_URL=https://$$cap_appname$$.$$cap_root_domain$$
DATABASE_URL=$$cap_database_url$$
NEXTAUTH_SECRET=$$cap_nextauth_secret$$
```

#### ✅ CORRECT (Application will start)

```bash
# Replace with YOUR actual domain
NEXTAUTH_URL=https://damdayvillage.com

# Replace with YOUR actual database connection
DATABASE_URL=postgresql://username:password@db-host:5432/database_name

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-secure-generated-secret-here-at-least-32-chars
```

### Step 3: After Updating Environment Variables

1. Click "Save & Update" in CapRover
2. Wait for automatic redeploy
3. Check application logs for validation messages

## What You'll See in Logs

### ✅ SUCCESS (Valid Configuration)

```
🚀 Starting Smart Carbon-Free Village application...
🔍 Running startup configuration check...
Environment: production
✅ NEXTAUTH_URL: https://damdayvillage.com
✅ NEXTAUTH_SECRET: Set (45 chars)
✅ DATABASE_URL: postgresql:****@db-host:5432/village_db
✅ All configuration checks passed!
✅ Startup validation passed!
🌐 Server will listen on 0.0.0.0:80
🎬 Starting Next.js server...
```

### ❌ FAILURE (Placeholders Detected)

```
🚀 Starting Smart Carbon-Free Village application...
🔍 Running startup configuration check...
Environment: production
❌ NEXTAUTH_URL: Contains placeholders: https://$$cap_appname$$.$$cap_root_domain$$
   Detected unreplaced placeholder pattern (e.g., $$cap_*$$).
   Please replace with actual domain: https://damdayvillage.com
❌ DATABASE_URL: Contains placeholders: $$cap_database_url$$
   Detected unreplaced placeholder pattern (e.g., $$cap_*$$).
🛑 Cannot start in production mode with these errors.
❌ Startup validation failed!
```

**If you see the failure message:** The application will NOT start and users cannot access it. Fix the environment variables immediately!

## Quick Fix Steps

### For NEXTAUTH_URL

1. In CapRover, find `NEXTAUTH_URL` in Environment Variables
2. Replace `$$cap_appname$$.$$cap_root_domain$$` with your actual domain
3. Example: `https://damdayvillage.com` or `https://village.yourdomain.com`

### For DATABASE_URL

1. Find `DATABASE_URL` in Environment Variables
2. Get your actual PostgreSQL connection string
3. Format: `postgresql://username:password@hostname:5432/database`
4. Replace `$$cap_database_url$$` with the actual connection string

### For NEXTAUTH_SECRET

1. Generate a secure secret on your local machine:
   ```bash
   openssl rand -base64 32
   ```
2. Copy the output (should be ~44 characters)
3. Replace `$$cap_nextauth_secret$$` or any placeholder with the generated secret

### For Other Variables

Check these optional variables if you're using them:

```bash
# Payment providers (if used)
STRIPE_SECRET_KEY=sk_live_...
RAZORPAY_KEY_ID=rzp_live_...

# OAuth (if used)
GOOGLE_CLIENT_ID=...
GITHUB_CLIENT_ID=...

# Email (if used)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_FROM=noreply@damdayvillage.com
```

## Test After Fix

After updating environment variables and redeploying:

1. **Check logs** in CapRover for validation success
2. **Visit your site**: `https://your-domain.com`
3. **Test admin login**: `https://your-domain.com/admin-panel`
   - Email: `admin@damdayvillage.org`
   - Password: `Admin@123`
4. **Should see dashboard** - NOT 500 error!

## Still Having Issues?

### Check Application Logs

In CapRover:
1. Go to your app
2. Click "View Logs" button
3. Look for validation messages
4. Check for any error messages after "Starting Next.js server..."

### Verify Database Connection

If validation passes but you still see 500 errors:

1. Check if PostgreSQL database is accessible
2. Verify database credentials are correct
3. Test database connection manually:
   ```bash
   psql -h hostname -U username -d database
   ```

### Common Issues

**Issue:** App container keeps restarting
- **Cause:** Validation is failing
- **Fix:** Check logs and fix environment variables

**Issue:** Build succeeds but app won't start
- **Cause:** Environment variables contain placeholders
- **Fix:** Replace all `$$cap_*$$` values with actual values

**Issue:** 500 error after validation passes
- **Cause:** Database connection failed or admin user doesn't exist
- **Fix:** 
  1. Verify DATABASE_URL is correct
  2. Run: `npm run db:seed` to create admin user

## Need More Help?

- [Quick Validation Guide](./QUICK_VALIDATION_GUIDE.md)
- [Deployment Validation Guide](./docs/DEPLOYMENT_VALIDATION.md)
- [Admin Panel Setup](./ADMIN_PANEL_SETUP.md)
- [CapRover Deployment Guide](./docs/CAPROVER_DEPLOYMENT.md)

## Summary

**The application now refuses to start if environment variables contain placeholders.**

This is **intentional** and prevents the 500 errors you were experiencing. Fix the environment variables in CapRover, and the application will start successfully!
