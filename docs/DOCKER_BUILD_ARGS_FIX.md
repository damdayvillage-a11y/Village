# Docker Build Arguments Fix

## Problem

When deploying to CapRover, the build process showed warnings:

```
[Warning] One or more build-args [CAPROVER_GIT_COMMIT_SHA DATABASE_URL] were not consumed
```

This warning occurred because CapRover automatically passes certain build arguments (like `DATABASE_URL` and `CAPROVER_GIT_COMMIT_SHA`) to Docker builds, but the Dockerfiles didn't declare these arguments with `ARG` instructions, so they were ignored.

## Solution

Added `ARG` declarations at the beginning of all Dockerfiles to accept and consume the build arguments passed by CapRover:

```dockerfile
# Accept build arguments from CapRover (optional)
ARG DATABASE_URL
ARG CAPROVER_GIT_COMMIT_SHA
```

Then modified the `ENV` declaration to use the ARG value if provided, or fall back to the dummy default:

```dockerfile
# Use ARG value if provided, otherwise use dummy default
ENV DATABASE_URL=${DATABASE_URL:-"postgresql://dummy:dummy@localhost:5432/dummy"}
```

## Benefits

1. **No More Warnings**: Build arguments are properly consumed, eliminating the warning messages
2. **Backward Compatible**: When build args are not provided, the Dockerfile still uses dummy defaults
3. **Flexible**: Allows CapRover or other build systems to pass database URLs if needed
4. **Git Tracking**: The `CAPROVER_GIT_COMMIT_SHA` arg can be used for tracking deployments

## Implementation Details

The fix uses Docker's ARG variable substitution with default values:
- Syntax: `${VARIABLE:-default_value}`
- If `VARIABLE` is set, use its value
- If `VARIABLE` is not set or empty, use `default_value`

## Files Modified

- `Dockerfile.simple` - Production Dockerfile (used by captain-definition)

## Testing

Test with build arguments:
```bash
docker build -f Dockerfile.simple \
  --build-arg DATABASE_URL="postgresql://user:pass@host:5432/db" \
  --build-arg CAPROVER_GIT_COMMIT_SHA="abc123" \
  -t test .
```

Test without build arguments (uses defaults):
```bash
docker build -f Dockerfile.simple -t test .
```

Both builds should complete without warnings about unconsumed build arguments.

## Important Notes

- **Build-time vs Runtime**: The `DATABASE_URL` in the Dockerfile is only used during the build process (for Prisma generation). The actual runtime `DATABASE_URL` should be set as an environment variable in CapRover's App Config.
- **Security**: Never hardcode real credentials in Dockerfiles. The build-time DATABASE_URL is intentionally a dummy value.
- **CAPROVER_GIT_COMMIT_SHA**: This is automatically set by CapRover and can be useful for tracking which git commit was deployed.

## Related Documentation

- `CAPGUIDE.md` - CapRover deployment guide
- `CAPROVER_DATABASE_SETUP.md` - Database configuration guide
- `DOCKER_BUILD_FIX.md` - General Docker build fixes
