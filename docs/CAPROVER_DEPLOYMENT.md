# CapRover Deployment Guide

This document provides instructions for deploying the Smart Carbon-Free Village application to CapRover.

## ⚠️ CRITICAL: Environment Variable Configuration

**Most Common Deployment Issue:** The application will show "500 Internal Server Error" if environment variables contain unreplaced CapRover placeholders!

### Before Deployment Checklist:
- [ ] Replace `$$cap_appname$$.$$cap_root_domain$$` with your actual domain (e.g., `https://damdayvillage.com`)
- [ ] Replace `$$cap_database_url$$` with actual PostgreSQL connection string
- [ ] Generate and set a secure `NEXTAUTH_SECRET` (at least 32 characters)
- [ ] After deployment, run `npm run validate:env` to verify all placeholders are replaced

**The application WILL NOT START in production if these placeholders are not replaced!**

## Prerequisites

1. CapRover server set up and accessible
2. GitHub repository with CI/CD workflow configured
3. Required environment variables configured in CapRover panel (see critical warning above)

## Repository Configuration

### 1. Branch Setup
- The repository uses `main` as the default branch
- CapRover deployment is configured to use `main` for production
- PR branches deploy to staging environment

### 2. Required Files
- `captain-definition`: CapRover deployment configuration
- `Dockerfile`: Container build instructions
- `.env.caprover`: Environment variable template

## CapRover Panel Configuration

### 1. Create Apps
Create the following apps in your CapRover panel:
- `village-app-staging` (for PR previews)  
- `village-app-production` (for main branch)

### 2. Environment Variables
Configure these environment variables in the CapRover app settings:

#### Required Variables

⚠️ **CRITICAL:** Do NOT use the placeholder values shown below. Replace them with actual values!

```
NODE_ENV=production

# ❌ BAD: NEXTAUTH_URL=https://$$cap_appname$$.$$cap_root_domain$$
# ✅ GOOD: Replace with your actual domain
NEXTAUTH_URL=https://damdayvillage.com

# ❌ BAD: NEXTAUTH_SECRET=<secure-random-string>
# ✅ GOOD: Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-generated-secret-here-at-least-32-characters

# ❌ BAD: DATABASE_URL=<postgresql-connection-string>
# ✅ GOOD: Use actual PostgreSQL credentials
DATABASE_URL=postgresql://username:password@hostname:5432/database_name
```

**To generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

#### Payment Providers
```
STRIPE_SECRET_KEY=<stripe-secret>
STRIPE_PUBLISHABLE_KEY=<stripe-publishable>
RAZORPAY_KEY_ID=<razorpay-key>
RAZORPAY_KEY_SECRET=<razorpay-secret>
```

#### OAuth Providers
```
GOOGLE_CLIENT_ID=<google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<google-oauth-secret>
GITHUB_CLIENT_ID=<github-oauth-client-id>  
GITHUB_CLIENT_SECRET=<github-oauth-secret>
```

#### IoT/MQTT (Optional)
```
MQTT_BROKER_URL=<mqtt-broker-url>
MQTT_USERNAME=<mqtt-username>
MQTT_PASSWORD=<mqtt-password>
```

### 3. App Configuration
- Enable HTTPS/SSL
- Configure custom domain (if needed)
- Set resource limits appropriate for your server

## GitHub Secrets

Configure these secrets in your GitHub repository settings:

```
CAPROVER_SERVER=<your-caprover-domain>
CAPROVER_APP_TOKEN=<caprover-app-token>  
CAPROVER_STAGING_APP=village-app-staging
CAPROVER_PRODUCTION_APP=village-app-production
```

## CI/CD Workflow

The deployment workflow includes:

1. **Validate**: Lint, type-check, build, test
2. **Deploy Preview**: Deploy PR branches to staging
3. **Health Check**: Verify deployment health
4. **Deploy Production**: Deploy main branch to production (requires human approval)
5. **Smoke Tests**: Post-deployment verification

## Branch Configuration Fix

The original error was caused by CapRover looking for `master` branch when the repository uses `main`. This is fixed by:

1. Explicitly configuring branch in GitHub Actions deployment
2. Using branch-specific deployment targets
3. Ensuring CapRover apps are configured for the correct branch

## Post-Deployment Validation

After deployment, **ALWAYS** run these validation steps:

### 1. Validate Environment Configuration
```bash
# SSH into your CapRover app or run via CapRover CLI
npm run validate:env
```

**Expected output:**
```
✅ All validations passed - Ready for production!
```

**If you see errors about placeholders:**
```
❌ NEXTAUTH_URL: Contains unreplaced placeholders: https://$$cap_appname$$.$$cap_root_domain$$
```
→ Go back to CapRover panel and replace the placeholder with your actual domain!

### 2. Check Health Endpoint
```bash
curl https://your-domain.com/api/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "services": {
    "database": { "status": "healthy" },
    "api": { "status": "healthy" }
  }
}
```

### 3. Test Admin Login
1. Navigate to `https://your-domain.com/admin-panel`
2. Login with credentials from `npm run db:seed`
3. Should see dashboard (not 500 error)

## Troubleshooting

### 500 Internal Server Error on Login (Most Common)

**Cause:** Environment variables contain unreplaced placeholders

**Solution:**
1. Run validation: `npm run validate:env`
2. Fix any errors (usually placeholder values in NEXTAUTH_URL or DATABASE_URL)
3. Update environment variables in CapRover panel
4. Redeploy the application

### Build Failures
- **Build hanging after npm warnings**: Fixed with optimized Docker configuration
- Check environment variables are properly set (run `npm run validate:env`)
- Verify database connection string format
- Ensure all required secrets are configured
- Monitor CapRover build logs for timeout issues

### Deployment Issues  
- Check CapRover app logs
- Verify domain and SSL configuration
- Ensure sufficient server resources
- **Most importantly:** Check for unreplaced placeholders with `npm run validate:env`

### Health Check Failures
- Check application logs in CapRover
- Verify database connectivity
- Test API endpoints manually
- Ensure DATABASE_URL doesn't contain placeholders

## Monitoring

After successful deployment:
- Health endpoint: `https://your-app.domain/api/health`
- Application logs available in CapRover panel
- Monitor resource usage and performance

## Rollback

If deployment issues occur:
1. Use CapRover's rollback feature in the app panel
2. Or redeploy previous working commit through GitHub Actions
3. Check logs and fix issues before next deployment

## Security Notes

- Use strong, unique secrets for all environment variables
- Enable HTTPS/SSL for all environments
- Regularly rotate API keys and secrets
- Monitor logs for security issues