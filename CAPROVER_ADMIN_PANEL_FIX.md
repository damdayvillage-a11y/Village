# CapRover Admin Panel 500 Error - Complete Fix

## 🚨 Problem
After deploying to CapRover, you can access the homepage but get **500 Internal Server Error** when trying to login to the admin panel at `/admin-panel/login`.

**🆘 QUICK HELP:** Visit `https://your-domain.com/help/admin-500` in your browser for instant diagnostics and fix guide!

## ✅ Root Cause
The admin panel 500 error happens because:
1. **Environment variables in CapRover have placeholders** (like `$$cap_appname$$`) that were not replaced
2. **Database connection is not properly configured**
3. **Admin user doesn't exist** in the database
4. **NEXTAUTH configuration is invalid**

## 🔧 Step-by-Step Fix for CapRover

### Step 1: Access Your CapRover Dashboard

1. Go to your CapRover panel: `https://captain.your-domain.com`
2. Login with your CapRover credentials
3. Find your Village app in the app list
4. Click on your app to open its settings

### Step 2: Configure Environment Variables Correctly

Click on **"App Configs"** tab and set these variables:

#### ✅ REQUIRED Variables (Replace ALL placeholders!)

```bash
# 1. NODE_ENV
NODE_ENV=production

# 2. NEXTAUTH_URL - Your actual domain (NO PLACEHOLDERS!)
# ❌ WRONG: https://$$cap_appname$$.$$cap_root_domain$$
# ✅ CORRECT: Replace with your actual domain
NEXTAUTH_URL=https://your-actual-domain.com
# Example: https://damdayvillage.com
# Or: https://village.yourdomain.com

# 3. NEXTAUTH_SECRET - Generate a secure secret
# ❌ WRONG: $$cap_nextauth_secret$$
# ✅ CORRECT: Generate with command below
NEXTAUTH_SECRET=<paste-your-generated-secret-here>

# To generate, run this on your computer:
# openssl rand -base64 32
# Then paste the output here

# 4. DATABASE_URL - Your PostgreSQL connection string
# ❌ WRONG: $$cap_database_url$$
# ✅ CORRECT: Replace with your actual database
DATABASE_URL=postgresql://username:password@host:5432/database_name

# Example if using CapRover's PostgreSQL:
# DATABASE_URL=postgresql://villageuser:securepass@srv-captain--postgres:5432/villagedb
```

#### ✅ BUILD Variables (Keep these as-is)

```bash
NEXT_TELEMETRY_DISABLED=1
GENERATE_SOURCEMAP=false
CI=true
CAPROVER_BUILD=true
```

#### 🔐 OPTIONAL Variables (Only if you're using these services)

Leave these BLANK or remove them if you're not using:
```bash
# Payment providers (optional)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# OAuth providers (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Email (optional)
EMAIL_SERVER_HOST=
EMAIL_SERVER_PORT=
EMAIL_FROM=

# Monitoring (optional)
SENTRY_DSN=
```

### Step 3: Set Up PostgreSQL Database

#### Option A: Use CapRover's One-Click PostgreSQL

1. In CapRover dashboard, go to **"Apps"** → **"One-Click Apps/Databases"**
2. Search for **"PostgreSQL"**
3. Click **"Deploy"** and fill in:
   - App Name: `postgres` (or any name you want)
   - PostgreSQL Password: `<choose-a-strong-password>`
   - Database Name: `villagedb`
4. Click **"Deploy"**
5. Wait for deployment to complete

After deployment, your DATABASE_URL will be:
```bash
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@srv-captain--postgres:5432/villagedb
```

#### Option B: Use External PostgreSQL

If you have an external PostgreSQL database:
```bash
DATABASE_URL=postgresql://username:password@your-db-host.com:5432/database_name
```

### Step 4: Save and Restart Your App

1. Click **"Save & Update"** at the bottom of the App Configs page
2. CapRover will automatically restart your app
3. Wait for the restart to complete (check the **"Deployment"** tab)

### Step 5: Run Database Migrations

You need to create the database tables. Connect to your app container:

**Method 1: Via CapRover Dashboard (Recommended)**

1. In CapRover dashboard, go to your app
2. Click **"Deployment"** tab
3. Scroll down to **"Execute Shell Command in Running Container"**
4. Run this command:
   ```bash
   npx prisma migrate deploy
   ```
