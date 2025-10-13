# ⚡ Quick Fix: Admin Panel 500 Error

**Problem:** Getting "500 Internal Server Error" when trying to login to admin panel after CapRover deployment.

## 🚀 Fastest Fix (1 Minute)

### Step 1: Check System Status
Visit one of these URLs in your browser:
```
https://your-domain.com/help/admin-500        # User-friendly fix guide
https://your-domain.com/admin-panel/status    # Technical system status
```

You'll see:
- ✅ Green checkmarks = Working
- ❌ Red X marks = Need fixing
- Specific error messages
- Recommended solutions

### Step 2: Auto-Create Admin User
If admin user is missing, visit this URL:
```
https://your-domain.com/api/admin/init
```

This will automatically:
- ✅ Create admin user with email: `admin@damdayvillage.org`
- ✅ Set password to: `Admin@123`
- ✅ Make user active and verified
- ✅ Return success message

### Step 3: Login
Go to:
```
https://your-domain.com/admin-panel/login
```

Login with:
- **Email:** `admin@damdayvillage.org`
- **Password:** `Admin@123`

### Step 4: Change Password
⚠️ **CRITICAL:** After successful login, immediately change your password in the admin panel!

---

## 🔧 If That Doesn't Work

### Diagnose the Problem

Run this command locally (or from any machine with curl):
```bash
curl -s https://your-domain.com/api/admin/check-env | json_pp
```

Or use our diagnostic script:
```bash
npm run admin:diagnose https://your-domain.com
```

This will tell you exactly what's wrong:
- ❌ Environment variables not configured
- ❌ Database not connected
- ❌ Placeholders ($$cap_*$$) not replaced
- ❌ Admin user missing

### Common Issues & One-Line Fixes

**Issue 1: CapRover Placeholders Not Replaced**
```
Error: NEXTAUTH_URL contains placeholders like $$cap_appname$$
Fix: In CapRover dashboard, set NEXTAUTH_URL=https://your-actual-domain.com
```

**Issue 2: NEXTAUTH_SECRET Invalid**
```
Error: NEXTAUTH_SECRET is too short or contains dummy value
Fix: Generate: openssl rand -base64 32
     Then set in CapRover: NEXTAUTH_SECRET=<paste result>
```

**Issue 3: Database Not Connected**
```
Error: Database connection failed
Fix: Set DATABASE_URL=postgresql://user:pass@host:5432/db
     (Replace user, pass, host, db with actual values)
```

**Issue 4: Admin User Doesn't Exist**
```
Error: Admin user not found
Fix: Visit https://your-domain.com/api/admin/init
     OR run: npm run db:seed
```

---

## 📋 Complete Checklist

Use this checklist if you want to be thorough:

### Environment Variables
- [ ] `NEXTAUTH_URL` = Your actual domain (no $$cap_*$$)
- [ ] `NEXTAUTH_SECRET` = 32+ character random string
- [ ] `DATABASE_URL` = Valid PostgreSQL connection string
- [ ] `NODE_ENV` = production

### Database
- [ ] PostgreSQL is running and accessible
- [ ] Database exists and migrations are run
- [ ] Can connect: `psql <DATABASE_URL>`

### Admin User
- [ ] Admin user exists: Visit `/api/admin/verify-setup`
- [ ] Admin user has correct role: ADMIN
- [ ] Admin user is verified and active

### Testing
- [ ] Health check works: `curl https://your-domain.com/api/health`
- [ ] Status page loads: `https://your-domain.com/admin-panel/status`
- [ ] Can login: `https://your-domain.com/admin-panel/login`

---

## 🎯 One-Command Solutions

**Auto-fix everything (if database is connected):**
```bash
curl -X POST https://your-domain.com/api/admin/init
```

**Verify configuration:**
```bash
curl https://your-domain.com/api/admin/check-env
```

**Check admin setup:**
```bash
curl https://your-domain.com/api/admin/verify-setup
```

**Test health:**
```bash
curl https://your-domain.com/api/health
```

---

## 🆘 Still Not Working?

### Get Detailed Diagnostics

**Option 1: Status Page**
- Visit: `https://your-domain.com/admin-panel/status`
- Take a screenshot
- All issues will be listed with specific error messages

**Option 2: Run Diagnostic Script**
```bash
npm run admin:diagnose https://your-domain.com
```
This will check everything and tell you exactly what to fix.

**Option 3: Check Logs**
In CapRover dashboard:
1. Go to your app
2. Click "Logs" tab
3. Look for errors like:
   - "Database connection failed"
   - "Invalid credentials"
   - "NEXTAUTH_URL contains placeholders"

### Need More Help?

See comprehensive guides:
- **ADMIN_500_FIX_GUIDE.md** - Complete troubleshooting
- **ADMIN_PANEL_SETUP.md** - Full setup instructions
- **CAPROVER_DEPLOYMENT_GUIDE.md** - Deployment guide

---

## 🔐 Security Note

The default credentials (`admin@damdayvillage.org` / `Admin@123`) are intentionally simple for first-time setup. 

**You MUST:**
1. ✅ Change the password immediately after first login
2. ✅ Change the email address to your own
3. ✅ Enable 2FA if available
4. ✅ Review user permissions

**Optional:** Set custom default password via environment variable:
```bash
ADMIN_DEFAULT_PASSWORD=YourSecurePassword123
```

---

## ⚡ TL;DR (Too Long; Didn't Read)

1. Visit: `https://your-domain.com/api/admin/init`
2. Login: `admin@damdayvillage.org` / `Admin@123`
3. Change password immediately
4. Done! 🎉

If that doesn't work, check: `https://your-domain.com/admin-panel/status`

---

**Last Updated:** October 2025  
**Compatibility:** CapRover deployments, all versions
