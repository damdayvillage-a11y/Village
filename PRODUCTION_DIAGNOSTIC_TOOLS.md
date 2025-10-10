# Production Diagnostic Tools

Quick reference for diagnosing and fixing production issues with the admin panel login.

## Quick Diagnostic

Run this command to check all authentication components:

```bash
npm run diagnose https://damdayvillage.com
```

This will check:
- ✅ Application is responding
- ✅ Database connectivity
- ✅ Admin user exists
- ✅ Authentication configuration
- ✅ Error handling

## API Endpoints for Diagnostics

### 1. General Health Check

```bash
curl https://damdayvillage.com/api/health
```

**Response:**
```json
{
  "status": "healthy",
  "services": {
    "database": {
      "status": "healthy",
      "responseTime": "25ms"
    },
    "api": {
      "status": "healthy"
    }
  }
}
```

### 2. Authentication Service Status

```bash
curl https://damdayvillage.com/api/auth/status
```

**Response (Healthy):**
```json
{
  "status": "healthy",
  "healthy": true,
  "checks": {
    "nextauth_url": {
      "configured": true,
      "value": "OK"
    },
    "nextauth_secret": {
      "configured": true,
      "length": 44,
      "valid": true
    },
    "database": {
      "configured": true,
      "connected": true,
      "admin_exists": true,
      "message": "Admin user found (role: ADMIN, active: true, verified: true)"
    }
  },
  "recommendations": ["All checks passed!"]
}
```

**Response (Issues Detected):**
```json
{
  "status": "misconfigured",
  "healthy": false,
  "checks": {
    "nextauth_url": {
      "configured": true,
      "value": "INVALID - Contains placeholders"
    },
    "nextauth_secret": {
      "configured": false,
      "length": 0,
      "valid": false
    },
    "database": {
      "configured": false,
      "connected": false,
      "admin_exists": false,
      "message": "DATABASE_URL contains placeholders - not replaced"
    }
  },
  "recommendations": [
    "Replace $$cap_*$$ placeholders in NEXTAUTH_URL",
    "Set NEXTAUTH_SECRET - generate with: openssl rand -base64 32",
    "Configure DATABASE_URL with valid PostgreSQL connection string"
  ],
  "help": "See: docs/PRODUCTION_LOGIN_TROUBLESHOOTING.md"
}
```

## Common Commands

### Validate Environment Variables

```bash
npm run validate:env
```

Checks that all required environment variables are set and valid.

### Verify Admin User

```bash
npm run admin:verify
```

Checks if the admin user exists in the database and shows their status.

### Seed Database

```bash
npm run db:seed
```

Creates the default admin user if it doesn't exist:
- Email: `admin@damdayvillage.org`
- Password: `Admin@123`

### Run Full Diagnostic

```bash
# For production
npm run diagnose https://damdayvillage.com

# For staging
npm run diagnose https://staging.damdayvillage.com

# For local development
npm run diagnose http://localhost:3000
```

## Interpreting Results

### ✅ All Green - System Healthy

Everything is working correctly:
- Configuration is valid
- Database is connected
- Admin user exists
- Ready for login

**Action**: Go to `/admin-panel/login` and sign in.

### ⚠️ Yellow Warnings - System Degraded

Some non-critical issues detected:
- Database connection is slow
- Optional features disabled
- Non-critical configuration missing

**Action**: System should work, but investigate warnings.

### ❌ Red Errors - System Misconfigured

Critical issues preventing login:
- Environment variables missing
- Database unreachable
- Admin user not found

**Action**: Follow recommendations in the diagnostic output.

## Troubleshooting Workflow

1. **Run Diagnostic**
   ```bash
   npm run diagnose https://damdayvillage.com
   ```

2. **Check Auth Status**
   ```bash
   curl https://damdayvillage.com/api/auth/status | jq
   ```

3. **Follow Recommendations**
   - The diagnostic output provides specific commands to fix issues
   - Most common: Replace placeholder values in environment variables

4. **Verify Admin User**
   ```bash
   npm run admin:verify
   ```

5. **Test Login**
   - Visit: `https://damdayvillage.com/admin-panel/login`
   - Use: `admin@damdayvillage.org` / `Admin@123`

6. **Check Logs**
   ```bash
   docker logs <container> --tail 100
   ```

## Integration with Monitoring

### Uptime Monitoring

Add these endpoints to your uptime monitor:
- Primary: `https://damdayvillage.com/api/health`
- Auth: `https://damdayvillage.com/api/auth/status`

### Alerting

Set up alerts when:
- `/api/health` returns non-200 status
- `/api/auth/status` has `"healthy": false`
- Response time > 5 seconds

### CI/CD Pipeline

Add to your deployment pipeline:

```yaml
# .github/workflows/deploy.yml
- name: Validate Configuration
  run: npm run validate:env

- name: Run Diagnostic
  run: npm run diagnose https://damdayvillage.com
  
- name: Verify Admin User
  run: npm run admin:verify
```

## Advanced Diagnostics

### Database Connection Test

```bash
# Direct PostgreSQL connection test
psql $DATABASE_URL -c "SELECT 1"

# Check admin user in database
psql $DATABASE_URL -c "SELECT id, email, role, verified, active FROM users WHERE email = 'admin@damdayvillage.org';"
```

### Network Diagnostics

```bash
# Check DNS resolution
nslookup damdayvillage.com

# Check SSL certificate
echo | openssl s_client -connect damdayvillage.com:443 -servername damdayvillage.com 2>/dev/null | openssl x509 -noout -dates

# Test connectivity
curl -v https://damdayvillage.com/api/health
```

### Application Logs

```bash
# CapRover
docker logs $(docker ps | grep srv-captain--village | awk '{print $1}') --tail 100 -f

# Docker Compose
docker-compose logs -f --tail 100

# System service
journalctl -u village-app -n 100 -f
```

## Performance Testing

Test authentication performance:

```bash
# Time health check
time curl https://damdayvillage.com/api/health

# Time auth status check
time curl https://damdayvillage.com/api/auth/status

# Load test (requires Apache Bench)
ab -n 100 -c 10 https://damdayvillage.com/api/health
```

## Documentation Links

- [Production Login Troubleshooting](docs/PRODUCTION_LOGIN_TROUBLESHOOTING.md)
- [Auth Error Handling](docs/AUTH_ERROR_HANDLING.md)
- [Admin Panel Setup](ADMIN_PANEL_SETUP.md)
- [Production Readiness](PRODUCTION_READINESS.md)

## Support

If diagnostics don't resolve the issue:

1. **Collect Information**:
   - Diagnostic output
   - Auth status response
   - Last 100 lines of logs
   - Environment configuration (without secrets)

2. **Review Documentation**:
   - Check all linked docs above
   - Search for specific error messages

3. **Contact Support**:
   - Email: support@damdayvillage.com
   - Include diagnostic output and logs
   - Describe steps already tried

---

**Version**: 2.0  
**Last Updated**: January 2025  
**Status**: Production-Ready
