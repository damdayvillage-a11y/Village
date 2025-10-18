# Docker Build Optimization Guide

## Issue Fixed
**Error**: "no space left on device" during Docker build when deploying via CapRover

## Root Causes Identified
1. Large files being copied into Docker build context (docs/, memory2.md, tsconfig.tsbuildinfo)
2. Build artifacts and caches consuming disk space during build
3. NPM cache accumulating during dependency installation
4. No cleanup of temporary files after build

## Solutions Implemented

### 1. Optimized .dockerignore
Added exclusions for large and unnecessary files:
- Documentation files: `docs/`, `DEPLOYMENT_GUIDE.md`, `QUICK_FIX_REFERENCE.md`, `SECURITY_SUMMARY.md`
- Build artifacts: `tsconfig.tsbuildinfo`, `.next/cache`, `.storybook-cache`
- Development files: `tools/`, `ci/`, `stories/`, `.storybook`
- Other Dockerfiles: `Dockerfile.*`
- Large tracking files: `memory2.md`

**Impact**: Reduced Docker build context size by excluding ~8MB of unnecessary files

### 2. Enhanced .gitignore
Added entries to prevent committing build artifacts:
```
# TypeScript build info
tsconfig.tsbuildinfo
memory2.md
```

**Impact**: Removed 2MB tsconfig.tsbuildinfo from repository

### 3. Aggressive Build Cleanup in Dockerfiles
Added cleanup steps after the build in both `Dockerfile` and `Dockerfile.simple`:

```dockerfile
RUN echo "🧹 Cleaning up build artifacts to save disk space..." && \
    rm -rf .next/cache && \
    rm -rf node_modules/.cache && \
    rm -rf /tmp/* && \
    rm -rf /root/.npm && \
    npm cache clean --force && \
    echo "Disk space after cleanup: $(df -h /)" && \
    echo "✅ Cleanup complete"
```

**Impact**: Saves several hundred MB during build process

## Build Process Flow

### Before Optimization
1. Copy all files (including 8MB+ of docs)
2. Install dependencies
3. Build application
4. No cleanup → disk space consumed

### After Optimization
1. Copy only necessary files (docs excluded)
2. Install dependencies
3. Build application
4. **Clean up build artifacts**
5. Copy only production files to runtime stage

## Disk Space Savings

| Item | Size | Action |
|------|------|--------|
| docs/ directory | 5.7MB | Excluded from Docker context |
| tsconfig.tsbuildinfo | 2.0MB | Excluded and removed from git |
| memory2.md | 89KB | Excluded from Docker context |
| .next/cache | ~100-500MB | Cleaned after build |
| node_modules/.cache | ~50-200MB | Cleaned after build |
| /root/.npm | ~50-100MB | Cleaned after build |

**Total Savings**: ~200-800MB per build

## Files Modified

1. `.dockerignore` - Added comprehensive exclusions
2. `.gitignore` - Added build artifact entries
3. `Dockerfile` - Added cleanup steps
4. `Dockerfile.simple` - Added cleanup steps (used by CapRover)

## Verification Steps

To verify the build works correctly:

1. **Check Docker context size**:
   ```bash
   docker build --no-cache -f Dockerfile.simple -t village-test .
   ```

2. **Verify excluded files are not in image**:
   ```bash
   docker run --rm village-test ls -la /app/docs
   # Should show: ls: /app/docs: No such file or directory
   ```

3. **Check disk space during build**:
   The build logs will show disk space after cleanup:
   ```
   Disk space after cleanup: (df -h /)
   ```

## CapRover Deployment

CapRover uses `Dockerfile.simple` as specified in `captain-definition`:
```json
{
  "schemaVersion": 2,
  "dockerfilePath": "./Dockerfile.simple"
}
```

All optimizations have been applied to this file.

## Future Recommendations

1. **Monitor build disk usage**: Check CapRover logs for disk space warnings
2. **Regular cleanup**: Consider periodic Docker system prune on the build server
3. **Build cache**: Enable Docker build cache in CapRover for faster rebuilds
4. **Memory limits**: Current limit is 1GB, increase if needed on larger VPS

## Troubleshooting

### If build still fails with space issues:

1. **Check Docker build server disk space**:
   - CapRover settings → Check available disk space
   - May need to clean up old images/containers

2. **Increase build timeout**:
   - CapRover app settings → Increase build timeout
   - Current optimizations should make builds faster

3. **Verify .dockerignore is working**:
   ```bash
   docker build --no-cache --progress=plain -f Dockerfile.simple . 2>&1 | grep "COPY . ."
   ```
   Should not show excluded files being copied

4. **Check for large files in repo**:
   ```bash
   find . -type f -size +1M -not -path "./node_modules/*" -not -path "./.git/*"
   ```

## References

- Issue: "no space left on device" when writing `/src/app/api/admin/products/route.ts`
- Fixed: October 18, 2025
- CapRover Documentation: https://caprover.com/docs/
