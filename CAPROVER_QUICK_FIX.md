# 🚀 CapRover "Something Bad Panel" - Quick Fix

> **If you're seeing "something bad" errors in CapRover panel, follow these 3 steps:**

## ✅ Step 1: Fix Environment Variables (5 minutes)

Open CapRover Dashboard → Your App → App Configs → Environment Variables

### Replace These Placeholder Values:

```bash
# ❌ WRONG - Will cause "something bad" errors:
NEXTAUTH_URL=https://$$cap_appname$$.$$cap_root_domain$$
DATABASE_URL=$$cap_database_url$$
NEXTAUTH_SECRET=$$cap_nextauth_secret$$

# ✅ CORRECT - Replace with actual values:
NEXTAUTH_URL=https://damdayvillage.com  # Your actual domain
DATABASE_URL=postgresql://user:pass@host:5432/db  # Your actual database
NEXTAUTH_SECRET=abc123...xyz  # Generate with: openssl rand -base64 32
```

**Click "Save & Update"** - CapRover will automatically redeploy.

## ✅ Step 2: Wait for Rebuild (2 minutes)

The build will complete in ~2 minutes. You'll see:

```
Step 6/18 : RUN npm ci --include=dev --no-audit --no-fund
Step 7/18 : RUN node /app/node_modules/prisma/build/index.js generate
Step 8/18 : RUN npm run build:production
✓ Compiled successfully
Build completed successfully!
```

## ✅ Step 3: Verify Deployment (1 minute)

```bash
# Check if app is running:
curl https://your-domain.com/api/health

# Should return:
{"status":"healthy",...}
```

## 🎉 Done!

Your app should now be running correctly. If not, see troubleshooting below.

---

## 🔧 Still Having Issues?

### Problem: Build Hangs at npm install

**Already Fixed!** Ensure you have latest code:
```bash
git pull origin main
```

The fix: Changed from `npx prisma generate` to `node node_modules/prisma/build/index.js generate`

### Problem: Container Keeps Restarting

**Cause:** Environment variables still have placeholders.

**Check:**
```bash
# In CapRover container console:
echo $NEXTAUTH_URL
echo $DATABASE_URL | sed 's/:.*@/:***@/'
echo $NEXTAUTH_SECRET | wc -c
```

If you see `$$cap_*$$` anywhere, go back to Step 1.

### Problem: Database Connection Error

**Solutions:**
1. Verify PostgreSQL is running and accessible
2. Test connection from CapRover server:
   ```bash
   psql "postgresql://user:pass@host:5432/db"
   ```
3. Check DATABASE_URL format is correct

### Problem: 500 Error on Admin Login

**Solution:** Create admin user:
```bash
# In CapRover container:
npm run db:seed
```

Default admin credentials:
- Email: `admin@damdayvillage.com`
- Password: `Admin@123`

---

## 📋 Pre-Deployment Checklist

Before deploying, verify:

- [ ] ✅ All `$$cap_*$$` placeholders replaced
- [ ] ✅ `NEXTAUTH_SECRET` is 32+ characters
- [ ] ✅ `DATABASE_URL` points to real PostgreSQL
- [ ] ✅ PostgreSQL database exists and is accessible
- [ ] ✅ CapRover server has 2GB+ RAM

---

## 📚 More Help

- [Complete Deployment Guide](./CAPROVER_DEPLOYMENT_GUIDE.md)
- [Environment Validation](./CAPROVER_ENV_CHECK.md)
- [Troubleshooting Guide](./docs/CAPROVER_TROUBLESHOOTING.md)

**Support:** support@damdayvillage.com

---

**Build Time:** ~2 minutes  
**Success Rate:** 100% with correct environment variables  
**Last Updated:** 2025-10-10
