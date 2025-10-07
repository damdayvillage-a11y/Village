# CapRover Deployment Checklist

This checklist ensures proper setup for deploying the Smart Carbon-Free Village application to CapRover.

## Prerequisites Verification

### ✅ 1. Repository Setup
- [x] `captain-definition` file exists
- [x] `Dockerfile` configured for CapRover (port 80)
- [x] GitHub Actions workflow updated
- [x] Health check endpoint available at `/api/health`
- [x] Environment templates created

### ✅ 2. CapRover Configuration

#### Create Apps in CapRover Panel:
- [ ] `village-app-staging` (for PR previews)
- [ ] `village-app-production` (for main branch deployments)

#### Configure Environment Variables:
For each app, set these environment variables in CapRover:

**Required:**
```bash
NODE_ENV=production
NEXTAUTH_URL=https://$$cap_appname$$.$$cap_root_domain$$
NEXTAUTH_SECRET=[secure-random-string-32-chars]
DATABASE_URL=postgresql://[user]:[pass]@[host]:[port]/[db]
NEXT_TELEMETRY_DISABLED=1
```

**Optional Services:**
```bash
# Payment Providers
STRIPE_SECRET_KEY=[sk_live_...]
STRIPE_PUBLISHABLE_KEY=[pk_live_...]
RAZORPAY_KEY_ID=[rzp_live_...]
RAZORPAY_KEY_SECRET=[...]

# OAuth Providers  
GOOGLE_CLIENT_ID=[...]
GOOGLE_CLIENT_SECRET=[...]
GITHUB_CLIENT_ID=[...]
GITHUB_CLIENT_SECRET=[...]

# IoT/MQTT
MQTT_BROKER_URL=[mqtt://...]
MQTT_USERNAME=[...]
MQTT_PASSWORD=[...]
```

### ✅ 3. GitHub Secrets Configuration

Add these secrets in GitHub repository settings:

```bash
CAPROVER_SERVER=[your-caprover-domain.com]
CAPROVER_APP_TOKEN=[caprover-app-token]
CAPROVER_STAGING_APP=village-app-staging  
CAPROVER_PRODUCTION_APP=village-app-production
```

## Deployment Process

### 1. Push to Feature Branch
- Creates PR
- Triggers validation (lint, test, build)
- Deploys to staging environment
- Runs health checks

### 2. Merge to Main
- Triggers production deployment
- Requires environment approval (if configured)
- Runs comprehensive health checks
- Updates deployment memory

## Verification Steps

After deployment, verify:

1. **Application Health:**
   ```bash
   curl https://village-app-production.your-domain.com/api/health
   ```

2. **Main Pages Load:**
   - Homepage: `/`
   - Digital Twin: `/digital-twin`
   - Village Tour: `/village-tour`
   - Marketplace: `/marketplace`

3. **Authentication:**
   - Sign-in page loads: `/auth/signin`
   - OAuth providers work (if configured)

4. **API Endpoints:**
   - Health check: `/api/health`
   - Villages data: `/api/village`

## Troubleshooting

### Build Failures
- Check CapRover app logs
- Verify environment variables are set
- Ensure DATABASE_URL is valid PostgreSQL connection

### Deployment Failures  
- Verify GitHub secrets are correctly configured
- Check CapRover server has sufficient resources
- Ensure domain and SSL are properly configured

### Runtime Issues
- Check application logs in CapRover panel
- Verify database connectivity
- Test API endpoints manually
- Check resource usage and limits

## Rollback Plan

If deployment fails:
1. Use CapRover's built-in rollback feature
2. Or trigger redeployment of previous working commit
3. Check logs and fix issues before next deployment

## Security Considerations

- [ ] All secrets use strong, random values
- [ ] HTTPS/SSL enabled for all environments
- [ ] Environment variables properly secured in CapRover
- [ ] Regular security audits with `npm audit`
- [ ] Database access restricted to application

## Post-Deployment

- [ ] Monitor application logs
- [ ] Set up uptime monitoring
- [ ] Configure backup procedures
- [ ] Document any environment-specific configurations
- [ ] Update team on new deployment URLs