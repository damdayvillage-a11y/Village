# Production Deployment Checklist for CapRover

This checklist ensures a smooth deployment to production at damdayvillage.com.

## Pre-Deployment Checklist

### 1. Environment Variables Configuration

#### Required Variables (Must be set in CapRover):
- [ ] `NODE_ENV=production`
- [ ] `NEXTAUTH_URL=https://damdayvillage.com` (or your custom domain)
- [ ] `NEXTAUTH_SECRET` (Generate with: `openssl rand -base64 32`)
- [ ] `DATABASE_URL=postgresql://user:password@host:port/database`

#### Build Optimization (Must be set):
- [ ] `NEXT_TELEMETRY_DISABLED=1`
- [ ] `GENERATE_SOURCEMAP=false`
- [ ] `CI=true`
- [ ] `CAPROVER_BUILD=true`

#### Optional Services (Set if using):
- [ ] Payment providers (Stripe, Razorpay)
- [ ] OAuth providers (Google, GitHub)
- [ ] Email service configuration
- [ ] MQTT/IoT configuration
- [ ] Sentry DSN for error monitoring

### 2. Database Setup

- [ ] PostgreSQL database created and accessible
- [ ] Database user created with appropriate permissions
- [ ] Database URL is NOT using dummy values
- [ ] Database is NOT pointing to localhost
- [ ] Database connection tested from CapRover server
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Seed initial data: `npm run db:seed`
- [ ] Verify admin user exists: `npm run admin:verify`

### 3. SSL/HTTPS Configuration

- [ ] Custom domain configured in CapRover
- [ ] SSL certificate enabled in CapRover app settings
- [ ] Force HTTPS enabled in CapRover
- [ ] DNS records pointing to CapRover server
- [ ] SSL certificate valid and not expired

### 4. CapRover App Configuration

- [ ] App created in CapRover dashboard
- [ ] App name set (e.g., `village-app-production`)
- [ ] Port set to 80 (default for Next.js standalone)
- [ ] Resource limits configured:
  - Memory: 2GB minimum
  - CPU: 2 cores recommended
- [ ] Health check enabled: `/api/health`
- [ ] Persistent data configured if needed

### 5. captain-definition Configuration

Ensure your `captain-definition` file is correct:

```json
{
  "schemaVersion": 2,
  "dockerfilePath": "./Dockerfile.simple"
}
```

### 6. Code Validation

- [ ] Run linter: `npm run lint`
- [ ] Run type checking: `npm run type-check`
- [ ] Run tests: `npm test`
- [ ] Build locally: `npm run build`
- [ ] Validate environment: `npm run validate:env`

### 7. Security Checklist

- [ ] NEXTAUTH_SECRET is strong (32+ characters)
- [ ] Database credentials are secure and unique
- [ ] No sensitive data in environment variables
- [ ] API keys are production keys (not test/sandbox)
- [ ] HTTPS enforced for all routes
- [ ] Security headers configured
- [ ] CORS configured properly
- [ ] Rate limiting enabled (if applicable)

## Deployment Steps

### 1. Push to Repository
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### 2. Deploy to CapRover

**Option A: Via GitHub Actions**
- Push to `main` branch
- GitHub Actions will trigger automatic deployment

**Option B: Manual Deployment**
```bash
# Install CapRover CLI
npm install -g caprover

# Login to CapRover
caprover login

# Deploy
caprover deploy
```

### 3. Monitor Deployment

- [ ] Watch build logs in CapRover dashboard
- [ ] Build completes successfully (2-3 minutes)
- [ ] Container starts without errors
- [ ] Health check passes

## Post-Deployment Verification

### 1. Basic Functionality Tests

- [ ] Home page loads: `https://damdayvillage.com`
- [ ] HTTPS redirect works (HTTP → HTTPS)
- [ ] Health check endpoint: `https://damdayvillage.com/api/health`
- [ ] Static assets load correctly
- [ ] PWA service worker registers

### 2. Authentication Tests

- [ ] Sign in page loads: `/auth/signin`
- [ ] Admin login works with credentials
- [ ] Session persists after login
- [ ] Protected routes require authentication
- [ ] OAuth providers work (if configured)

### 3. Admin Panel Tests

- [ ] Admin panel accessible: `/admin-panel`
- [ ] Admin stats API works: `/api/admin/stats`
- [ ] Dashboard loads without 500 errors
- [ ] User management accessible
- [ ] Content editor accessible

### 4. Database Tests

- [ ] Database queries execute successfully
- [ ] Admin user exists and can login
- [ ] New user registration works
- [ ] Data persistence verified

### 5. Performance Tests

- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Images optimized and loading
- [ ] No memory leaks
- [ ] No excessive CPU usage

### 6. Security Tests

- [ ] HTTPS enforced on all routes
- [ ] Security headers present (check with securityheaders.com)
- [ ] No sensitive data exposed in responses
- [ ] CORS configured properly
- [ ] Rate limiting working (if configured)

## Troubleshooting

### Build Fails

1. Check CapRover build logs
2. Verify all environment variables are set
3. Ensure `captain-definition` uses `Dockerfile.simple`
4. Check Docker build locally: `docker build -f Dockerfile.simple .`

### "Something bad happened" Flash Message

This usually indicates:
1. Build timeout - increase timeout in CapRover settings
2. Out of memory - increase memory limit
3. Missing environment variables - verify all required vars

### Admin Panel 500 Error

1. Check database connection: `DATABASE_URL` is correct
2. Verify Prisma client generated: logs should show "Generated Prisma Client"
3. Check application logs in CapRover
4. Ensure admin user exists: run seed script

### Database Connection Error

1. Verify `DATABASE_URL` format is correct
2. Test connection from CapRover server
3. Check database server is accessible
4. Verify firewall rules allow connection
5. Ensure database credentials are correct

### SSL Certificate Issues

1. Check DNS records pointing to CapRover
2. Verify SSL certificate in CapRover settings
3. Wait for DNS propagation (up to 48 hours)
4. Check Let's Encrypt rate limits
5. Try manual certificate installation

## Rollback Plan

If deployment fails:

1. **Via CapRover Dashboard:**
   - Go to app settings
   - Click "Rollback" to previous version
   - Verify rollback successful

2. **Via Git:**
   ```bash
   git revert HEAD
   git push origin main
   ```

3. **Emergency:**
   - Stop the app in CapRover
   - Fix issues locally
   - Test thoroughly
   - Redeploy

## Monitoring and Maintenance

### Daily Checks
- [ ] Application is running
- [ ] Health check endpoint responds
- [ ] No errors in logs
- [ ] SSL certificate valid

### Weekly Checks
- [ ] Database backup verified
- [ ] Disk space available
- [ ] Memory usage normal
- [ ] No security alerts

### Monthly Checks
- [ ] Dependencies updated
- [ ] Security patches applied
- [ ] Performance metrics reviewed
- [ ] Logs archived

## Support Contacts

- **Application Issues:** Check GitHub Issues
- **CapRover Issues:** [CapRover Documentation](https://caprover.com/docs)
- **Database Issues:** Check PostgreSQL logs
- **SSL Issues:** Check Let's Encrypt status

## Success Criteria

Deployment is successful when:
- ✅ Application accessible via HTTPS
- ✅ Admin panel loads without errors
- ✅ Database queries execute successfully
- ✅ Authentication works
- ✅ No 500 errors in logs
- ✅ Performance meets requirements
- ✅ Security headers configured
- ✅ Health checks pass

---

**Last Updated:** 2025-01-10
**Deployment Status:** Ready for Production
