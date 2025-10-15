# Admin Login Test Guide

This guide helps you verify the admin login 500 error fix is working correctly.

## Prerequisites

1. Database must be running and configured
2. Admin user must exist (run `npm run db:seed` if needed)
3. Application must be running (run `npm run dev` or deployed)

## Test Scenarios

### ✅ Scenario 1: Invalid Credentials (Non-existent User)

**Test**: Try to login with fake credentials

**Steps**:
1. Navigate to `/admin-panel/login`
2. Enter:
   - Email: `fake@example.com`
   - Password: `anypassword123`
3. Click "Sign in as Admin"

**Expected Result**:
- ✅ HTTP Status: 200 (not 500!)
- ✅ User sees: "Invalid admin credentials. Please check your email and password."
- ✅ Console shows: `Login attempt for non-existent or passwordless user: fake@example.com`
- ✅ User stays on login page

**Failed Result (OLD BEHAVIOR)**:
- ❌ HTTP Status: 500 Internal Server Error
- ❌ User sees: Generic error or blank page

---

### ✅ Scenario 2: Valid Admin Credentials

**Test**: Login with correct admin credentials

**Steps**:
1. Ensure admin exists: `npm run db:seed`
2. Navigate to `/admin-panel/login`
3. Enter default credentials:
   - Email: `admin@damdayvillage.org`
   - Password: `Admin@123`
4. Click "Sign in as Admin"

**Expected Result**:
- ✅ HTTP Status: 200 OK with session
- ✅ User is redirected to `/admin-panel`
- ✅ Console shows: `Successful login for user: admin@damdayvillage.org`
- ✅ Session is established

---

### ✅ Scenario 3: Correct Email, Wrong Password

**Test**: Try login with valid email but wrong password

**Steps**:
1. Navigate to `/admin-panel/login`
2. Enter:
   - Email: `admin@damdayvillage.org`
   - Password: `WrongPassword123`
3. Click "Sign in as Admin"

**Expected Result**:
- ✅ HTTP Status: 200 (not 500!)
- ✅ User sees: "Invalid admin credentials"
- ✅ Console shows: `Invalid password for user: admin@damdayvillage.org`
- ✅ User stays on login page

---

### ✅ Scenario 4: Database Connection Issue

**Test**: Simulate database connection failure

**Steps**:
1. Stop the database server temporarily, OR
2. Set invalid DATABASE_URL in environment
3. Try to login with any credentials

**Expected Result**:
- ✅ HTTP Status: 503 Service Unavailable (not 500!)
- ✅ User sees: "Service temporarily unavailable. Please try again in a moment."
- ✅ Console shows: Database connection error details
- ✅ Link to system diagnostics available

---

## Quick Verification Commands

### Check System Status
```bash
curl http://localhost:3000/api/auth/status | jq
```

Expected output should include:
```json
{
  "status": "healthy",
  "healthy": true,
  "checks": {
    "database": {
      "connected": true,
      "admin_exists": true
    }
  }
}
```

### Test Login API Directly (Invalid Credentials)
```bash
# This should NOT return 500 error
curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{"csrfToken": "test", "email": "fake@example.com", "password": "fake"}' \
  -v
```

Expected: HTTP 200 or 401/403, but NOT 500

### Check Admin User Exists
```bash
npm run admin:verify
```

Or via API:
```bash
curl http://localhost:3000/api/admin/verify-setup | jq
```

---

## Monitoring Logs

When testing, watch the application logs for these messages:

### Failed Login Attempts
```
Login attempt with missing credentials
Login attempt for non-existent or passwordless user: fake@example.com
Invalid password for user: admin@damdayvillage.org
Login attempt for unverified user: user@example.com
Login attempt for deactivated user: user@example.com
```

### Successful Login
```
Successful login for user: admin@damdayvillage.org
```

### Database Errors
```
Database error during authentication: [error details]
Auth attempt 1 failed with transient error, retrying...
```

---

## Troubleshooting

### Still Getting 500 Errors?

1. **Check you're using the latest code**:
   ```bash
   git log --oneline -1
   # Should show: "Fix 500 error on admin login by returning null instead of throwing errors"
   ```

2. **Restart the application**:
   ```bash
   # For development
   npm run dev
   
   # For production
   npm run build && npm start
   ```

3. **Clear browser cache and cookies**:
   - Open DevTools (F12)
   - Application tab → Clear storage
   - Reload page

4. **Check environment variables**:
   ```bash
   npm run validate:env
   ```

5. **View detailed diagnostics**:
   - Navigate to `/api/auth/status`
   - Check for any warnings or recommendations

### Admin User Doesn't Exist?

```bash
# Create the default admin user
npm run db:seed

# Verify it was created
npm run admin:verify
```

### Database Connection Issues?

```bash
# Test database connection
npm run db:test

# Check DATABASE_URL is set correctly
echo $DATABASE_URL
```

---

## Success Criteria

✅ **Fix is successful if:**
1. Invalid credentials return user-friendly error (not 500)
2. Valid credentials allow successful login
3. Console logs provide debugging information
4. All test scenarios pass as documented above
5. Users can distinguish between authentication failure and system error

---

## Related Documentation

- [ADMIN_LOGIN_500_FIX.md](./ADMIN_LOGIN_500_FIX.md) - Technical details of the fix
- [PRODUCTION_LOGIN_TROUBLESHOOTING.md](./PRODUCTION_LOGIN_TROUBLESHOOTING.md) - General troubleshooting
- [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) - Overall system troubleshooting

---

## Report Issues

If you still encounter 500 errors after this fix:
1. Check application logs for error details
2. Run system diagnostics: `/api/auth/status`
3. Verify environment configuration
4. Report with full error logs and reproduction steps
