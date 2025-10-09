# Deployment Validation Guide

## ⚠️ Critical: Prevent 500 Errors on Admin Login

This guide helps you validate that your deployment is correctly configured **before** experiencing 500 errors.

## Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] **NEXTAUTH_URL** does NOT contain `$$cap_appname$$` or other placeholders
  - ❌ Bad: `https://$$cap_appname$$.$$cap_root_domain$$`
  - ✅ Good: `https://damdayvillage.com`

- [ ] **DATABASE_URL** does NOT contain `$$cap_database_url$$` or placeholders
  - ❌ Bad: `$$cap_database_url$$`
  - ✅ Good: `postgresql://user:pass@host:5432/db`

- [ ] **NEXTAUTH_SECRET** is at least 32 characters long
  - Generate with: `openssl rand -base64 32`

- [ ] **NODE_ENV** is set to `production`

## Post-Deployment Validation

After deployment, run these commands to validate:

### 1. Environment Validation (Critical!)

```bash
npm run validate:env
```

**Expected output:**
```
✅ All validations passed - Ready for production!
```

**If you see errors:**
```
❌ NEXTAUTH_URL: Contains unreplaced placeholders
```

**Action:** Update the environment variable in your deployment platform and redeploy.

### 2. Health Check

```bash
curl https://YOUR-DOMAIN/api/health
```

**Expected output:**
```json
{
  "status": "healthy",
  "services": {
    "database": { "status": "healthy" },
    "api": { "status": "healthy" }
  }
}
```

**If database is unhealthy:**
- Check DATABASE_URL is correct
- Ensure PostgreSQL is running
- Verify network connectivity

### 3. Admin Panel Access

1. Navigate to: `https://YOUR-DOMAIN/admin-panel`
2. Login with:
   - Email: `admin@damdayvillage.org`
   - Password: `Admin@123` (change after first login)
3. Should see dashboard, NOT a 500 error

## Common Validation Errors

### Error: "NEXTAUTH_URL contains unreplaced placeholders"

**What it means:** The URL still has `$$cap_*$$` or other placeholder patterns

**How to fix:**
1. Go to your deployment platform's environment variable settings
2. Find NEXTAUTH_URL
3. Replace with your actual domain: `https://damdayvillage.com`
4. Redeploy

### Error: "DATABASE_URL contains unreplaced placeholders"

**What it means:** The database URL still has placeholder values

**How to fix:**
1. Get your actual PostgreSQL connection string
2. Format: `postgresql://username:password@hostname:5432/database`
3. Update DATABASE_URL in deployment platform
4. Redeploy

### Error: "NEXTAUTH_SECRET is too short"

**What it means:** The secret is less than 32 characters

**How to fix:**
1. Generate a secure secret:
   ```bash
   openssl rand -base64 32
   ```
2. Copy the output
3. Set as NEXTAUTH_SECRET in deployment platform
4. Redeploy

## Platform-Specific Instructions

### CapRover

1. Navigate to your app in CapRover dashboard
2. Click "App Configs" tab
3. Scroll to "Environment Variables"
4. Update the variables with actual values (not placeholders)
5. Click "Save & Update"
6. Wait for automatic redeploy

### Vercel

1. Go to project settings
2. Navigate to "Environment Variables"
3. Edit each variable
4. Replace placeholder values
5. Redeploy from dashboard or push new commit

### Docker/Manual

1. Update your `.env` file or environment configuration
2. Ensure no `$$cap_*$$` patterns remain
3. Restart the application
4. Run validation commands

## Automated Validation in CI/CD

Add this to your deployment pipeline:

```yaml
# After deployment
- name: Validate Environment
  run: |
    npm run validate:env
    if [ $? -ne 0 ]; then
      echo "❌ Environment validation failed!"
      echo "Check for unreplaced placeholders in environment variables"
      exit 1
    fi

- name: Health Check
  run: |
    curl -f https://YOUR-DOMAIN/api/health || exit 1
```

## Support

If validation fails:

1. **Check application logs** for detailed error messages
2. **Review documentation:**
   - [ADMIN_PANEL_SETUP.md](../ADMIN_PANEL_SETUP.md)
   - [CAPROVER_DEPLOYMENT.md](./CAPROVER_DEPLOYMENT.md)
3. **Run diagnostics:**
   ```bash
   npm run validate:env
   npm run admin:verify
   node scripts/startup-check.js
   ```
4. **Contact support** with diagnostic output

## Summary

**The #1 cause of 500 errors is unreplaced placeholders in environment variables.**

Always run `npm run validate:env` after deployment to catch this issue before users see errors!
