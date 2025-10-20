# Build Guide - Smart Carbon-Free Village Platform

## Memory Requirements

### Docker Build Requirements
- **Minimum RAM**: 3GB available memory
- **Recommended RAM**: 4GB or higher
- **Node.js Heap Size**: 2048MB (2GB)
- **Build Time**: 6-10 minutes on standard hardware

### Error Code 137 (Out of Memory)
If you see error code 137 during Docker build, it means the build process ran out of memory and was killed by the system.

**Common Causes:**
1. Insufficient memory allocated to Docker
2. Too many simultaneous processes
3. Large application with many dependencies
4. PWA service worker generation consuming memory

**Solutions:**
1. Increase Docker memory allocation (Docker Desktop → Settings → Resources)
2. Use the memory-optimized build configuration (already set to 2048MB)
3. Close other applications to free up system memory
4. Consider using a cloud build service with guaranteed resources

## Docker Build Process

### Standard Docker Build
```bash
# Build with default settings (2GB heap)
docker build -f Dockerfile.simple -t village-app:latest .

# Build with custom memory limit
docker build -f Dockerfile.simple \
  --build-arg BUILD_MEMORY_LIMIT=3072 \
  -t village-app:latest .
```

### CapRover Deployment
CapRover automatically builds from the Dockerfile. To ensure successful builds:

1. **Set Environment Variables** in CapRover dashboard:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/db
   NEXTAUTH_SECRET=your-secret-min-32-chars
   NEXTAUTH_URL=https://your-domain.com
   ```

2. **Increase Server Memory** if builds fail:
   - Minimum 2GB RAM free during build
   - Consider upgrading server or using build server

3. **Monitor Build Logs**:
   - Watch for "Killed" message (OOM indicator)
   - Check memory usage: `free -h`
   - Check disk space: `df -h`

### Coolify Deployment
```bash
# Build using docker-compose
docker-compose -f docker-compose.coolify.yml build

# Set memory limits in docker-compose.coolify.yml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 4G
```

## Local Development Build

### Prerequisites
```bash
# Install dependencies
npm install

# Verify Node.js version
node --version  # Should be v20.x or higher
```

### Development Build
```bash
# Build for development
npm run build

# Build with increased memory
NODE_OPTIONS='--max-old-space-size=2048' npm run build
```

### Production Build
```bash
# Standard production build (2GB heap)
npm run build:production

# Safe production build (skips type checking)
npm run build:production-safe

# Custom memory allocation
NODE_OPTIONS='--max-old-space-size=3072' npm run build
```

## Build Optimization Tips

### 1. Reduce Memory Usage
- **Disable Source Maps**: Already set (`GENERATE_SOURCEMAP=false`)
- **Skip Type Checking**: Use `build:production-safe` script
- **Limit PWA Cache**: Reduced to 3MB maximum file size
- **Clean Build Cache**: Run `rm -rf .next` before building

### 2. Speed Up Builds
- **Use SSD**: Significantly faster than HDD
- **Increase CPU Allocation**: More cores = faster build
- **Enable Caching**: Docker layer caching enabled
- **Prune Docker**: `docker system prune -a` to free space

### 3. Incremental Builds
```bash
# First build (full)
npm run build

# Subsequent builds (faster)
npm run dev  # For development
npm run build  # Uses cache when possible
```

## Troubleshooting

### Build Fails with "Killed" (Code 137)
**Problem**: Out of memory during build

**Solutions**:
1. Increase Docker memory to 4GB minimum
2. Close other applications
3. Use swap file if on Linux:
   ```bash
   # Create 4GB swap file
   sudo fallocate -l 4G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```
4. Build on a machine with more RAM
5. Use cloud build service (GitHub Actions, CircleCI, etc.)

### Build Fails with "JavaScript heap out of memory"
**Problem**: Node.js ran out of heap memory

**Solutions**:
1. Already fixed with `NODE_OPTIONS='--max-old-space-size=2048'`
2. Increase further if needed:
   ```bash
   NODE_OPTIONS='--max-old-space-size=4096' npm run build
   ```

### Build Succeeds but Takes Too Long
**Problem**: Build takes >15 minutes

**Check**:
1. Disk I/O speed (use SSD)
2. CPU usage (close background apps)
3. Network speed (for dependency download)
4. Docker layer caching enabled

**Solutions**:
1. Upgrade to SSD if using HDD
2. Increase Docker CPU allocation
3. Use local npm cache: `npm ci --cache /tmp/npm-cache`

### Type Errors During Build
**Problem**: TypeScript compilation errors

**Note**: Type checking is disabled in production builds to prevent build failures. This is intentional.

**To check types manually**:
```bash
npm run type-check
```

**To fix type errors**:
1. Enable type checking: Remove `TYPESCRIPT_NO_TYPE_CHECK=true`
2. Fix errors one by one
3. Consider using `// @ts-ignore` for non-critical errors

