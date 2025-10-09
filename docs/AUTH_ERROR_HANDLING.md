# Authentication Error Handling

## Overview

This document describes the authentication error handling improvements made to fix the 500 errors occurring when trying to login to the admin panel.

## Issues Fixed

### 1. Missing Error Page

**Problem:** NextAuth was configured to redirect to `/auth/error` but this page didn't exist, causing the application to crash with a 404/500 error when authentication errors occurred.

**Solution:** Created a comprehensive error page at `/src/app/auth/error/page.tsx` that:
- Displays user-friendly error messages for all NextAuth error types
- Provides clear actions (Try Again, Go to Homepage)
- Includes support contact information
- Handles the error type from URL query parameters

### 2. Unconfigured OAuth Providers

**Problem:** OAuth providers (Google, GitHub) and Email provider were always included in the NextAuth configuration, even when credentials weren't set in environment variables. This caused initialization errors.

**Solution:** Modified `/lib/auth/config.ts` to conditionally include providers only when properly configured:

```typescript
// OAuth Providers - only include if credentials are configured
...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    allowDangerousEmailAccountLinking: true,
  })
] : []),
```

### 3. Unhandled Errors in Callbacks

**Problem:** Errors in NextAuth callbacks (signIn, jwt, session) would crash the authentication flow, resulting in 500 errors.

**Solution:** Added try-catch blocks to all callbacks to handle errors gracefully:

```typescript
async signIn({ user, account, profile }) {
  try {
    // Sign in logic
  } catch (error) {
    console.error('Sign in callback error:', error);
    return true; // Allow sign in to continue
  }
}
```

### 4. Type Safety Issues

**Problem:** TypeScript type errors due to mixing NextAuth's `User` type with custom fields.

**Solution:** Used proper type guards and type assertions:

```typescript
// Check if property exists before accessing
if ('verified' in user && !user.verified) {
  return '/auth/error?error=Verification';
}

// Use default values for optional fields
token.role = 'role' in user ? user.role : UserRole.GUEST;
```

### 5. API Route Error Handling

**Problem:** Errors in the NextAuth API route handler would crash with 500 errors instead of redirecting properly.

**Solution:** Added error wrapper in `/src/app/api/auth/[...nextauth]/route.ts`:

```typescript
async function wrappedHandler(req: NextRequest) {
  try {
    return await handler(req as any);
  } catch (error) {
    console.error('NextAuth handler error:', error);
    // Redirect to error page or return JSON error
  }
}
```

## Error Types Handled

The error page handles all standard NextAuth error types:

- `Configuration` - Server configuration issues
- `AccessDenied` - Permission denied
- `Verification` - Invalid or expired verification link
- `OAuthSignin` - OAuth provider sign in failure
- `OAuthCallback` - OAuth callback processing error
- `OAuthCreateAccount` - OAuth account creation failure
- `EmailCreateAccount` - Email account creation failure
- `Callback` - General callback error
- `OAuthAccountNotLinked` - Email already linked to another account
- `EmailSignin` - Email verification sending failure
- `CredentialsSignin` - Invalid credentials
- `SessionRequired` - Session required to access page
- `Default` - Generic authentication error

## Testing

### Manual Testing

1. **Test Invalid Credentials:**
   ```bash
   # Navigate to /auth/signin
   # Enter invalid email/password
   # Should see error message, not 500 error
   ```

2. **Test Missing OAuth Config:**
   ```bash
   # Ensure GOOGLE_CLIENT_ID is not set in .env
   # Navigate to /auth/signin
   # Google button should not appear
   # No errors in console
   ```

3. **Test Database Connection Error:**
   ```bash
   # Stop database temporarily
   # Try to sign in
   # Should see appropriate error message, not crash
   ```

### Automated Testing

Add tests in `/src/app/__tests__/auth.test.ts`:

```typescript
describe('Auth Error Handling', () => {
  it('should redirect to error page on invalid credentials', async () => {
    // Test implementation
  });
  
  it('should handle missing OAuth providers gracefully', async () => {
    // Test implementation
  });
});
```

## Configuration Requirements

### Required Environment Variables

For **credentials authentication** (always available):
```env
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key
DATABASE_URL=postgresql://...
```

### Optional Environment Variables

For **Google OAuth** (optional):
```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

For **GitHub OAuth** (optional):
```env
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
```

For **Email Provider** (optional):
```env
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@example.com
EMAIL_SERVER_PASSWORD=your-password
EMAIL_FROM=noreply@yourdomain.com
```

## Deployment Notes

1. **Ensure database is accessible** before starting the application
2. **Set all required environment variables** in your deployment platform
3. **Run database migrations** before first deployment
4. **Seed admin user** if needed: `npm run db:seed`
5. **Verify admin user** exists: `npm run admin:verify`

## Troubleshooting

### Still Getting 500 Errors?

1. **Check database connection:**
   ```bash
   npm run db:studio
   ```

2. **Verify environment variables:**
   ```bash
   npm run validate:env
   ```

3. **Check application logs:**
   - Look for "NextAuth handler error:" messages
   - Look for "Database error during authentication:" messages
   - Look for callback error messages

4. **Test with minimal configuration:**
   - Remove all optional OAuth providers
   - Use only credentials authentication
   - Ensure database is running

### Common Issues

#### "Database connection failed"
- Check DATABASE_URL is correct
- Ensure PostgreSQL is running
- Verify network connectivity
- Check firewall rules

#### "Configuration error"
- Check NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Ensure all provider credentials are valid

#### "Cannot find user"
- Run `npm run db:seed` to create admin user
- Run `npm run admin:verify` to check user exists

## Related Documentation

- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - General troubleshooting guide
- [QUICK_FIX_GUIDE.md](./QUICK_FIX_GUIDE.md) - Quick fixes for deployment
- NextAuth.js documentation: https://next-auth.js.org/

## Support

If you continue to experience issues:
1. Check the GitHub issues: https://github.com/damdayvillage-a11y/Village/issues
2. Contact support: support@damdayvillage.com
3. Review application logs for error details
