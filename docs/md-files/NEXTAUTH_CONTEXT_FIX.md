# NextAuth Context Parameter Fix

## Problem

When attempting to login to the Admin panel, users encountered the following error:

```json
{
  "error": "AuthenticationError",
  "message": "Cannot destructure property 'nextauth' of 'e.query' as it is undefined.",
  "help": "See /admin-panel/status for system diagnostics",
  "recommendations": [
    "Check database connection",
    "Verify DATABASE_URL is correct",
    "Ensure PostgreSQL is running"
  ]
}
```

## Root Cause

The error occurs because NextAuth v4's handler expects different parameters depending on whether it's used in Next.js Pages Router or App Router:

### Pages Router
```typescript
NextAuth(authOptions) // Returns handler(req, res)
```

### App Router (Next.js 13+)
```typescript
NextAuth(authOptions) // Returns handler(req, context)
```

In the App Router, the second parameter should be a `context` object with a `params` property, not just `res`. The NextAuth handler internally checks for `context.params` to determine if it should use `NextAuthRouteHandler` (for App Router) or `NextAuthApiHandler` (for Pages Router).

The error message "Cannot destructure property 'nextauth' of 'e.query'" occurs because:
1. In Pages Router, the handler tries to extract `nextauth` from `req.query`
2. In App Router, `req.query` doesn't exist (Next.js 13+ uses `req.nextUrl.searchParams` instead)
3. The handler was being called with only `req`, causing it to use the Pages Router path
4. This resulted in trying to destructure from `undefined`

## Solution

Changed the `wrappedHandler` function signature to accept both `req` and `context`:

### Before
```typescript
async function wrappedHandler(req: NextRequest) {
  // ...
  return await handler(req as any);
}
```

### After
```typescript
async function wrappedHandler(
  req: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  // ...
  return await handler(req, context);
}
```

## How It Works

1. In Next.js App Router, catch-all routes like `[...nextauth]` receive the route parameters as `context.params`
2. The `context.params` is a Promise that resolves to an object containing the dynamic segments
3. NextAuth checks if the second parameter has a `params` property to determine which handler to use
4. With the context parameter present, it correctly uses `NextAuthRouteHandler` which:
   - Extracts `nextauth` from `await context.params` 
   - Extracts query parameters from `req.nextUrl.searchParams`
   - Properly handles the App Router request structure

## Testing

- ✅ All existing tests pass (5 test suites, 25 tests)
- ✅ Build completes successfully
- ✅ TypeScript compilation succeeds
- ✅ Maintains backward compatibility with existing error handling

## Files Changed

- `src/app/api/auth/[...nextauth]/route.ts` - Updated handler signature

## References

- [NextAuth.js Documentation](https://next-auth.js.org/configuration/initialization#route-handlers-app)
- [Next.js 13+ Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Next.js App Router Migration](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
