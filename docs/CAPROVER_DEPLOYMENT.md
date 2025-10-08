# CapRover Deployment Guide

This document provides instructions for deploying the Smart Carbon-Free Village application to CapRover.

## Prerequisites

1. CapRover server set up and accessible
2. GitHub repository with CI/CD workflow configured
3. Required environment variables configured in CapRover panel

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
```
NODE_ENV=production
NEXTAUTH_URL=https://$$cap_appname$$.$$cap_root_domain$$
NEXTAUTH_SECRET=<secure-random-string>
DATABASE_URL=<postgresql-connection-string>
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

## Troubleshooting

### Build Failures
- **Build hanging after npm warnings**: Fixed with optimized Docker configuration
- Check environment variables are properly set
- Verify database connection string format
- Ensure all required secrets are configured
- Monitor CapRover build logs for timeout issues

### Deployment Issues  
- Check CapRover app logs
- Verify domain and SSL configuration
- Ensure sufficient server resources

### Health Check Failures
- Check application logs in CapRover
- Verify database connectivity
- Test API endpoints manually

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