# Dependency Resolution Fix for CapRover Build

## Problem
The CapRover build was failing with the following error:

```
npm error code ERESOLVE
npm error ERESOLVE could not resolve
npm error While resolving: next-auth@4.24.11
npm error Found: nodemailer@7.0.9
npm error Could not resolve dependency:
npm error peerOptional nodemailer@"^6.6.5" from next-auth@4.24.11
```

## Root Cause
- The project used `nodemailer@^7.0.9`
- `next-auth@4.24.11` requires `nodemailer@^6.6.5` as a peer dependency
- NodeMailer v7 introduced breaking changes that next-auth v4 doesn't support yet

## Solution Applied
Downgraded nodemailer to the latest compatible v6 version:

### Changes Made
1. **package.json dependencies:**
   - `nodemailer`: `^7.0.9` → `^6.10.1` (latest v6)
   - `@types/nodemailer`: `^7.0.2` → `^6.4.20` (matching types)

2. **Additional fixes:**
   - Enabled `output: 'standalone'` in `next.config.js` for Docker
   - Added SSL certificate bypass for Prisma in Dockerfile

### Verification
```bash
npm install  # Should complete without ERESOLVE errors
npm run build  # Should build successfully
```

## Why This Solution
1. **Minimal Impact**: nodemailer v6.10.1 has all features used in the codebase
2. **Stability**: Uses well-tested, stable versions
3. **Compatibility**: Ensures next-auth works without issues
4. **Future-Ready**: When next-auth v5 releases with nodemailer v7 support, we can upgrade

## Alternative Solutions Considered
1. **Use `--legacy-peer-deps`**: Not recommended for production
2. **Use `--force`**: Potentially unstable
3. **Upgrade next-auth to v5**: Not stable yet (beta)

## Migration Path for Future
When next-auth v5 becomes stable:
1. Upgrade next-auth to v5
2. Upgrade nodemailer to v7
3. Update types accordingly
4. Test all email functionality

## Code Compatibility
The nodemailer usage in `/lib/notifications/email.ts` is fully compatible with both v6 and v7:
- Standard SMTP configuration
- Basic email sending
- No v7-specific features used