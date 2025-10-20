# Build Guide - Smart Carbon-Free Village Platform

## Memory Requirements

### Docker Build Requirements
- **Minimum RAM**: 4GB available memory (increased from 3GB)
- **Recommended RAM**: 6GB or higher
- **Node.js Heap Size**: 3072MB (3GB) - increased for PWA builds
- **Build Time**: 6-10 minutes on standard hardware

### Error Code 137 (Out of Memory)
If you see error code 137 during Docker build, it means the build process ran out of memory and was killed by the system.

**Common Causes:**
1. Insufficient memory allocated to Docker
2. Too many simultaneous processes
3. Large application with many dependencies (Next.js + PWA + Three.js)
4. PWA service worker generation consuming memory
5. Server has less than 4GB total RAM

**Solutions:**
1. Increase Docker memory allocation (Docker Desktop → Settings → Resources → Memory → 6GB minimum)
2. Use the memory-optimized build configuration (already set to 3GB heap)
3. Close other applications to free up system memory
4. Add swap space if running on Linux with limited RAM (see below)
5. Consider using a cloud build service with guaranteed resources
6. For CapRover: Ensure server has at least 4GB RAM, or use a separate build server

## Docker Build Process

### Standard Docker Build
```bash
# Build with default settings (3GB heap)
docker build -f Dockerfile.simple -t village-app:latest .

# Build with custom memory limit (if 3GB is not enough)
docker build -f Dockerfile.simple \
  --build-arg BUILD_MEMORY_LIMIT=4096 \
  -t village-app:latest .

# For low-memory environments (not recommended, may fail)
docker build -f Dockerfile.simple \
  --build-arg BUILD_MEMORY_LIMIT=2048 \
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
   - Minimum 4GB RAM free during build (increased from 2GB)
   - Recommended 6GB+ total RAM for comfortable builds
   - Consider upgrading server or using build server

3. **Monitor Build Logs**:
   - Watch for "Killed" message (OOM indicator)
   - Check memory usage: `free -h`
   - Check disk space: `df -h`

### Coolify Deployment
```bash
# Build using docker-compose
docker-compose -f docker-compose.coolify.yml build

# Set memory limits in docker-compose.coolify.yml (already configured)
services:
  app:
    deploy:
      resources:
        limits:
          memory: 6G  # Minimum for reliable builds
        reservations:
          memory: 3G
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

# Build with increased memory (now default: 3GB)
NODE_OPTIONS='--max-old-space-size=3072' npm run build
```

### Production Build
```bash
# Standard production build (3GB heap)
npm run build:production

# Safe production build (skips type checking)
npm run build:production-safe

# Custom memory allocation (if needed)
NODE_OPTIONS='--max-old-space-size=4096' npm run build
```

## Build Optimization Tips

### 1. Reduce Memory Usage
- **Disable Source Maps**: Already set (`GENERATE_SOURCEMAP=false`)
- **Skip Type Checking**: Use `build:production-safe` script
- **Limit PWA Cache**: Reduced to 2MB maximum file size
- **Clean Build Cache**: Run `rm -rf .next` before building
- **Reduce Parallelism**: Set `UV_THREADPOOL_SIZE=64` (already configured)

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
1. Increase Docker memory to 6GB minimum (Docker Desktop → Settings → Resources)
2. Close other applications to free RAM
3. Use swap file if on Linux:
   ```bash
   # Create 8GB swap file (2x increased from 4GB)
   sudo fallocate -l 8G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   # Make permanent
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```
4. Build on a machine with more RAM (6GB+ recommended)
5. Use cloud build service (GitHub Actions, CircleCI, etc.)
6. For CapRover on low-memory VPS:
   ```bash
   # Create swap before deploying
   sudo fallocate -l 8G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   # Then deploy
   git push caprover main
   ```

### Build Fails with "JavaScript heap out of memory"
**Problem**: Node.js ran out of heap memory

**Solutions**:
1. Already fixed with `NODE_OPTIONS='--max-old-space-size=3072'` (3GB)
2. Increase further if needed:
   ```bash
   # For development
   NODE_OPTIONS='--max-old-space-size=4096' npm run build
   
   # For Docker build
   docker build -f Dockerfile.simple \
     --build-arg BUILD_MEMORY_LIMIT=4096 \
     -t village-app:latest .
   ```
3. Ensure Docker has at least 6GB allocated
4. Check if other processes are consuming memory: `docker stats`

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
# Node.js heap size (default: 3072MB)
NODE_OPTIONS='--max-old-space-size=3072'

# Docker build argument
BUILD_MEMORY_LIMIT=3072
```

### CapRover Specific Settings
For CapRover deployments on low-memory servers (< 4GB RAM):
```bash
# SSH into your server
ssh root@your-server

# Create swap space
sudo fallocate -l 8G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify swap is active
free -h

# Then deploy
git push caprover main
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
- **GitHub Actions**: ubuntu-latest has 7GB RAM (sufficient) ✅
- **CircleCI**: Use `resource_class: large` (4GB RAM minimum) or `xlarge` (8GB recommended)
- **GitLab CI**: Use `tags: [large]` for sufficient resources (8GB recommended)
- **CapRover**: Server needs 4GB+ RAM, or add 8GB swap space

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
**Memory Config**: 3072MB default (3GB), adjustable up to 4GB+
**Critical Fix**: Increased from 2GB to 3GB to resolve OOM issues during PWA build
