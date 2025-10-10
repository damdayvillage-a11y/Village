# Admin Panel 500 Error - Visual Troubleshooting Guide

## 🔍 Quick Diagnosis Flow

```
START: Getting 500 error on admin panel login?
│
├─ Step 1: Check System Status
│  └─ Visit: https://your-domain.com/admin-panel/status
│     │
│     ├─ All Green (✅) → Go to Step 4 (Try Login)
│     │
│     └─ Red/Yellow (❌/⚠️) → Continue to Step 2
│
├─ Step 2: Identify the Issue
│  │
│  ├─ Database Connection Failed (❌)
│  │  └─ Fix: Check DATABASE_URL
│  │     - Format: postgresql://user:pass@host:5432/db
│  │     - No placeholders ($$cap_*$$)
│  │     - PostgreSQL is running
│  │     └─ Restart app → Go back to Step 1
│  │
│  ├─ Environment Config Issues (❌)
│  │  └─ Fix: Replace placeholders
│  │     - NEXTAUTH_URL=https://actual-domain.com
│  │     - NEXTAUTH_SECRET=$(openssl rand -base64 32)
│  │     - Save in CapRover dashboard
│  │     └─ Restart app → Go back to Step 1
│  │
│  ├─ Admin User Not Found (⚠️)
│  │  └─ Fix: Auto-create admin
│  │     └─ Visit: https://your-domain.com/api/admin/init
│  │        ├─ Success → Go to Step 4
│  │        └─ Error → Check database connection
│  │
│  └─ Auth Service Error (❌)
│     └─ Fix: Check NextAuth config
│        - Verify NEXTAUTH_URL
│        - Verify NEXTAUTH_SECRET
│        └─ Restart app → Go back to Step 1
│
├─ Step 3: Verify Fix
│  └─ Recheck status page
│     ├─ Still issues → Review error messages, consult docs
│     └─ All green → Continue to Step 4
│
├─ Step 4: Try Login
│  └─ Visit: https://your-domain.com/admin-panel/login
│     │
│     ├─ Credentials:
│     │  - Email: admin@damdayvillage.org
│     │  - Password: Admin@123
│     │
│     ├─ Login Success → Go to Step 5
│     │
│     └─ Login Failed
│        └─ Run diagnostic: npm run admin:diagnose
│           └─ Follow recommendations
│
├─ Step 5: Secure Your Account
│  └─ Immediately after first login:
│     ├─ 1. Change password
│     ├─ 2. Update email address
│     ├─ 3. Review admin settings
│     └─ 4. ✅ DONE!
│
└─ END: Admin panel working!
```

## 🛠️ Detailed Troubleshooting Matrix

