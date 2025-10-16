# Argon2 Module Fix for Docker Production Image

## Problem
The admin panel login was failing with a 500 Internal Server Error. Investigation revealed that the `argon2` native module was not properly available in the Docker production image.

When checking the production container, the argon2 directory only contained:
```
/app/node_modules/argon2/
├── argon2.cjs
└── package.json
```

But was missing the critical native binaries needed for the module to function:
- `prebuilds/` directory (containing `.node` binary files)
- `@phc/format` dependency
- `node-gyp-build` dependency  
- `node-addon-api` dependency

## Root Cause
The Dockerfile production stage was only copying `bcryptjs` for password hashing but not `argon2`. The `lib/auth/password.ts` module tries to use argon2 first and falls back to bcryptjs if argon2 fails:

```typescript
export async function hashPassword(password: string): Promise<string> {
  try {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });
  } catch (error) {
    console.warn('Argon2 hashing failed, falling back to bcryptjs:', error);
    // Fallback to bcryptjs...
  }
}
```

When argon2 was not available, the module would fail to load, causing the 500 error before the fallback could even execute.

## Solution
Updated both `Dockerfile` and `Dockerfile.simple` to copy the argon2 module along with its required dependencies from the builder stage to the production stage:

```dockerfile
# Copy bcryptjs and argon2 for password hashing (used for auth and startup script)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/bcryptjs ./node_modules/bcryptjs
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/argon2 ./node_modules/argon2
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@phc ./node_modules/@phc
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/node-addon-api ./node_modules/node-addon-api
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/node-gyp-build ./node_modules/node-gyp-build
```

## Why This Works
1. **argon2** is a native Node.js module that uses prebuilt binaries for different platforms
2. The `prebuilds/linux-x64/argon2.musl.node` binary is needed for Alpine Linux (used in the Docker image)
3. **node-gyp-build** is the loader that finds and loads the correct prebuilt binary
4. **@phc/format** handles the password hash format parsing
5. **node-addon-api** provides the C++ addon API for the native module

## Files Changed
1. `Dockerfile` - Added argon2 and dependencies to production stage
2. `Dockerfile.simple` - Added argon2 and dependencies to production stage
3. `lib/auth/__tests__/password.test.ts` - Added tests to verify password hashing works

## Testing
Created comprehensive tests in `lib/auth/__tests__/password.test.ts` that verify:
- ✅ Argon2 password hashing works
- ✅ Argon2 password verification works
- ✅ Bcrypt fallback works
- ✅ Both hash formats can be verified

All tests pass locally:
```
 PASS  lib/auth/__tests__/password.test.ts
  Password Hashing
    ✓ should hash a password using argon2
    ✓ should verify a correct password
    ✓ should reject an incorrect password
    ✓ should handle bcrypt hashes
    ✓ should handle argon2 verification

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
```

## Deployment Impact
After this fix:
- ✅ Admin login will work correctly
- ✅ Password hashing uses the more secure argon2id algorithm
- ✅ Bcryptjs remains available as a fallback
- ✅ No breaking changes to existing passwords (both formats supported)

## Verification Steps for CapRover Deployment
After deploying this fix to CapRover:

1. Check that argon2 module is present:
```bash
docker exec -it $(docker ps --filter name=my-village-app -q) ls -la /app/node_modules/argon2/
```

Should show:
```
argon2/
├── prebuilds/     ← Native binaries directory
├── argon2.cjs     ← Main module
├── package.json
└── ... (other files)
```

2. Test password hashing:
```bash
docker exec -it $(docker ps --filter name=my-village-app -q) node -e "
const argon2 = require('argon2');
argon2.hash('test').then(h => console.log('Hash:', h.substring(0, 50) + '...'));
"
```

Should output an argon2 hash starting with `$argon2id$v=19$m=...`

3. Test admin login:
```bash
curl -v \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "email=admin@damdayvillage.org" \
  --data-urlencode "password=YOUR_PASSWORD" \
  https://damdayvillage.com/api/auth/callback/credentials
```

Should return a redirect (302) instead of 500 error.

## Background
- Argon2 is the recommended password hashing algorithm (winner of the Password Hashing Competition)
- It's more secure than bcrypt for modern applications
- Native modules require special handling in Docker multi-stage builds
- Next.js standalone mode doesn't always trace native modules correctly

## Related Issues
- Original issue: 500 error when logging into admin panel
- Docker container missing argon2 prebuilt binaries
- Password hashing failing in production but working in development
