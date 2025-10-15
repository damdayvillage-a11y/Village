# 🔧 Fix: Database Tables Not Created (500 Error on Login)

## Problem

When trying to login to the admin panel at `damdayvillage.com/admin-panel`, you get:
- **500 Internal Server Error**
- Status endpoint shows: "Database connected, but admin check failed"
- Error message: "The table `public.users` does not exist in the current database"

## Root Cause

The database exists and is connected, but the **database schema (tables) have not been created**. This happens when:
1. Database is created but migrations were not deployed
2. Application was deployed without running database initialization
3. Database was reset/recreated without re-running migrations

## ✅ Quick Fix

### Option 1: Automated Setup (RECOMMENDED)

Run this single command in your application container:

```bash
npm run setup:production
```

This will:
1. Test database connection
2. Deploy all migrations (create tables)
3. Generate Prisma client
4. Seed database with admin user
5. Verify admin setup

### Option 2: Manual Steps

If the automated script fails, run these commands manually:

```bash
# Step 1: Test database connection
npm run db:test

# Step 2: Deploy migrations to create tables
npm run db:migrate:deploy
# OR
npx prisma migrate deploy

# Step 3: Generate Prisma client
npm run db:generate

# Step 4: Seed database with admin user
npm run db:seed

# Step 5: Verify admin exists
npm run admin:verify
```

### Option 3: Use API Endpoint

If you can't access the container, use the browser:

1. First ensure migrations are deployed (you'll need container access for this)
2. Then visit: `https://damdayvillage.com/api/admin/init`
3. This will create the admin user if it doesn't exist

## 🔍 Verification

After running the fix, verify it worked:

### 1. Check Status Endpoint
```bash
curl https://damdayvillage.com/api/auth/status
```

Should show:
```json
{
  "status": "healthy",
  "healthy": true,
  "checks": {
    "database": {
      "configured": true,
      "connected": true,
      "admin_exists": true,
      "message": "Admin user found (role: ADMIN, active: true, verified: true)"
    }
  }
}
```

### 2. Check Admin Verification
```bash
curl https://damdayvillage.com/api/admin/verify-setup
```

Should show:
```json
{
  "adminExists": true,
  "adminUser": {
    "email": "admin@damdayvillage.org",
    "role": "ADMIN",
    "verified": true,
    "active": true
  }
}
```

### 3. Try Login

Visit: `https://damdayvillage.com/admin-panel`

Login with:
- **Email:** `admin@damdayvillage.org`
- **Password:** `Admin@123` (default from seed script)

**🔒 SECURITY CRITICAL:** This is a default password known publicly. You MUST change it immediately after first login! Leaving the default password is a major security vulnerability.

## 📋 For CapRover Users

### Access Container

1. Go to CapRover Dashboard
2. Navigate to your Village app
3. Go to **Deployment** → **View Logs**
4. Click **Open Terminal** or use the SSH option

### Run Fix

```bash
# In the container terminal
cd /usr/src/app

# Run the automated setup
npm run setup:production
```

### Alternative: One-Click Apps Script

You can also add this as a **post-deployment script** in CapRover:

1. Go to App → **Deployment**
2. Add to **Pre-deploy Script** or create a **post-deploy hook**:

```bash
#!/bin/bash
# Post-deployment script
npm run db:generate
npm run db:migrate:deploy || echo "Migrations already applied"
npm run db:seed || echo "Database already seeded"
```

## 🚨 Common Issues

### Issue 1: "Migration failed to apply"

**Solution:** Check if tables already exist
```bash
# Connect to database
psql $DATABASE_URL

# List tables
\dt

# If tables exist, mark migrations as applied
npx prisma migrate resolve --applied 20251015095500_init
```

### Issue 2: "Permission denied for schema public"

**Solution:** Grant proper permissions
```bash
# Connect as postgres user
psql $DATABASE_URL

# Grant permissions
GRANT ALL PRIVILEGES ON SCHEMA public TO your_db_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_db_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_db_user;
```

### Issue 3: "Admin user already exists"

This is good! If you see this, the admin user is created. Just verify:
```bash
npm run admin:verify
```

### Issue 4: "Cannot find module '@prisma/client'"

**Solution:** Generate Prisma client first
```bash
npm run db:generate
```

## 📚 Understanding the Fix

### What are Migrations?

Migrations are SQL scripts that create/modify your database schema. They're stored in `prisma/migrations/` and must be applied to create tables.

### Migration Files

- `prisma/migrations/20251015095500_init/migration.sql` - Creates all tables
- `prisma/migrations/migration_lock.toml` - Tracks migration state

### What Gets Created?

The migration creates these tables:
- `users` - User accounts (including admin)
- `accounts` - OAuth accounts
- `auth_sessions` - NextAuth sessions
- `sessions` - Custom sessions
- `villages`, `homestays`, `bookings` - Core business logic
- `projects`, `votes` - DAO functionality
- `devices`, `sensor_readings` - IoT data
- And more...

## 🔄 For Future Deployments

To prevent this issue in future deployments:

### 1. Add to Dockerfile

Add these lines before `CMD`:
```dockerfile
# Deploy migrations on container start
RUN npx prisma generate
RUN npx prisma migrate deploy || true
```

### 2. Add to Startup Script

Create `scripts/startup.sh`:
```bash
#!/bin/bash
npx prisma migrate deploy
npm start
```

### 3. Use Environment Variable

Set in CapRover:
```bash
AUTO_MIGRATE=true
```

And in your app startup:
```bash
if [ "$AUTO_MIGRATE" = "true" ]; then
  npx prisma migrate deploy
fi
```

## 💡 Prevention Checklist

Before deploying to production:

- [ ] Migrations exist in `prisma/migrations/`
- [ ] DATABASE_URL is set correctly
- [ ] Database is accessible from application
- [ ] Run `npm run db:migrate:deploy` after deployment
- [ ] Run `npm run db:seed` to create admin user
- [ ] Verify with `npm run admin:verify`
- [ ] Test login at `/admin-panel`

## 🆘 Still Having Issues?

1. Check full logs: `npm run diagnose`
2. Test database connection: `npm run db:test`
3. Check auth status: Visit `/api/auth/status`
4. Review troubleshooting guide: `TROUBLESHOOTING.md`
5. Check CapRover-specific guide: `CAPROVER_DATABASE_SETUP.md`

## 📞 Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run setup:production` | Complete automated setup |
| `npm run db:migrate:deploy` | Deploy migrations |
| `npm run db:seed` | Create admin user |
| `npm run admin:verify` | Verify admin exists |
| `npm run db:test` | Test database connection |
| `curl /api/auth/status` | Check system status |

---

**Last Updated:** 2025-10-15  
**Issue:** Database schema not created in production  
**Solution:** Deploy Prisma migrations before seeding