| Symptom | Likely Cause | Quick Fix | Detailed Fix |
|---------|--------------|-----------|--------------|
| 500 error on login | Multiple possible | Visit `/admin-panel/status` | See below |
| "Database connection failed" | DATABASE_URL invalid | Check format and credentials | [Guide](#database-fixes) |
| "Admin user not found" | Database empty | Visit `/api/admin/init` | [Guide](#admin-user-fixes) |
| "NEXTAUTH_URL contains placeholders" | CapRover vars not replaced | Replace in dashboard | [Guide](#environment-fixes) |
| "NEXTAUTH_SECRET too short" | Weak secret | Generate new: `openssl rand -base64 32` | [Guide](#environment-fixes) |
| Can't access status page | App not running | Check CapRover logs | [Guide](#startup-fixes) |

## 🎯 Fix Guides by Category

### Database Fixes

**Problem:** Database connection failed

**Quick Test:**
```bash
curl https://your-domain.com/api/health
```

**If unhealthy:**
1. Check DATABASE_URL format:
   ```
   postgresql://username:password@host:5432/database
   ```

2. Verify PostgreSQL is running:
   ```bash
   # In CapRover, check app is deployed
   # Or test connection:
   psql "postgresql://user:pass@host:5432/db"
   ```

3. Check for placeholders:
   ```
   ❌ postgresql://$$cap_db_user$$:...
   ✅ postgresql://villageuser:securepass123@...
   ```

4. Update in CapRover:
   - Go to App → App Configs
   - Update DATABASE_URL
   - Save & Restart

### Admin User Fixes

**Problem:** Admin user doesn't exist

**Quick Fix:**
```bash
# Visit in browser or curl:
curl -X POST https://your-domain.com/api/admin/init
```

**Alternative fixes:**
```bash
# Option 1: Database seed (if you have SSH access)
npm run db:seed

# Option 2: Manual verification then fix
npm run admin:verify
```

**Custom default password:**
```bash
# In CapRover App Configs, add:
ADMIN_DEFAULT_PASSWORD=YourSecurePassword123

# Then visit /api/admin/init
```

### Environment Fixes

**Problem:** Environment variables have placeholders or invalid values

**Check current config:**
```bash
curl https://your-domain.com/api/admin/check-env
```

**Common fixes:**

1. **NEXTAUTH_URL**
   ```bash
   ❌ https://$$cap_appname$$.$$cap_root_domain$$
   ✅ https://damdayvillage.com
   ```

2. **NEXTAUTH_SECRET**
   ```bash
   # Generate secure secret:
   openssl rand -base64 32
   
   # Use result in CapRover
   ✅ NEXTAUTH_SECRET=abc123xyz789...
   ```

3. **DATABASE_URL**
   ```bash
   ❌ $$cap_database_url$$
   ✅ postgresql://user:pass@postgres:5432/villagedb
   ```

**Where to update:**
- CapRover Dashboard → Your App → App Configs
- Edit values → Save & Restart

### Startup Fixes

**Problem:** App won't start or crashes on startup

**Check logs:**
1. CapRover Dashboard → Your App → Logs
2. Look for errors:
   - "CRITICAL ERRORS FOUND"
   - "Cannot start in production mode"
   - Specific validation failures

**Common errors:**

1. **"NEXTAUTH_URL contains placeholders"**
   - Fix: Replace with actual domain
   - Where: CapRover App Configs

2. **"Database connection refused"**
   - Fix: Check DATABASE_URL and PostgreSQL
   - Test: Can you connect with psql?

3. **"NEXTAUTH_SECRET too short"**
   - Fix: Generate 32+ char secret
   - Command: `openssl rand -base64 32`

## 📊 Decision Tree

```
Are you getting a 500 error?
│
├─ YES
│  │
│  ├─ Can you access /admin-panel/status?
│  │  │
│  │  ├─ YES
│  │  │  └─ Follow recommendations on status page
│  │  │     └─ Fix issues → Try login
│  │  │
│  │  └─ NO (status page also errors)
│  │     └─ Check CapRover logs
│  │        └─ Look for startup errors
│  │           └─ Fix config → Restart app
│  │
│  └─ Can you access other pages (homepage)?
│     │
│     ├─ YES (only admin panel fails)
│     │  └─ Likely: Admin user missing
│     │     └─ Visit /api/admin/init
│     │
│     └─ NO (entire site fails)
│        └─ Likely: Database or config issue
│           └─ Check DATABASE_URL
│              └─ Check environment variables
│
└─ NO (no 500 error)
   └─ What's the actual error?
      │
      ├─ "Invalid credentials"
      │  └─ Using correct credentials?
      │     ├─ YES → Check admin:verify
      │     └─ NO → Use: admin@damdayvillage.org / Admin@123
      │
      ├─ "Authentication failed"
      │  └─ Check /api/health
      │     └─ If unhealthy → Fix database
      │
      └─ Other error
         └─ Check documentation:
            - QUICK_FIX_ADMIN_500.md
            - ADMIN_500_FIX_GUIDE.md
```

## 🚀 Speed Run (For Advanced Users)

```bash
# 1. Test health
curl https://your-domain.com/api/health

# 2. Check environment
curl https://your-domain.com/api/admin/check-env

# 3. Verify admin
curl https://your-domain.com/api/admin/verify-setup

# 4. If admin missing, create
curl -X POST https://your-domain.com/api/admin/init

# 5. Login
# https://your-domain.com/admin-panel/login
# admin@damdayvillage.org / Admin@123

# 6. Change password
# (via admin panel UI)
```

## 📱 Status Page Screenshot Reference

When you visit `/admin-panel/status`, you'll see:

```
┌─────────────────────────────────────────┐
│     Admin Panel System Status           │
│                                          │
│  System Status: Healthy                 │
│  ✅ All systems operational             │
│                                          │
│  ✅ System API                          │
│     API is responding                   │
│     Uptime: 1234s, Environment: prod    │
│                                          │
│  ✅ Database Connection                 │
│     Database is connected               │
│     PostgreSQL is healthy               │
│                                          │
│  ✅ Authentication Service              │
│     NextAuth is configured              │
│     Authentication endpoints accessible │
│                                          │
│  ✅ Admin User Setup                    │
│     Admin user is configured            │
│     Email: admin@damdayvillage.org     │
│                                          │
│  ✅ Environment Configuration           │
│     All required variables are set      │
│     3 variables validated               │
│                                          │
│  [Refresh] [Try Admin Login]            │
│                                          │
│  Default Admin Credentials:             │
│  Email: admin@damdayvillage.org        │
│  Password: Admin@123                    │
│  ⚠️ Change after first login!          │
└─────────────────────────────────────────┘
```

## 🎓 Learning Points

### Common Mistakes

1. **Not replacing CapRover placeholders**
   - `$$cap_*$$` MUST be replaced before app starts
   - Check every environment variable

2. **Using dummy values**
   - "dummy-secret-for-build" is not secure
   - "your-nextauth-secret-key" won't work
   - Generate real values

3. **Forgetting to create admin user**
   - Database migrates but doesn't seed
   - Use `/api/admin/init` to auto-create

4. **Not testing after deployment**
   - Always visit `/admin-panel/status` after deploy
   - Verify all checks are green

### Best Practices

1. **Always validate config before deploying**
   ```bash
   npm run validate:env
   ```

2. **Use strong secrets**
   ```bash
   openssl rand -base64 32
   ```

3. **Check status page first**
   - Self-diagnose before seeking help
   - Save time with specific error messages

4. **Change default password immediately**
   - Default is for first-time setup only
   - Use strong, unique password

## 📚 Related Documentation

- **Quick Start:** `QUICK_FIX_ADMIN_500.md`
- **Detailed Guide:** `ADMIN_500_FIX_GUIDE.md`
- **Full Setup:** `ADMIN_PANEL_SETUP.md`
- **Deployment:** `CAPROVER_DEPLOYMENT_GUIDE.md`
- **API Reference:** `PR_SUMMARY.md`

## 🆘 Still Stuck?

If you've followed this guide and still have issues:

1. **Gather diagnostics:**
   ```bash
   npm run admin:diagnose https://your-domain.com > diagnostic.txt
   ```

2. **Check CapRover logs:**
   - Dashboard → Your App → Logs
   - Copy relevant errors

3. **Review documentation:**
   - Start with `QUICK_FIX_ADMIN_500.md`
   - Then `ADMIN_500_FIX_GUIDE.md`

4. **Create support request with:**
   - Status page screenshot
   - Diagnostic output
   - Relevant log excerpts (mask sensitive data!)
   - Steps you've already tried

---

**Remember:** Most issues can be solved in under 5 minutes using the status page and auto-init endpoint! 🚀
