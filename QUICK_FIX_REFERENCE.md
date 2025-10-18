# Quick Fix Reference Guide

## Issue: Docker Build Fails at npm ci

### Error Message
```
npm error A complete log of this run can be found in: /root/.npm/_logs/...
The command '/bin/sh -c ... npm ci ...' returned a non-zero code: 1
```

### Quick Fix ✅
**Already Applied** - Build dependencies added to all Dockerfiles.

If you see this error, ensure your Dockerfile includes:
```dockerfile
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    linux-headers
```

### Why It Works
The `argon2` package requires native compilation. Alpine Linux needs build tools installed.

---

## Issue: "Invalid datasource" Error

### Error Message
```
PrismaClientConstructorValidationError: Invalid value undefined for datasource "db"
```

### Quick Fix
Set DATABASE_URL environment variable:
```bash
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

**During Build:** Use dummy URL
```bash
DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
SKIP_DB_DURING_BUILD=true
```

---

## Issue: NextAuth Secret Error

### Error Message
```
[next-auth][error][NO_SECRET]
```

### Quick Fix
Set NEXTAUTH_SECRET (minimum 32 characters):
```bash
# Generate a secure secret
openssl rand -base64 32

# Or use
NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

---

## Issue: Build Hangs During Type Checking

### Symptoms
Build stops at "Checking validity of types" step

### Quick Fix
These environment variables are already set in Dockerfiles:
```bash
TYPESCRIPT_NO_TYPE_CHECK=true
CI=true
```

---

## Issue: Memory Error During Build

### Error Message
```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

### Quick Fix
Increase Node.js memory limit (already configured):
```dockerfile
ENV NODE_OPTIONS="--max-old-space-size=1024"
```

For servers with more RAM, increase to 2048 or 4096.

---

## Issue: CapRover Build Times Out

### Symptoms
Build takes too long and times out

### Quick Fix
1. Enable build cache in CapRover
2. Increase timeout in CapRover settings
3. Use faster build server if possible
4. Check network connectivity

---

## Issue: Permission Denied Errors

### Error Message
```
EACCES: permission denied
```

### Quick Fix
Ensure proper file permissions in Dockerfile:
```dockerfile
COPY --chown=nextjs:nodejs /app/.next ./.next
```

Already configured in all Dockerfiles.

---

## Issue: Missing Prisma Client

### Error Message
```
Cannot find module '@prisma/client'
```

### Quick Fix
Ensure Prisma generation step is in Dockerfile:
```dockerfile
RUN node /app/node_modules/prisma/build/index.js generate
```

Already configured in all Dockerfiles.

---

## Issue: Port Already in Use

### Error Message
```
Error: listen EADDRINUSE: address already in use :::80
```

### Quick Fix
1. Stop conflicting service
2. Or change port in environment:
```bash
PORT=3000
```

---

## Issue: Database Migration Fails

### Error Message
```
Migration failed: ...
```

### Quick Fix
1. **Check DATABASE_URL is correct**
2. **Ensure database is accessible**
3. **Run migrations manually:**
```bash
npx prisma migrate deploy
```

---

## Issue: Slow Page Loads

### Symptoms
Pages take long time to load

### Quick Fix
1. Check database connection pooling
2. Enable CDN for static assets
3. Monitor database query performance
4. Check network latency

---

## Issue: Component Not Found

### Error Message
```
Module not found: Can't resolve '@/lib/components/...'
```

### Quick Fix
All components are properly integrated. If you see this:
1. Check import path is correct
2. Verify component file exists
3. Restart dev server

---

## Quick Commands Reference

### Build Locally
```bash
# Install dependencies
npm ci

# Build with dummy DB
DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" \
SKIP_DB_DURING_BUILD=true \
npm run build
```

### Run Tests
```bash
npm test
```

### Type Check
```bash
npm run type-check
```

### Lint
```bash
npm run lint
```

### Build Docker Image
```bash
docker build -f Dockerfile.simple -t village-app .
```

### Run Docker Container
```bash
docker run -d -p 80:80 \
  -e DATABASE_URL="postgresql://..." \
  -e NEXTAUTH_SECRET="..." \
  village-app
```

---

## Environment Variables Checklist

### Required
- [ ] DATABASE_URL
- [ ] NEXTAUTH_SECRET (min 32 chars)
- [ ] NEXTAUTH_URL

### Build-time
- [x] NODE_ENV=production
- [x] NEXT_TELEMETRY_DISABLED=1
- [x] TYPESCRIPT_NO_TYPE_CHECK=true
- [x] SKIP_DB_DURING_BUILD=true (for build)

### Optional
- [ ] STRIPE_SECRET_KEY
- [ ] STRIPE_PUBLISHABLE_KEY
- [ ] RAZORPAY_KEY_ID
- [ ] RAZORPAY_KEY_SECRET
- [ ] SENDGRID_API_KEY

---

## Health Check Endpoints

Test these after deployment:

```bash
# Homepage
curl https://your-domain.com

# API Health
curl https://your-domain.com/api/admin/check-env

# Database Health (requires auth)
curl https://your-domain.com/api/admin/verify-setup
```

---

## Common CapRover Issues

### Issue: Placeholder Variables Not Replaced
**Symptom:** `$$cap_postgres$$` in DATABASE_URL
**Fix:** Set actual values in CapRover dashboard, not placeholders

### Issue: Build Cache Issues
**Fix:** Clear build cache in CapRover settings

### Issue: SSL Certificate Issues
**Fix:** Enable Force HTTPS in CapRover app settings

---

## Integration Status ✅

All integrations are complete:
- ✅ UI Components (Button, Card, Input, etc.)
- ✅ Public Components (HomestayCard, ProductCard)
- ✅ Admin Panel (Analytics, Bookings, Products)
- ✅ API Routes (Public, Admin, Auth)
- ✅ Pages (Home, Admin, User, Homestays)
- ✅ Database (Prisma + PostgreSQL)
- ✅ Authentication (NextAuth)
- ✅ Payment (Stripe, Razorpay)
- ✅ PWA Support
- ✅ Security Headers

---

## Need More Help?

1. Check DEPLOYMENT_GUIDE.md for detailed instructions
2. Review SECURITY_SUMMARY.md for security issues
3. Check application logs for specific errors
4. Review README.md for project overview
