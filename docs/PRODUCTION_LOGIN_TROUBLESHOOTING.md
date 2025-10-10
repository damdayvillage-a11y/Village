# Production Login Troubleshooting Guide

## 500 Internal Server Error on Admin Panel Login

This guide helps diagnose and fix 500 errors when logging into the admin panel at production (e.g., damdayvillage.com).

### Quick Diagnosis Checklist

Run through these checks in order:

#### 1. Environment Variables Check

**Problem**: CapRover placeholders not replaced or missing variables.

```bash
# On your server, check environment variables
npm run validate:env
```

**Common Issues**:
- ❌ `NEXTAUTH_URL=$$cap_appname$$.$$cap_root_domain$$`
  - ✅ Fix: `NEXTAUTH_URL=https://damdayvillage.com`

- ❌ `DATABASE_URL=$$cap_database_url$$`
  - ✅ Fix: `DATABASE_URL=postgresql://user:password@host:5432/database`

- ❌ `NEXTAUTH_SECRET=dummy-secret-for-build`
  - ✅ Fix: Generate with `openssl rand -base64 32`

#### 2. Database Connection Check

**Problem**: Cannot connect to PostgreSQL database.

```bash
# Quick diagnostic (recommended)
npm run diagnose https://damdayvillage.com

# Or check manually
curl https://damdayvillage.com/api/health
curl https://damdayvillage.com/api/auth/status
```

Expected response:
```json
{
  "status": "healthy",
  "services": {
    "database": {
      "status": "healthy",
      "responseTime": "25ms"
    }
  }
}
```

**If database is unhealthy**:
1. Verify PostgreSQL is running: `systemctl status postgresql`
2. Check DATABASE_URL format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`
3. Test connection: `psql $DATABASE_URL -c "SELECT 1"`
4. Check firewall rules allow connection from app server

#### 3. Admin User Exists

**Problem**: Admin user not seeded in database.

```bash
# Verify admin user exists
npm run admin:verify
```

**If admin doesn't exist**:
```bash
# Seed database with default admin
npm run db:seed
```

Default credentials:
- Email: `admin@damdayvillage.org`
- Password: `Admin@123`

⚠️ **Change password immediately after first login!**

#### 4. Check Application Logs

**Problem**: Application errors not visible in browser.

```bash
# View recent logs (adjust command for your hosting platform)
# CapRover:
docker logs $(docker ps | grep srv-captain--village | awk '{print $1}') --tail 100

# Docker:
docker logs <container_name> --tail 100

# System logs:
journalctl -u your-app-service -n 100
```

**Look for**:
- `Database connection failed`
- `Authentication error`
- `NextAuth handler error`
- `ECONNREFUSED`, `ETIMEDOUT`, `ENOTFOUND`

### Common Error Patterns

#### Error: "Database connection failed"

**Causes**:
1. DATABASE_URL contains placeholders
2. PostgreSQL not running
3. Wrong credentials
4. Network/firewall blocking connection
5. Connection pool exhausted

**Solutions**:
1. Verify DATABASE_URL is correct (no `$$cap_` placeholders)
2. Restart PostgreSQL: `systemctl restart postgresql`
3. Check credentials can connect: `psql $DATABASE_URL`
4. Check connection limit: `SHOW max_connections;` in PostgreSQL
5. Add connection pooling parameters to DATABASE_URL:
   ```
   postgresql://user:pass@host:5432/db?connection_limit=20&pool_timeout=10
   ```

#### Error: "Authentication Service Unavailable"

**Causes**:
1. NEXTAUTH_SECRET not set or using dummy value
2. NEXTAUTH_URL contains placeholders or wrong domain
3. JWT token signing failing

**Solutions**:
1. Generate proper secret: `openssl rand -base64 32`
2. Set correct domain in NEXTAUTH_URL
3. Ensure NEXTAUTH_SECRET is at least 32 characters
4. Restart application after changing environment variables

#### Error: "Invalid credentials" (when credentials are correct)

**Causes**:
1. Password not hashed correctly in database
2. User account is deactivated or not verified
3. Database query failing silently

**Solutions**:
1. Verify admin user in database:
   ```sql
   SELECT id, email, role, verified, active FROM users WHERE email = 'admin@damdayvillage.org';
   ```
2. Ensure user is `verified=true` and `active=true`
3. Re-seed database if needed: `npm run db:seed`

#### Error: "Access Denied - Admin privileges required"

**Causes**:
1. User exists but role is not ADMIN
2. Session not storing role correctly

**Solutions**:
1. Update user role:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'admin@damdayvillage.org';
   ```
2. Clear session and try logging in again
3. Check browser console for JWT/session errors

### Advanced Debugging

#### Enable Debug Logging

Add to your environment variables:
```bash
NODE_ENV=production
DEBUG=true
```

This will show more detailed logs in the application.

#### Test Auth Flow Directly

```bash
# Test credentials endpoint directly
curl -X POST https://damdayvillage.com/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@damdayvillage.org",
    "password": "Admin@123",
    "csrfToken": "get-from-signin-page"
  }'
```

#### Database Connection Test

Create a test script:
```javascript
// test-db.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    const user = await prisma.user.findUnique({
      where: { email: 'admin@damdayvillage.org' }
    });
    
    console.log('✅ Admin user:', user ? 'Found' : 'Not found');
    if (user) {
      console.log('   Role:', user.role);
      console.log('   Active:', user.active);
      console.log('   Verified:', user.verified);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
```

Run: `node test-db.js`

### Deployment Checklist

Before deploying to production:

- [ ] All environment variables set (no placeholders)
- [ ] NEXTAUTH_SECRET generated (32+ characters)
- [ ] NEXTAUTH_URL matches your domain
- [ ] DATABASE_URL tested and working
- [ ] Database migrations applied: `npx prisma migrate deploy`
- [ ] Database seeded: `npm run db:seed`
- [ ] Admin user verified: `npm run admin:verify`
- [ ] Health check passing: `curl https://your-domain.com/api/health`
- [ ] Application logs reviewed for errors
- [ ] Test login with admin credentials
- [ ] SSL/HTTPS certificate valid

### Getting Help

If issues persist after following this guide:

1. **Check logs first**: Most issues show clear error messages in logs
2. **Verify environment**: Run `npm run validate:env`
3. **Test database**: Run `npm run admin:verify`
4. **Review documentation**:
   - [AUTH_ERROR_HANDLING.md](./AUTH_ERROR_HANDLING.md)
   - [ADMIN_PANEL_SETUP.md](../ADMIN_PANEL_SETUP.md)
   - [PRODUCTION_READINESS.md](../PRODUCTION_READINESS.md)

5. **Contact support**: support@damdayvillage.com
   - Include: Error message, logs (last 50 lines), environment check output

### Prevention

To avoid these issues in future deployments:

1. **Use CI/CD validation**: Run `npm run validate:env` before deployment
2. **Automated health checks**: Monitor `/api/health` endpoint
3. **Database backups**: Regular backups before deployments
4. **Staging environment**: Test all changes in staging first
5. **Configuration management**: Use tools like dotenv-vault or AWS Secrets Manager
6. **Monitoring**: Set up error tracking (Sentry) and uptime monitoring

---

**Last Updated**: January 2025  
**Version**: 2.0  
**Status**: Production-Ready