5. Wait for completion (you'll see output)

**Method 2: Via SSH (If you have SSH access)**

```bash
# SSH into CapRover server
ssh root@your-server-ip

# Access the container
docker exec -it $(docker ps | grep captain-yourappname | awk '{print $1}') sh

# Run migrations
cd /app
npx prisma migrate deploy
```

### Step 6: Create Admin User

After migrations, create the admin user:

**Method 1: Via Web Browser (Easiest)**

Simply visit this URL in your browser:
```
https://your-actual-domain.com/api/admin/init
```

You'll see a success message with credentials:
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

**Method 2: Via Command Line in Container**

In CapRover dashboard → your app → Deployment tab → Execute Shell Command:
```bash
npm run db:seed
```

### Step 7: Test Admin Panel Access

1. Go to: `https://your-actual-domain.com/admin-panel/login`
2. Login with:
   - **Email**: `admin@damdayvillage.org`
   - **Password**: `Admin@123`
3. ✅ You should now be logged in!
4. **IMPORTANT**: Immediately change your password in the admin panel

### Step 8: Verify Everything Works

Check the system status page:
```
https://your-actual-domain.com/admin-panel/status
```

All checks should show ✅ (green checkmarks).

## 🔍 Troubleshooting

### Issue 1: Still Getting 500 Error

**Diagnosis:**
Visit one of these pages in your browser to see what's wrong:
```
https://your-actual-domain.com/help/admin-500        # User-friendly fix guide
https://your-actual-domain.com/admin-panel/status    # Technical system status
```

**Common Issues:**

1. **Database Connection Failed**
   - Check DATABASE_URL is correct
   - Verify PostgreSQL is running: In CapRover, go to Apps and check your postgres app is running
   - Test connection: Use the shell command in container: `psql $DATABASE_URL`

2. **NEXTAUTH_URL Contains Placeholders**
   - Go to App Configs in CapRover
   - Replace `$$cap_appname$$.$$cap_root_domain$$` with your actual domain
   - Save & Update

3. **Admin User Not Found**
   - Visit: `https://your-domain.com/api/admin/init`
   - Or run in container: `npm run db:seed`

### Issue 2: Can't Access Container Shell

If the Execute Shell Command doesn't work in CapRover:

1. SSH into your CapRover server
2. Find your container:
   ```bash
   docker ps | grep captain
   ```
3. Access it:
   ```bash
   docker exec -it CONTAINER_ID sh
   ```
4. Run commands:
   ```bash
   cd /app
   npx prisma migrate deploy
   npm run db:seed
   ```

### Issue 3: Database Migration Fails

If migrations fail, check:

1. **DATABASE_URL is correct** - Test with:
   ```bash
   psql "$DATABASE_URL"
   ```

2. **Database exists** - Create it if needed:
   ```bash
   psql "postgresql://username:password@host:5432/postgres"
   CREATE DATABASE villagedb;
   ```

3. **Permissions** - Ensure user has CREATE TABLE permissions

### Issue 4: Environment Variables Not Taking Effect

After changing environment variables:

1. Click **"Save & Update"** (not just Save)
2. Wait for app to fully restart
3. Check the **"App Logs"** tab to see if restart was successful
4. If still not working, try **"Force Rebuild"** in Deployment tab

## 📋 Complete CapRover Configuration Checklist

Use this checklist to ensure everything is set up correctly:

### Environment Variables
- [ ] `NODE_ENV` = `production`
- [ ] `NEXTAUTH_URL` = Your actual domain (no `$$cap_*$$`)
- [ ] `NEXTAUTH_SECRET` = 32+ character secret (generated with openssl)
- [ ] `DATABASE_URL` = Valid PostgreSQL connection (no `$$cap_*$$`)
- [ ] All optional variables are either properly set or removed

### Database Setup
- [ ] PostgreSQL is deployed and running in CapRover
- [ ] Can connect to database (test with `psql`)
- [ ] Migrations have been run (`npx prisma migrate deploy`)
- [ ] Admin user has been created

### Application
- [ ] App is running (check in CapRover Apps list)
- [ ] No errors in App Logs
- [ ] Health endpoint works: `/api/health`
- [ ] Status page accessible: `/admin-panel/status`
- [ ] All status checks are green

### Admin Access
- [ ] Can access admin login page: `/admin-panel/login`
- [ ] Can login with `admin@damdayvillage.org` / `Admin@123`
- [ ] Password changed after first login

## 🎯 Quick Commands Reference

**Generate NEXTAUTH_SECRET (on your computer):**
```bash
openssl rand -base64 32
```

**Test database connection (in container):**
```bash
psql "$DATABASE_URL"
```

**Run migrations (in container):**
```bash
npx prisma migrate deploy
```

**Create admin user (in container):**
```bash
npm run db:seed
```

**Or via browser:**
```
https://your-domain.com/api/admin/init
```

**Check logs in CapRover:**
- Dashboard → Your App → App Logs tab

**Execute command in container:**
- Dashboard → Your App → Deployment tab → Execute Shell Command

## 🔐 Security Best Practices

After setup:

1. **Change admin password immediately** after first login
2. **Update admin email** to your own email
3. **Keep NEXTAUTH_SECRET secure** - never commit to git
4. **Use strong database password**
5. **Enable HTTPS** in CapRover (it's usually automatic)
6. **Regular backups** - Set up PostgreSQL backups in CapRover

## 📞 Still Having Issues?

If you're still experiencing problems:

1. **Check App Logs** in CapRover dashboard
   - Look for error messages
   - Common errors: "ECONNREFUSED", "Invalid credentials", "Cannot find module"

2. **Run diagnostics** (if you have Node.js on your computer):
   ```bash
   npm run admin:diagnose https://your-domain.com
   ```

3. **Verify environment variables** are correct:
   - No placeholder values (`$$cap_*$$`)
   - DATABASE_URL is reachable
   - NEXTAUTH_URL matches your domain

4. **Check documentation**:
   - `QUICK_FIX_ADMIN_500.md` - Quick fixes
   - `ADMIN_500_FIX_GUIDE.md` - Detailed troubleshooting
   - `ADMIN_FIX_FLOWCHART.md` - Visual troubleshooting guide

## 🎉 Success!

Once everything is working:
- ✅ Admin panel accessible
- ✅ No 500 errors
- ✅ Can login and manage the system
- ✅ All status checks are green

Remember to **change your admin password** and keep your credentials secure!

---

**Quick Summary:**
1. Replace ALL `$$cap_*$$` placeholders in CapRover App Configs
2. Set up PostgreSQL database
3. Run migrations: `npx prisma migrate deploy`
4. Create admin: Visit `/api/admin/init`
5. Login: `admin@damdayvillage.org` / `Admin@123`
6. Change password immediately!
