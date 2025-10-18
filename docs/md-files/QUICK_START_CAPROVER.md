# Quick Start Guide - CapRover Deployment

## 🚀 Fast Track to Deploying on CapRover

This is a streamlined guide to get your application running on CapRover **quickly and correctly**.

---

## Prerequisites

- CapRover server installed and accessible
- PostgreSQL deployed in CapRover (or external database)
- Domain name configured

---

## Step 1: Deploy PostgreSQL (If not already done)

1. In CapRover Dashboard → **Apps** → **One-Click Apps/Databases**
2. Search for **PostgreSQL**
3. Click **Deploy**
4. Set:
   - App Name: `postgres`
   - PostgreSQL Password: `<your-secure-password>`
5. Wait for deployment to complete

---

## Step 2: Configure Environment Variables

1. Go to **Apps** → Click your app name
2. Click **App Configs** tab
3. Scroll to **Environment Variables**
4. **Copy and paste these variables**, then **replace the values**:

```bash
# =============================================================================
# REQUIRED - Replace ALL values!
# =============================================================================
NODE_ENV=production

# Replace with your actual domain
NEXTAUTH_URL=https://your-domain.com

# Generate this: run `openssl rand -base64 32` on your computer
NEXTAUTH_SECRET=<paste-generated-secret-here>

# Replace with your PostgreSQL credentials
# For CapRover PostgreSQL: use srv-captain--postgres as hostname
DATABASE_URL=postgresql://postgres:your-password@srv-captain--postgres:5432/villagedb

# =============================================================================
# REQUIRED - Build Settings (Keep as-is)
# =============================================================================
NEXT_TELEMETRY_DISABLED=1
GENERATE_SOURCEMAP=false
CI=true
CAPROVER_BUILD=true
```

5. Click **Save & Update**
6. Wait for automatic redeploy (2-3 minutes)

---

## Step 3: Wait for Automatic Initialization

**NEW:** Admin and host users are created automatically! 🎉

After deployment completes:
1. The application automatically checks database connectivity
2. **Admin user is auto-created** if it doesn't exist (email: admin@damdayvillage.org, password: Admin@123)
3. **Host user is auto-created** if it doesn't exist (email: host@damdayvillage.org, password: Host@123)

**No manual steps needed!** Just wait for the deployment to finish (2-3 minutes).

### Verify Setup (Optional)

You can verify the setup by visiting:

```
https://your-domain.com/api/admin/verify-setup
```

You should see:
```json
{
  "adminExists": true,
  "configured": true,
  "email": "admin@damdayvillage.org",
    "password": "Admin@123"
  }
}
```

**Done!** Admin user is created.

---

## Step 4: Verify Everything Works

Visit the system status page:
```
https://your-domain.com/admin-panel/status
```

**All items should be green (✅):**
- NEXTAUTH_URL: ✅ Configured
- NEXTAUTH_SECRET: ✅ Valid
- Database: ✅ Connected
- Admin User: ✅ Exists

If any item shows ❌ or ⚠️, follow the recommendations on the status page.

---

## Step 5: Login to Admin Panel

1. Go to: `https://your-domain.com/admin-panel/login`
2. Enter credentials:
   - **Email:** `admin@damdayvillage.org`
   - **Password:** `Admin@123`
3. Click **Sign in as Admin**
4. **IMPORTANT:** Change password immediately after first login!

---

## ✅ Success Checklist

- [ ] PostgreSQL is running in CapRover
- [ ] All environment variables set (no `$$cap_*$$` placeholders)
- [ ] NEXTAUTH_SECRET generated and set (32+ characters)
- [ ] DATABASE_URL configured correctly
- [ ] App deployed successfully (no build errors)
- [ ] Admin user created via `/api/admin/init`
- [ ] Status page shows all green checks
- [ ] Can login to admin panel
- [ ] Default password changed

**If all items checked, you're done! 🎉**

---

## 🆘 Troubleshooting

### Getting 500 Error?

**Visit these pages for instant diagnostics:**

1. **System Status:** `https://your-domain.com/admin-panel/status`
   - Shows exactly what's wrong
   - Provides fix recommendations

2. **Help Guide (English):** `https://your-domain.com/help/admin-500`
   - Quick fixes for common issues
   - Step-by-step instructions

3. **Help Guide (Hindi):** `https://your-domain.com/help/admin-500-hi`
   - हिंदी में पूर्ण मदद

### Run Diagnostics Locally

SSH into your CapRover server and run:

```bash
# Access container
docker exec -it $(docker ps | grep captain-village | awk '{print $1}') sh

# Run comprehensive diagnostic
npm run caprover:diagnose https://your-domain.com

# Check environment variables
npm run validate:env

# Verify admin user
npm run admin:verify

# Test database connection
npm run db:test
```

### Common Issues

#### Issue: "$$cap_*$$" placeholders not replaced
**Fix:** Go to CapRover App Configs and replace ALL `$$cap_*$$` values with actual values.

#### Issue: Database connection failed
**Fix:** 
- Check PostgreSQL is running in CapRover
- Verify DATABASE_URL is correct
- Use `srv-captain--postgres` for CapRover internal service

#### Issue: Admin user doesn't exist
**Fix:** Visit `https://your-domain.com/api/admin/init` to create it automatically.

#### Issue: NEXTAUTH_SECRET too short
**Fix:** Generate new secret: `openssl rand -base64 32` and update in App Configs.

---

## 📚 Complete Documentation

For detailed information, see:

- **[CAPROVER_500_FIX_GUIDE.md](./CAPROVER_500_FIX_GUIDE.md)** - Complete step-by-step fix guide (English)
- **[CAPROVER_500_FIX_GUIDE_HINDI.md](./CAPROVER_500_FIX_GUIDE_HINDI.md)** - संपूर्ण गाइड (हिंदी)
- **[CAPGUIDE.md](./CAPGUIDE.md)** - Full CapRover deployment guide
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - General troubleshooting

---

## 🔧 Useful Commands

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Run database migrations
npx prisma migrate deploy

# Create admin user (in container)
npm run db:seed

# Verify admin exists
npm run admin:verify

# Check environment variables
npm run validate:env

# Test database connection
npm run db:test

# Full diagnostic
npm run caprover:diagnose https://your-domain.com
```

---

## 🎯 Key Points to Remember

1. **Always replace `$$cap_*$$` placeholders** - They will cause 500 errors!
2. **NEXTAUTH_SECRET must be 32+ characters** - Generate with OpenSSL
3. **Use `srv-captain--postgres` for internal CapRover database** - It's not a placeholder!
4. **Create admin user via browser** - Visit `/api/admin/init` (easiest method)
5. **Change default password after first login** - Security first!

---

**Need help?** Visit the system status page at `/admin-panel/status` for instant diagnostics!

---

**Last Updated:** 2025-10-15
**Version:** 1.0.0