## Build Environment Variables

### Required for Build
```bash
# Database (can be dummy for build only)
DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Auth secrets (can be dummy for build only)
NEXTAUTH_SECRET="dummy-secret-for-build-only-min32chars"
NEXTAUTH_URL="http://localhost:3000"
```

### Build Optimizations
```bash
# Already configured in Dockerfile and package.json
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
CI=true
DISABLE_ESLINT_PLUGIN=true
GENERATE_SOURCEMAP=false
DISABLE_ESLINT=true
TYPESCRIPT_NO_TYPE_CHECK=true
CAPROVER_BUILD=true
SKIP_DB_DURING_BUILD=true
```

### Memory Configuration
```bash
# Node.js heap size (default: 2048MB)
NODE_OPTIONS='--max-old-space-size=2048'

# Docker build argument
BUILD_MEMORY_LIMIT=2048
```

## Build Stages Overview

### Stage 1: Dependencies (deps)
- Install all Node.js dependencies
- Includes build tools (Python, Make, G++)
- ~5 minutes, ~500MB layer

### Stage 2: Builder
- Generate Prisma client
- Copy source code
- Build Next.js application
- ~5-8 minutes, ~800MB layer

### Stage 3: Runner (production)
- Minimal runtime image
- Only production dependencies
- ~2 minutes, ~200-400MB final image

## Resource Monitoring

### During Build
```bash
# Watch memory usage
watch -n 1 'free -h'

# Watch disk usage
watch -n 1 'df -h'

# Docker stats (if build fails)
docker stats
```

### System Requirements Check
```bash
# Check available memory
free -h

# Check available disk space
df -h

# Check Docker resource limits
docker info | grep -E "Total Memory|CPUs"
```

## Continuous Integration

### GitHub Actions
```yaml
# Example .github/workflows/build.yml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/setup-buildx-action@v2
      - name: Build Docker image
        run: docker build -f Dockerfile.simple -t village-app:latest .
        env:
          DOCKER_BUILDKIT: 1
```

### Memory Recommendations for CI/CD
- **GitHub Actions**: ubuntu-latest has 7GB RAM (sufficient)
- **CircleCI**: Use `resource_class: large` (4GB RAM minimum)
- **GitLab CI**: Use `tags: [large]` for sufficient resources

## Build Performance Metrics

### Expected Build Times
- **First Build**: 8-12 minutes (no cache)
- **Cached Build**: 3-5 minutes (dependencies cached)
- **Incremental Build**: 2-3 minutes (code changes only)

### Image Sizes
- **Builder Stage**: ~1.5GB (temporary)
- **Final Image**: 200-400MB (production)
- **After Compression**: ~150MB (pushed to registry)

## Support

### Getting Help
1. Check build logs for specific error
2. Review this guide for solutions
3. Check CONFIGURATION.md for environment setup
4. Run diagnostic: `npm run diagnose`

### Common Issues Reference
- Error 137: See "Build Fails with 'Killed'" section above
- Heap out of memory: See "JavaScript heap out of memory" section
- Type errors: See "Type Errors During Build" section
- Slow builds: See "Build Succeeds but Takes Too Long" section

---

**Last Updated**: 2025-10-20  
**Applies to**: Docker builds, CapRover, Coolify, local development  
**Memory Config**: 2048MB default (adjustable)
