# Quick Validation Guide - Prevent 500 Errors

## 🚨 CRITICAL: Before Any Deployment

**The #1 cause of 500 errors is unreplaced placeholders in environment variables!**

## Quick Check (30 seconds)

Run this command after setting environment variables:

```bash
npm run validate:env
```

### ✅ Success Output
```
✅ All validations passed - Ready for production!
```
→ Safe to deploy!

### ❌ Error Output
```
❌ NEXTAUTH_URL: Contains unreplaced placeholders: https://$$cap_appname$$.$$cap_root_domain$$
```
→ **DO NOT DEPLOY!** Fix the errors first.

## Common Errors & Quick Fixes

### Error 1: NEXTAUTH_URL has placeholders

**Symptom:**
```
❌ NEXTAUTH_URL: Contains placeholders
```

**Fix:**
Replace `$$cap_appname$$.$$cap_root_domain$$` with your actual domain:
```bash
NEXTAUTH_URL=https://damdayvillage.com
```

### Error 2: DATABASE_URL has placeholders

**Symptom:**
```
❌ DATABASE_URL: Contains placeholders
```

**Fix:**
Replace `$$cap_database_url$$` with actual PostgreSQL URL:
```bash
DATABASE_URL=postgresql://username:password@hostname:5432/database
```

### Error 3: NEXTAUTH_SECRET too short

**Symptom:**
```
❌ NEXTAUTH_SECRET: Too short (X chars, minimum 32)
```

**Fix:**
Generate a secure secret:
```bash
openssl rand -base64 32
```
Copy the output and use as NEXTAUTH_SECRET.

## Post-Deployment Validation

After deployment, verify everything works:

### 1. Health Check
```bash
curl https://YOUR-DOMAIN/api/health
```

Expected: `{"status":"healthy"}`

### 2. Test Admin Login
1. Go to: `https://YOUR-DOMAIN/admin-panel`
2. Login with:
   - Email: `admin@damdayvillage.org`
   - Password: `Admin@123`
3. Should see dashboard (not 500 error)

## Platform-Specific Quick Fixes

### CapRover
1. Open CapRover dashboard
2. Go to your app → App Configs
3. Find Environment Variables section
4. Replace ALL `$$cap_*$$` values with actual values
5. Click "Save & Update"
6. Wait for redeploy
7. Run `npm run validate:env` to verify

### Vercel
1. Open Vercel dashboard
2. Go to Settings → Environment Variables
3. Edit each placeholder variable
4. Save changes
5. Redeploy
6. Run validation

### Docker
1. Edit your `.env` file or environment config
2. Replace all placeholder values
3. Rebuild and restart containers
4. Run `npm run validate:env` inside container

## Detection Patterns

The validation detects these placeholder patterns:
- ✅ `$$cap_*$$` (CapRover)
- ✅ `${VARIABLE}` (template literals)
- ✅ `your-domain`, `your-secret` (common patterns)
- ✅ `example.com`, `example.org` (examples)
- ✅ `change-me`, `placeholder` (obvious placeholders)

## Still Getting 500 Errors?

If validation passes but you still get 500 errors:

1. **Check database connection:**
   ```bash
   curl https://YOUR-DOMAIN/api/health
   ```

2. **Verify admin user exists:**
   ```bash
   npm run admin:verify
   ```

3. **Create admin if needed:**
   ```bash
   npm run db:seed
   ```

4. **Check application logs** for detailed error messages

## Documentation Links

- [Full Deployment Validation Guide](./docs/DEPLOYMENT_VALIDATION.md)
- [CapRover Deployment Guide](./docs/CAPROVER_DEPLOYMENT.md)
- [Admin Panel Setup & Troubleshooting](./ADMIN_PANEL_SETUP.md)
- [Complete Fix Summary](./PLACEHOLDER_VALIDATION_FIX.md)

## Remember

**Always run `npm run validate:env` after setting environment variables!**

This simple check prevents 99% of deployment issues.
