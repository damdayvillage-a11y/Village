# Admin Login 500 Error Fix

## Problem
When attempting to log in to the admin panel, users received a **500 Internal Server Error** regardless of whether they provided valid or invalid credentials. The health check endpoint (`/api/auth/status`) showed all systems as healthy, indicating the database, admin user, and configuration were all working correctly.

## Root Cause
The issue was in the **NextAuth credentials provider's `authorize` callback** in `/lib/auth/config.ts`. 

According to NextAuth.js documentation:
- The `authorize` callback should **return `null`** when authentication fails
- The `authorize` callback should **return a user object** when authentication succeeds
- The `authorize` callback should only **throw errors** for exceptional system failures (not for invalid credentials)

The previous implementation was throwing errors for invalid credentials, which caused NextAuth to return a 500 error instead of properly handling the failed login attempt.

### Code Changes

#### Before (Incorrect)
```typescript
if (!user || !user.password) {
  throw new Error('Invalid credentials');  // ❌ Causes 500 error
}

if (!isValidPassword) {
  throw new Error('Invalid credentials');  // ❌ Causes 500 error
}

if (!user.verified) {
  throw new Error('Please verify your email before logging in');  // ❌ Causes 500 error
}

if (!user.active) {
  throw new Error('Account has been deactivated');  // ❌ Causes 500 error
}
```

#### After (Correct)
```typescript
if (!user || !user.password) {
  console.warn(`Login attempt for non-existent or passwordless user: ${credentials.email}`);
  return null;  // ✅ Properly indicates failed authentication
}

if (!isValidPassword) {
  console.warn(`Invalid password for user: ${credentials.email}`);
  return null;  // ✅ Properly indicates failed authentication
}

if (!user.verified) {
  console.warn(`Login attempt for unverified user: ${credentials.email}`);
  return null;  // ✅ Properly indicates failed authentication
}

if (!user.active) {
  console.warn(`Login attempt for deactivated user: ${credentials.email}`);
  return null;  // ✅ Properly indicates failed authentication
}
```

## What Was Fixed

1. **Changed error handling in authorize callback** (`lib/auth/config.ts`)
   - Changed from throwing errors to returning `null` for invalid credentials
   - Added proper logging with `console.warn` for failed login attempts
   - Kept error throwing only for genuine system failures (database connection issues)

2. **Improved error handling in NextAuth route** (`src/app/api/auth/[...nextauth]/route.ts`)
   - Better error categorization (configuration vs database vs general errors)
   - Appropriate HTTP status codes (500 for config, 503 for database issues)
   - More helpful error messages with links to diagnostics

## Expected Behavior After Fix

### Invalid Credentials (fake username/password)
- **Status**: Login fails gracefully
- **HTTP Response**: 200 OK (authentication failed, not a server error)
- **User Experience**: Shows "Invalid admin credentials" message
- **Console Log**: `Login attempt for non-existent or passwordless user: fake@example.com`

### Valid Credentials But Unverified Account
- **Status**: Login fails gracefully
- **HTTP Response**: 200 OK
- **User Experience**: Shows "Invalid admin credentials" message (for security)
- **Console Log**: `Login attempt for unverified user: user@example.com`

### Valid Credentials But Deactivated Account
- **Status**: Login fails gracefully
- **HTTP Response**: 200 OK
- **User Experience**: Shows "Invalid admin credentials" message (for security)
- **Console Log**: `Login attempt for deactivated user: user@example.com`

### Valid Credentials (correct admin username/password)
- **Status**: Login succeeds
- **HTTP Response**: 200 OK with session token
- **User Experience**: Redirects to admin panel
- **Console Log**: `Successful login for user: admin@damdayvillage.org`

### Database Connection Issues
- **Status**: System error
- **HTTP Response**: 503 Service Unavailable
- **User Experience**: Shows "Service temporarily unavailable" message
- **Console Log**: Detailed error about database connection

## Testing the Fix

### 1. Test with Invalid Credentials
```bash
curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{"email": "fake@example.com", "password": "wrongpass"}'
```
**Expected**: Should not return 500 error. Should return authentication failure.

### 2. Test with Valid Admin Credentials
```bash
# First, ensure admin user exists
npm run db:seed

# Then try logging in via the UI
# Navigate to: http://localhost:3000/admin-panel/login
# Email: admin@damdayvillage.org
# Password: Admin@123
```
**Expected**: Should successfully log in and redirect to admin panel.

### 3. Check System Status
```bash
curl http://localhost:3000/api/auth/status
```
**Expected**: Should show all systems healthy.

## Files Modified

1. `lib/auth/config.ts` - Fixed authorize callback
2. `src/app/api/auth/[...nextauth]/route.ts` - Improved error handling

## Additional Notes

- The fix maintains security by not exposing whether a user exists or not in the error messages shown to the user
- Console logs still provide detailed information for debugging
- Database connection errors still throw exceptions (as they should) to indicate system issues
- The fix aligns with NextAuth.js best practices and documentation
