# Deployment Guide - Smart Carbon-Free Village

## Docker Build Fix Applied ✅

This guide provides instructions for deploying the application after the Docker build fix has been implemented.

## What Was Fixed

### Problem
The Docker build was failing at the `npm ci` step with error:
```
npm error A complete log of this run can be found in: /root/.npm/_logs/...
The command returned a non-zero code: 1
```

### Root Cause
The `argon2` package (secure password hashing library) requires native compilation with C++ build tools. Alpine Linux base image doesn't include these by default.

### Solution
Added build dependencies to all Dockerfiles:
```dockerfile
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    linux-headers
```

## Deployment Steps

### 1. CapRover Deployment

The application is configured to use `Dockerfile.simple` (specified in `captain-definition`).

#### Prerequisites
- CapRover instance running
- PostgreSQL database available
- Domain/subdomain configured

#### Environment Variables Required

Set these in CapRover dashboard before deployment:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host:5432/database_name

# NextAuth Configuration
NEXTAUTH_SECRET=<generate-a-secure-random-string-min-32-chars>
NEXTAUTH_URL=https://your-domain.com

# Node Environment
NODE_ENV=production

# Optional: Build Configuration
BUILD_MEMORY_LIMIT=1024
```

#### Deployment Process

1. **Push to CapRover:**
   ```bash
   git push caprover main
   ```

2. **Monitor Build Logs:**
   - Watch for successful npm ci step
   - Verify Prisma client generation
   - Check Next.js build completion

3. **Run Database Migrations:**
   Set as "Pre-Deploy Script" in CapRover:
   ```bash
   npx prisma migrate deploy
   ```

4. **Seed Database (Optional):**
   Run after first deployment:
   ```bash
   npx tsx scripts/seed.ts
   ```

### 2. Manual Docker Build

If building Docker image manually:

```bash
# Build the image
docker build -f Dockerfile.simple -t village-app:latest .

# Run with environment variables
docker run -d \
  -p 80:80 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e NEXTAUTH_SECRET="your-secret-here" \
  -e NEXTAUTH_URL="https://your-domain.com" \
  village-app:latest
```

### 3. Coolify Deployment

For Coolify platform:

1. Use `docker-compose.coolify.yml`
2. Set environment variables in Coolify dashboard
3. Deploy using Coolify's deployment pipeline

## Post-Deployment Verification

### 1. Check Application Health

Visit your deployment URL and verify:
- ✅ Homepage loads correctly
- ✅ No database connection errors
- ✅ Authentication works
- ✅ API endpoints respond

### 2. Check Database

```bash
# Connect to your database
npx prisma studio

# Or check via psql
psql $DATABASE_URL
```

### 3. Check Logs

Monitor application logs for:
- Successful database connection
- No Prisma errors
- Next.js server started on port 80

## Troubleshooting

### Build Fails at npm ci

**Symptoms:** Build fails during dependency installation
**Solution:** Ensure Dockerfile includes build dependencies:
```dockerfile
RUN apk add --no-cache python3 make g++ linux-headers
```

### Database Connection Errors

**Symptoms:** "PrismaClientConstructorValidationError: Invalid datasource"
**Solution:** 
1. Verify DATABASE_URL is set correctly
2. Check database is accessible from container
3. Ensure no $$cap_*$$ placeholders remain

### Build Succeeds but App Crashes

**Symptoms:** Container starts but immediately exits
**Solution:**
1. Check NEXTAUTH_SECRET is set (min 32 characters)
2. Verify all required environment variables
3. Check startup logs for errors

### Memory Issues During Build

**Symptoms:** Build crashes with "JavaScript heap out of memory"
**Solution:**
1. Set BUILD_MEMORY_LIMIT=1024 (or higher if available)
2. Reduce concurrent builds
3. Consider using build cache

## Performance Optimization

### 1. Database Connection Pooling

Already configured in Prisma client with connection pooling enabled.

### 2. Next.js Build Optimization

- ✅ Standalone output mode enabled
- ✅ Source maps disabled in production
- ✅ Type checking optimized for Docker
- ✅ ESLint checks disabled during build

### 3. Docker Image Size

- ✅ Multi-stage build reduces image size
- ✅ Only production dependencies in final image
- ✅ Build cache layers optimized

## Monitoring

### Key Metrics to Monitor

1. **Application Health:**
   - Response times
   - Error rates
   - Memory usage

2. **Database Performance:**
   - Query execution times
   - Connection pool usage
   - Database size

3. **Build Performance:**
   - Build duration
   - Cache hit rate
   - Docker layer caching

## Rollback Procedure

If deployment fails:

1. **CapRover:**
   - Use CapRover's built-in rollback feature
   - Or redeploy previous commit

2. **Manual Deployment:**
   ```bash
   docker stop village-app
   docker start village-app-previous
   ```

## Security Considerations

- ✅ Argon2 used for password hashing (industry best practice)
- ✅ Security headers configured
- ✅ Database credentials secured via environment variables
- ✅ No sensitive data in Docker image
- ✅ Running as non-root user (nextjs)

## Support

For issues or questions:
1. Check build logs in CapRover/Coolify dashboard
2. Review application logs
3. Refer to repository documentation
4. Check SECURITY_SUMMARY.md for security-related issues

## Version Information

- Next.js: 14.2.33
- Node.js: 20 (Alpine)
- Prisma: 6.17.1
- PostgreSQL: 14+ recommended

## Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [CapRover Documentation](https://caprover.com/docs)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
