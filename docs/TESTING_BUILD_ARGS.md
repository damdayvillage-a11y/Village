# Testing Docker Build Arguments Fix

This document provides test procedures to verify the Docker build arguments fix works correctly.

## Quick Test

Run this command to verify build arguments are properly consumed:

```bash
# Test with build arguments (simulates CapRover behavior)
docker build -f Dockerfile.simple \
  --build-arg DATABASE_URL="postgresql://test:test@localhost:5432/test" \
  --build-arg CAPROVER_GIT_COMMIT_SHA="abc123def456" \
  -t village-test:latest \
  --target builder \
  .
```

**Expected Result**: No warnings about unconsumed build arguments

## Test Without Build Arguments

```bash
# Test without build arguments (uses defaults)
docker build -f Dockerfile.simple \
  -t village-test:latest \
  --target builder \
  .
```

**Expected Result**: Uses dummy default values, no errors

## Verify Build Argument Values

Create a test Dockerfile to verify the values are correctly set:

```bash
cat > /tmp/test-dockerfile << 'EOF'
FROM node:20-alpine AS builder
WORKDIR /app

ARG DATABASE_URL
ARG CAPROVER_GIT_COMMIT_SHA

ENV DATABASE_URL=${DATABASE_URL:-"postgresql://dummy:dummy@localhost:5432/dummy"}

RUN echo "=== Build Arguments Test ===" && \
    echo "DATABASE_URL: $DATABASE_URL" && \
    echo "CAPROVER_GIT_COMMIT_SHA: $CAPROVER_GIT_COMMIT_SHA" && \
    echo "==========================="
EOF

# Test with args
docker build -f /tmp/test-dockerfile \
  --build-arg DATABASE_URL="postgresql://test:pass@host:5432/db" \
  --build-arg CAPROVER_GIT_COMMIT_SHA="commit-sha-123" \
  -t test . 2>&1 | grep "==="

# Test without args
docker build -f /tmp/test-dockerfile -t test . 2>&1 | grep "==="
```

## Expected Output

### With Build Arguments:
```
=== Build Arguments Test ===
DATABASE_URL: postgresql://test:pass@host:5432/db
CAPROVER_GIT_COMMIT_SHA: commit-sha-123
===========================
```

### Without Build Arguments:
```
=== Build Arguments Test ===
DATABASE_URL: postgresql://dummy:dummy@localhost:5432/dummy
CAPROVER_GIT_COMMIT_SHA: 
===========================
```

## Common Issues

### Issue: Warning about unconsumed build arguments

**Cause**: ARG declarations are missing from Dockerfile
**Solution**: Ensure ARG declarations are present before the ENV statements

### Issue: Build fails with "variable not set" error

**Cause**: ENV line doesn't have proper fallback syntax
**Solution**: Use `${VARIABLE:-"default"}` syntax for ENV

## Integration with CapRover

When deploying to CapRover, the platform automatically passes these build arguments:
- `DATABASE_URL`: From your app's environment variables
- `CAPROVER_GIT_COMMIT_SHA`: The git commit SHA being deployed

The Dockerfile now properly accepts and consumes these arguments, eliminating build warnings.

## Automated Testing

You can add this to your CI/CD pipeline:

```bash
#!/bin/bash
# Test script: test-build-args.sh

echo "Testing Docker build arguments..."

# Test 1: Build with arguments (should succeed without warnings)
echo "Test 1: Building with arguments..."
if docker build -f Dockerfile.simple \
  --build-arg DATABASE_URL="postgresql://test:test@localhost:5432/test" \
  --build-arg CAPROVER_GIT_COMMIT_SHA="test123" \
  -t test-with-args . 2>&1 | grep -q "Warning.*build-args.*not consumed"; then
  echo "❌ FAILED: Warning about unconsumed build args"
  exit 1
else
  echo "✅ PASSED: No warnings about unconsumed build args"
fi

# Test 2: Build without arguments (should succeed with defaults)
echo "Test 2: Building without arguments..."
if docker build -f Dockerfile.simple -t test-no-args . 2>&1 | grep -q "Error"; then
  echo "❌ FAILED: Build failed without arguments"
  exit 1
else
  echo "✅ PASSED: Build succeeded with default values"
fi

echo "All tests passed!"
```

## References

- [Docker ARG Documentation](https://docs.docker.com/engine/reference/builder/#arg)
- [Docker ENV Documentation](https://docs.docker.com/engine/reference/builder/#env)
- [CapRover Build Arguments](https://caprover.com/docs/app-configuration.html)
