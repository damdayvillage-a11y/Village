# 🔧 Troubleshooting Guide

> **Solutions to common issues when deploying the Village application**

## 📋 Table of Contents

1. [Build Issues](#build-issues)
2. [Database Issues](#database-issues)
3. [Authentication Issues](#authentication-issues)
4. [Deployment Issues](#deployment-issues)
5. [Performance Issues](#performance-issues)
6. [Network Issues](#network-issues)

---

## 🏗️ Build Issues

### Issue: Build Fails with "npm install" Errors

**Symptoms:**
```
npm ERR! code ECONNRESET
npm ERR! errno ECONNRESET
```

**Solutions:**

1. **Increase Memory:**
   - Coolify: Application → Settings → Memory Limit → 2GB minimum
   - CapRover: App → App Configs → Increase resources

2. **Clear Build Cache:**
   - Coolify: Enable "Force Rebuild" before deploying
   - CapRover: App → More → Clear Build Cache

3. **Check Network:**
   ```bash
   # Test npm registry
   curl https://registry.npmjs.org
   ```

---

### Issue: Build Hangs During Prisma Generation

**Symptoms:**
- Build stops at "Generating Prisma Client"
- No output for 10+ minutes
- Build eventually times out

**Solutions:**

1. **Use Direct Node Path:**
   - Already configured in `Dockerfile.simple`
   - Uses: `node /app/node_modules/prisma/build/index.js generate`

2. **Increase Build Timeout:**
   - Coolify: Settings → Build Timeout → 600 seconds
   - CapRover: Increase timeout in app settings

3. **Check Memory:**
   ```bash
   # During build, check memory usage
   docker stats
   ```

---

### Issue: TypeScript Compilation Errors

**Symptoms:**
```
Type error: ...
```

**Solutions:**

1. **Skip Type Checking (Emergency Only):**
   ```bash
   # Add to environment variables
   TYPESCRIPT_NO_TYPE_CHECK=true
   ```

2. **Fix Type Errors:**
   ```bash
   # Check locally first
   npm run type-check
   ```

3. **Update Dependencies:**
   ```bash
   npm update
   ```

---

## 🗄️ Database Issues

### Issue: "ECONNREFUSED" - Can't Connect to Database

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**

1. **Verify Database is Running:**
   - Coolify: Database → Status should be green
   - CapRover: Apps → PostgreSQL App → Check running

2. **Check DATABASE_URL Format:**
   ```bash
   # WRONG (localhost)
   DATABASE_URL=postgresql://user:pass@localhost:5432/db
   
   # CORRECT (Coolify internal)
   DATABASE_URL=postgresql://user:pass@village-db:5432/db
   
   # CORRECT (CapRover internal)
   DATABASE_URL=postgresql://user:pass@srv-captain--postgres:5432/db
   ```

3. **Test Connection:**
   ```bash
   # In app terminal
   psql $DATABASE_URL
   
   # Should connect successfully
   # If not, check username, password, host, port
   ```

4. **Check Network:**
   - Both app and database in same project/network
   - Coolify handles this automatically
   - CapRover uses docker network

---

### Issue: "Invalid Password" or "Authentication Failed"

**Symptoms:**
```
error: password authentication failed for user "..."
```

**Solutions:**

1. **Verify Password:**
   - Check password in DATABASE_URL matches database password
   - No special characters need escaping in Coolify
   - In CapRover, check `$$cap_postgres_pass$$` was replaced

2. **Reset Database Password:**
   
   **In Coolify:**
   - Database → Settings → Change Password
   - Update DATABASE_URL in app
   - Redeploy app

   **In CapRover:**
   - Apps → PostgreSQL → App Configs
   - Change password
   - Update in your app

3. **Check Username:**
   ```bash
   # Default usernames:
   # Coolify: villageuser (or what you set)
   # CapRover: postgres (default)
   # Your DB: check what you configured
   ```

---

### Issue: Database Migrations Fail

**Symptoms:**
```
Error: P1001: Can't reach database server
Migration engine error: ...
```

**Solutions:**

1. **Check Database is Ready:**
   ```bash
   # Wait for database to be fully ready
   # In app terminal
   until psql $DATABASE_URL -c "SELECT 1" > /dev/null 2>&1; do
     echo "Waiting for database..."
     sleep 2
   done
   ```

2. **Run Migrations Manually:**
   ```bash
   # In application terminal
   npx prisma migrate deploy
   ```

3. **Check Migration Files:**
   ```bash
   # List migrations
   npx prisma migrate status
   
   # If failed, try reset (⚠️ loses data!)
   npx prisma migrate reset
   ```

4. **Database Permissions:**
   ```sql
   -- Connect to database
   psql $DATABASE_URL
   
   -- Check permissions
   \du
   
   -- Grant all permissions
   GRANT ALL PRIVILEGES ON DATABASE villagedb TO villageuser;
   ```

---

### Issue: "Admin User Not Found"

**Symptoms:**
- Can't login to admin panel
- Error: "Invalid credentials"
- 500 error on login

**Solutions:**

1. **Verify Admin Exists:**
   ```bash
   # In app terminal
   npm run admin:verify
   ```

2. **Create Admin User:**
   ```bash
   # In app terminal
   npm run db:seed
   ```

3. **Check Database:**
   ```sql
   -- Connect to database
   psql $DATABASE_URL
   
   -- Check admin user
   SELECT email, role, verified FROM users WHERE role = 'ADMIN';
   
   -- Should return: admin@damdayvillage.org | ADMIN | true
   ```

4. **Manual Admin Creation:**
   ```bash
   # Visit in browser
   https://your-domain.com/api/admin/init
   
   # Should create admin if missing
   ```

---

## 🔐 Authentication Issues

### Issue: 500 Error on Admin Panel Login

**Symptoms:**
- Homepage works fine
- `/admin-panel/login` shows 500 Internal Server Error
- No error message displayed

**Solutions:**

1. **Check Environment Variables:**
   ```bash
   # In app terminal
   echo $NEXTAUTH_URL
   # Should be: https://your-actual-domain.com
   
   echo $NEXTAUTH_SECRET
   # Should be: 32+ character string
   
   echo $DATABASE_URL
   # Should be: postgresql://...
   ```

2. **Validate Configuration:**
   ```bash
   # Visit diagnostic endpoint
   curl https://your-domain.com/api/admin/check-env
   
   # Should show all green
   ```

3. **Check Migrations:**
   ```bash
   npx prisma migrate status
   # All migrations should be applied
   ```

4. **Check Admin User:**
   ```bash
   npm run admin:verify
   # Should confirm admin exists
   ```

5. **Check Logs:**
   - Coolify: Application → Logs
   - CapRover: App → App Logs
   - Look for specific error messages

---

### Issue: "NEXTAUTH_URL" Error

**Symptoms:**
```
[auth][error] MissingSecretError: Please define a `NEXTAUTH_SECRET`
```

**Solutions:**

1. **Set NEXTAUTH_SECRET:**
   ```bash
   # Generate new secret
   openssl rand -base64 32
   
   # Add to environment variables
   NEXTAUTH_SECRET=your-generated-secret-here
   ```

2. **Verify Length:**
   - Must be minimum 32 characters
   - Random and unpredictable
   - Different from development

3. **Restart Application:**
   - After setting, redeploy or restart app
   - Changes take effect after restart

---

### Issue: "Redirect URI Mismatch" (OAuth)

**Symptoms:**
```
redirect_uri_mismatch
```

**Solutions:**

1. **Update OAuth Callback URLs:**
   
   **Google:**
   - https://console.cloud.google.com/apis/credentials
   - Add: `https://your-domain.com/api/auth/callback/google`
   
   **GitHub:**
   - https://github.com/settings/applications
   - Update Authorization callback URL

2. **Check NEXTAUTH_URL:**
   ```bash
   # Must match your actual domain
   NEXTAUTH_URL=https://your-domain.com
   ```

3. **Wait for DNS:**
   - If you just changed domain, wait for DNS propagation
   - Can take up to 48 hours (usually minutes)

---

## 🚀 Deployment Issues

### Issue: Application Won't Start

**Symptoms:**
- Container starts then immediately stops
- Status shows "Exited"
- Health check fails

**Solutions:**

1. **Check Logs:**
   - Coolify: Application → Logs
   - Look for specific error message
   - Common: missing env vars, database connection

2. **Verify Environment Variables:**
   ```bash
   # All required variables must be set
   NODE_ENV=production
   NEXTAUTH_URL=https://...
   NEXTAUTH_SECRET=...
   DATABASE_URL=postgresql://...
   ```

3. **Check Database Connection:**
   ```bash
   # Test from app terminal
   psql $DATABASE_URL -c "SELECT 1"
   ```

4. **Check Port Configuration:**
   - Application listens on port 80
   - Coolify should expose this correctly
   - Check Networking settings

---

### Issue: Health Check Fails

**Symptoms:**
```
Health check failed: Connection refused
```

**Solutions:**

1. **Verify Health Check Configuration:**
   - URL: `/api/health`
   - Port: `80`
   - Method: `GET`

2. **Test Health Endpoint:**
   ```bash
   # From inside container
   curl http://localhost:80/api/health
   
   # Should return JSON with status
   ```

3. **Increase Timeout:**
   - Health check may need more time
   - Increase interval and timeout

4. **Check Application Logs:**
   - Look for startup errors
   - Database connection issues
   - Port binding errors

---

### Issue: Build Succeeds but Application Crashes

**Symptoms:**
- Build completes successfully
- Application starts then crashes
- Repeated restart loop

**Solutions:**

1. **Check Memory Limit:**
   - Minimum 2GB required
   - Increase if application crashes with OOM

2. **Check Environment Variables:**
   - All required vars set
   - No placeholders remaining
   - Correct DATABASE_URL

3. **Check Database Schema:**
   ```bash
   # Verify migrations applied
   npx prisma migrate status
   
   # Apply if needed
   npx prisma migrate deploy
   ```

4. **Review Logs:**
   - Look for uncaught exceptions
   - Database connection errors
   - Missing dependencies

---

## 🌐 Network Issues

### Issue: Can't Access Application (Domain)

**Symptoms:**
- Application deployed successfully
- Can't access via domain
- "Site can't be reached"

**Solutions:**

1. **Check DNS Configuration:**
   ```bash
   # Check DNS resolves correctly
   dig your-domain.com
   nslookup your-domain.com
   
   # Should return your server IP
   ```

2. **Wait for DNS Propagation:**
   - Can take up to 48 hours
   - Usually 5-30 minutes
   - Check at: https://dnschecker.org

3. **Check Domain Configuration:**
   - Coolify: Application → Networking → Domain
   - Verify domain is set correctly
   - Check DNS records in domain registrar

4. **Try IP Access:**
   ```bash
   # Access by IP temporarily
   http://your-server-ip
   ```

---

### Issue: SSL Certificate Not Working

**Symptoms:**
- "Your connection is not private"
- SSL certificate error
- HTTPS not working

**Solutions:**

1. **Check SSL Status:**
   - Coolify: Application → Networking → SSL
   - Should show "Active" or "Valid"

2. **Request Certificate:**
   - If not active, click "Request Certificate"
   - Coolify uses Let's Encrypt automatically

3. **Check DNS:**
   - DNS must resolve before SSL works
   - Verify with: `dig your-domain.com`

4. **Check Port 80/443:**
   - Both must be accessible
   - Firewall rules may block
   - Check server firewall

5. **Wait for Certificate:**
   - Takes 1-5 minutes to issue
   - Check logs for errors

---

### Issue: API Requests Failing (CORS)

**Symptoms:**
```
Access-Control-Allow-Origin error
CORS policy blocked
```

**Solutions:**

1. **Check NEXTAUTH_URL:**
   - Must match domain making requests
   - Include protocol (https://)

2. **Configure CORS (if needed):**
   ```javascript
   // Already configured in middleware.ts
   // Should allow same-origin by default
   ```

3. **Check Request Origin:**
   - Frontend and backend on same domain
   - Or configure CORS for different origins

---

## ⚡ Performance Issues

### Issue: Application Slow to Respond

**Symptoms:**
- Pages load slowly
- API requests timeout
- Database queries slow

**Solutions:**

1. **Check Resource Usage:**
   ```bash
   # In server terminal
   docker stats
   
   # Check CPU, memory usage
   ```

2. **Increase Resources:**
   - Memory: 4GB recommended for production
   - CPU: 2+ cores recommended

3. **Check Database:**
   ```sql
   -- Find slow queries
   SELECT query, mean_exec_time
   FROM pg_stat_statements
   ORDER BY mean_exec_time DESC
   LIMIT 10;
   ```

4. **Enable Connection Pooling:**
   ```bash
   # In DATABASE_URL
   DATABASE_URL=postgresql://...?connection_limit=10&pool_timeout=30
   ```

5. **Check Logs:**
   - Look for slow queries
   - Check for memory warnings
   - Look for connection pool exhaustion

---

### Issue: Out of Memory (OOM)

**Symptoms:**
```
FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed
```

**Solutions:**

1. **Increase Memory Limit:**
   - Minimum 2GB, recommended 4GB
   - Coolify: Settings → Memory Limit

2. **Check for Memory Leaks:**
   ```bash
   # Monitor memory over time
   docker stats
   
   # If steadily increasing, may be leak
   ```

3. **Optimize Node.js:**
   ```bash
   # Already set in Dockerfile
   NODE_OPTIONS="--max-old-space-size=4096"
   ```

---

## 🔍 Debugging Tips

### Enable Verbose Logging

```bash
# Add to environment variables
LOG_LEVEL=debug
NODE_ENV=development  # Temporarily for more logs
```

### Check All Diagnostic Endpoints

```bash
# 1. Health check
curl https://your-domain.com/api/health

# 2. Auth status
curl https://your-domain.com/api/auth/status

# 3. Environment check
curl https://your-domain.com/api/admin/check-env

# 4. Database check
psql $DATABASE_URL -c "SELECT 1"
```

### Access Container Shell

**Coolify:**
- Application → Terminal

**CapRover:**
- App → More → Execute Command

**Docker (SSH):**
```bash
docker exec -it container-name sh
```

### Check Application Logs

**Coolify:**
- Application → Logs
- Real-time streaming
- Search functionality

**CapRover:**
- App → App Logs
- Last 100 lines by default

**Docker:**
```bash
docker logs container-name -f --tail 100
```

---

## 📚 Additional Resources

### Documentation
- [Coolify Deployment Guide](./COOLIFY_DEPLOYMENT_GUIDE.md)
- [CapRover Migration Guide](./CAPROVER_TO_COOLIFY_MIGRATION.md)
- [Environment Variables Reference](./ENVIRONMENT_VARIABLES.md)

### External Resources
- [Coolify Docs](https://coolify.io/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)

### Community Support
- [GitHub Issues](https://github.com/damdayvillage-a11y/Village/issues)
- [Coolify Discord](https://coolify.io/discord)

---

## 🆘 Still Stuck?

If none of the above solutions work:

1. **Collect Diagnostic Information:**
   ```bash
   # Environment check
   curl https://your-domain.com/api/admin/check-env > env-check.json
   
   # Health check
   curl https://your-domain.com/api/health > health-check.json
   
   # Application logs (last 100 lines)
   # Copy from Coolify/CapRover dashboard
   
   # Database connection
   psql $DATABASE_URL -c "SELECT version()" > db-version.txt
   ```

2. **Open GitHub Issue:**
   - Include diagnostic output
   - Include relevant logs
   - Describe steps already tried
   - Mention deployment platform (Coolify/CapRover)

3. **Community Support:**
   - Coolify Discord for platform issues
   - GitHub Issues for application issues

---

**Version:** 1.0  
**Last Updated:** January 2025  
**Maintained by:** Village Development Team
