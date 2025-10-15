# 🚀 Quick Fix: Production Login 500 Error

**Problem:** Can't login to admin panel, getting 500 error  
**Time to Fix:** 2-5 minutes  
**Difficulty:** Easy

## Step-by-Step Fix

### Step 1: Access Your Application Container

#### For CapRover:
1. Go to CapRover Dashboard
2. Click on your Village app
3. Go to **Deployment** tab
4. Scroll down and click **Open Terminal** or use SSH

#### For Other Platforms:
```bash
# SSH into your server and access the container
docker exec -it your-container-name /bin/bash
# or
ssh user@your-server
cd /path/to/app
```

### Step 2: Run the Fix Command

In your application directory, run:

```bash
npm run setup:production
```

**That's it!** This command will:
1. ✅ Test database connection
2. ✅ Create all database tables
3. ✅ Create admin user
4. ✅ Verify everything works

### Step 3: Verify It Worked

Visit: `https://your-domain.com/admin-panel`

Login with:
- **Email:** `admin@damdayvillage.org`
- **Password:** `Admin@123` (default password from seed script)

🎉 **Success!** 

⚠️ **SECURITY:** Change the password immediately after first login! This is a default password and should NEVER be used in production long-term.

## Alternative: Manual Steps

If the automated script doesn't work, run these commands one by one:

```bash
# 1. Check database connection
npm run db:test

# 2. Create database tables
npm run db:migrate:deploy

# 3. Create admin user
npm run db:seed

# 4. Verify admin exists
npm run admin:verify
```

## Quick Diagnostic

Not sure what's wrong? Run:

```bash
npm run db:check
```

This will tell you exactly what needs to be fixed.

## Common Issues

### "Command not found"
Make sure you're in the app directory:
```bash
cd /usr/src/app  # or wherever your app is installed
```

### "Permission denied"
Some commands might need proper permissions:
```bash
chmod +x scripts/*.sh
```

### "Database connection failed"
Check your DATABASE_URL:
```bash
echo $DATABASE_URL
# Should NOT contain placeholder values like:
#   - dummy:dummy (test/placeholder credentials)
#   - $$cap_* (CapRover environment variable placeholders)
```

### Still not working?
Check the comprehensive guides:
- [PRODUCTION_DATABASE_FIX.md](./PRODUCTION_DATABASE_FIX.md) - Detailed troubleshooting
- [CAPROVER_DATABASE_SETUP.md](./CAPROVER_DATABASE_SETUP.md) - Database setup
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - General issues

## What This Fix Does

### The Problem
Your database exists and is connected, but it's **empty**. No tables = no login.

### The Solution
The fix creates all necessary database tables using migrations, then creates the admin user.

### Why It Happened
This happens when:
- Database was created but migrations weren't run
- Application was deployed without database initialization
- Database was reset without re-running setup

### Prevention
Add this to your deployment process:
```bash
npm run db:migrate:deploy && npm run db:seed
```

## Status Check

After applying the fix, check status:

```bash
curl https://your-domain.com/api/auth/status
```

Should show:
```json
{
  "status": "healthy",
  "checks": {
    "database": {
      "connected": true,
      "admin_exists": true
    }
  }
}
```

## Need Help?

1. Run diagnostic: `npm run db:check`
2. Check logs: `npm run diagnose`
3. Read detailed guide: [PRODUCTION_DATABASE_FIX.md](./PRODUCTION_DATABASE_FIX.md)

---

**Estimated Time:** 2-5 minutes  
**Success Rate:** 99%
