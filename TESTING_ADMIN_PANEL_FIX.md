# Testing Guide: Admin Panel 500 Error Fix

## Overview

This guide provides comprehensive testing scenarios for the admin panel 500 error fix, including the new diagnostic features.

## Prerequisites

Before testing:
- ✅ Build completed successfully: `npm run build`
- ✅ Environment variables configured (can be dummy for testing)
- ✅ Development server running: `npm run dev`

## Test Scenarios

### Scenario 1: Healthy System (All Services Working)

**Setup:**
```bash
# Set valid environment variables
export NEXTAUTH_URL="http://localhost:3000"
export NEXTAUTH_SECRET="test-secret-key-for-development-at-least-32-chars-long"
export DATABASE_URL="postgresql://user:password@localhost:5432/smart_village_db"

# Ensure database is running and admin user exists
npm run db:seed
```

**Test Steps:**

1. **Visit Status Page:**
   ```
   Navigate to: http://localhost:3000/admin-panel/status
   ```
   
   **Expected Result:**
   - All checks show ✅ (green)
   - Status: "All Systems Operational"
   - "Go to Admin Login" button is enabled (green)
   - No error messages

2. **Click "Go to Admin Login":**
   
   **Expected Result:**
   - Redirected to `/admin-panel/login`
   - Login form displays without errors

3. **Login with Valid Credentials:**
   ```
   Email: admin@damdayvillage.org
   Password: Admin@123
   ```
   
   **Expected Result:**
   - Successfully logs in
   - Redirected to `/admin-panel` dashboard
   - No 500 errors

### Scenario 2: Missing Admin User (Degraded Service)

**Setup:**
```bash
# Delete admin user from database (if exists)
# Or use a fresh database without seeding
npm run db:push  # Create schema but don't seed
```

**Test Steps:**

1. **Visit Status Page:**
   ```
   Navigate to: http://localhost:3000/admin-panel/status
   ```
   
   **Expected Result:**
   - Database checks show ⚠️ (yellow)
   - Status: "Service Degraded"
   - Message: "Admin user not found - run: npm run db:seed"
   - Recommendations show: "Create admin user - run: npm run db:seed"

2. **Use Auto-Init API:**
   ```bash
   curl -X POST http://localhost:3000/api/admin/init
   ```
   
   **Expected Result:**
   ```json
   {
     "success": true,
     "message": "Admin user created successfully",
     "admin": {
       "id": "...",
       "email": "admin@damdayvillage.org",
       "name": "Village Administrator",
       "role": "ADMIN"
     },
     "credentials": {
       "email": "admin@damdayvillage.org",
       "password": "Admin@123",
       "warning": "⚠️ IMPORTANT: Change this password immediately after first login!"
     }
   }
   ```

3. **Refresh Status Page:**
   
   **Expected Result:**
   - All checks now show ✅ (green)
   - Admin user found
   - Can proceed to login

### Scenario 3: Placeholder in NEXTAUTH_URL (Configuration Error)

**Setup:**
```bash
# Set placeholder value
export NEXTAUTH_URL="https://$$cap_appname$$.$$cap_root_domain$$"
export NEXTAUTH_SECRET="test-secret-key-for-development-at-least-32-chars-long"
export DATABASE_URL="postgresql://user:password@localhost:5432/smart_village_db"
```

**Test Steps:**

1. **Visit Status Page:**
   ```
   Navigate to: http://localhost:3000/admin-panel/status
   ```
   
   **Expected Result:**
   - NEXTAUTH_URL check shows ❌ (red)
   - Status: "Configuration Error"
   - Message shows: "INVALID - Contains placeholders"
   - Recommendations show: "Replace $$cap_*$$ placeholders in NEXTAUTH_URL"

2. **Try to Login:**
   ```
   Navigate to: http://localhost:3000/admin-panel/login
   ```
   
   **Expected Result:**
   - May show configuration error
   - If error appears, should include link to "Check System Status"

### Scenario 4: Invalid NEXTAUTH_SECRET (Too Short)

**Setup:**
```bash
export NEXTAUTH_URL="http://localhost:3000"
export NEXTAUTH_SECRET="short"  # Less than 32 characters
export DATABASE_URL="postgresql://user:password@localhost:5432/smart_village_db"
```

**Test Steps:**

1. **Visit Status Page:**
   
   **Expected Result:**
   - NEXTAUTH_SECRET check shows ❌ (red)
   - Status: "Configuration Error"
   - Message: "Length: 5 characters" 
   - Warning: "Too short (minimum 32 characters required)"
   - Recommendation: Generate with `openssl rand -base64 32`

### Scenario 5: Database Connection Failed

**Setup:**
```bash
# Set valid format but wrong credentials
export NEXTAUTH_URL="http://localhost:3000"
export NEXTAUTH_SECRET="test-secret-key-for-development-at-least-32-chars-long"
export DATABASE_URL="postgresql://wrong:wrong@localhost:5432/nonexistent"
```

**Test Steps:**

1. **Visit Status Page:**
   
   **Expected Result:**
   - Database check shows ❌ (red)
   - Status: "Service Degraded" or "Configuration Error"
   - Message shows specific error:
     - "Database connection refused" or
     - "Database authentication failed" or
     - "Database host not found"
   - Recommendation: Fix database connection

2. **Check Auth Status API:**
   ```bash
   curl http://localhost:3000/api/auth/status
   ```
   
   **Expected Result:**
   - HTTP 503 or 500
   - JSON response with error details
   - Helpful error message about database issue

### Scenario 6: Error in Login Page with Link to Status

**Setup:**
```bash
# Configure to cause authentication service unavailability
# Stop database or use invalid DATABASE_URL
```

**Test Steps:**

1. **Try to Login:**
   ```
   Navigate to: http://localhost:3000/admin-panel/login
   Enter: admin@damdayvillage.org / wrongpassword
   ```
   
   **Expected Result:**
   - Error message displayed
   - If service-related error, shows "Check System Status" link
   - Link is clickable and styled as underlined purple text

2. **Click "Check System Status" Link:**
   
   **Expected Result:**
   - Redirected to `/admin-panel/status`
   - Shows diagnostic information

### Scenario 7: Calling Init API Multiple Times (Idempotency)

**Setup:**
```bash
# Admin user already exists
npm run db:seed
```

**Test Steps:**

1. **Call Init API:**
   ```bash
   curl -X POST http://localhost:3000/api/admin/init
   ```
   
   **Expected Result:**
   ```json
   {
     "success": true,
     "message": "Admin user already exists",
     "admin": {
       "email": "admin@damdayvillage.org",
       "role": "ADMIN"
     }
   }
   ```

2. **Call Again:**
   
   **Expected Result:**
   - Same response
   - No duplicate users created
   - No errors

## API Endpoint Tests

### Test `/api/health`

```bash
curl http://localhost:3000/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-10T09:00:00.000Z",
  "version": "1.0.0",
  "environment": "development",
  "uptime": 123.45,
  "services": {
    "database": {
      "status": "healthy",
      "responseTime": "5ms"
    },
    "api": {
      "status": "healthy",
      "message": "API is responding"
    }
  }
}
```

### Test `/api/auth/status`

```bash
curl http://localhost:3000/api/auth/status
```

**Expected Response (when healthy):**
```json
{
  "status": "healthy",
  "healthy": true,
  "checks": {
    "timestamp": "2025-10-10T09:00:00.000Z",
    "environment": "development",
    "nextauth_url": {
      "configured": true,
      "value": "OK"
    },
    "nextauth_secret": {
      "configured": true,
      "length": 52,
      "valid": true
    },
    "database": {
      "configured": true,
      "connected": true,
      "admin_exists": true,
      "message": "Admin user found (role: ADMIN, active: true, verified: true)"
    }
  },
  "recommendations": ["All checks passed!"],
  "help": null
}
```

### Test `/api/admin/init`

**When Admin Doesn't Exist:**
```bash
curl -X POST http://localhost:3000/api/admin/init
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Admin user created successfully",
  "admin": {
    "id": "clx...",
    "email": "admin@damdayvillage.org",
    "name": "Village Administrator",
    "role": "ADMIN"
  },
  "credentials": {
    "email": "admin@damdayvillage.org",
    "password": "Admin@123",
    "warning": "⚠️ IMPORTANT: Change this password immediately after first login!"
  }
}
```

## UI Component Tests

### Status Page UI Elements

**Check for presence of:**
- [ ] Header with Shield icon
- [ ] "Admin Panel System Status" title
- [ ] Refresh button (with RefreshCw icon)
- [ ] Overall status indicator (green/yellow/red)
- [ ] Environment information display
- [ ] Configuration checks section with:
  - [ ] NEXTAUTH_URL status
  - [ ] NEXTAUTH_SECRET status
  - [ ] Database status
- [ ] Recommendations section (when issues exist)
- [ ] Action buttons section:
  - [ ] "Go to Admin Login" (enabled when healthy)
  - [ ] "Home" link
- [ ] Quick Command Reference section

### Login Page Enhancements

**Check for:**
- [ ] Error message display area
- [ ] "Check System Status" link appears on relevant errors
- [ ] Link is styled correctly (purple, underlined)
- [ ] Link navigates to `/admin-panel/status`

## Performance Tests

### Page Load Times

Measure and record:
- [ ] `/admin-panel/status` load time: Should be < 2s
- [ ] `/api/auth/status` response time: Should be < 500ms
- [ ] `/api/health` response time: Should be < 200ms
- [ ] `/api/admin/init` response time: Should be < 1s

### Database Connection Timeout

Test with slow/unreachable database:
- [ ] Timeouts are enforced (3s for queries)
- [ ] Error messages appear quickly
- [ ] No hanging requests

## Integration Tests

### Full Login Flow (Happy Path)

1. Start with clean slate
2. Visit `/admin-panel/status` → All green
3. Click "Go to Admin Login"
4. Enter credentials
5. Successfully login
6. Access admin panel dashboard

**All steps should complete without errors**

### Error Recovery Flow

1. Start with missing admin user
2. Visit `/admin-panel/status` → Yellow warning
3. Use auto-init API
4. Refresh status page → Now green
5. Login → Success

**Demonstrates auto-recovery capability**

## Production-Specific Tests

### CapRover Deployment

After deploying to CapRover:

1. **Check status page works:**
   ```
   https://your-domain.com/admin-panel/status
   ```

2. **Verify all environment variables:**
   - [ ] No `$$cap_*$$` placeholders detected
   - [ ] All checks pass

3. **Test auto-init in production:**
   ```bash
   curl -X POST https://your-domain.com/api/admin/init
   ```

4. **Login and verify:**
   - [ ] Can access admin panel
   - [ ] No 500 errors
   - [ ] All features work

### Security Tests

1. **Verify init API response:**
   - [ ] Doesn't expose sensitive internal errors
   - [ ] Returns helpful but not overly detailed errors

2. **Check status page information disclosure:**
   - [ ] Masks database passwords in URLs
   - [ ] Doesn't expose full system paths
   - [ ] Shows enough info to debug but not compromise security

## Test Checklist Summary

- [ ] All healthy system tests pass
- [ ] All error scenario tests show appropriate messages
- [ ] Status page displays correctly in all states
- [ ] Auto-init API works correctly
- [ ] Login page shows status link on errors
- [ ] All API endpoints return expected responses
- [ ] UI components render correctly
- [ ] Performance is acceptable
- [ ] Integration flows work end-to-end
- [ ] Production deployment works
- [ ] Security concerns addressed

## Automated Testing (Optional)

If setting up automated tests:

```bash
# Install test dependencies (already in package.json)
npm install

# Run existing tests
npm test

# Add new tests to:
# - src/app/__tests__/admin-status.test.tsx
# - src/app/api/__tests__/admin-init.test.ts
```

## Reporting Issues

When reporting issues found during testing:

1. **Include:**
   - Test scenario being run
   - Expected result
   - Actual result
   - Screenshots (for UI issues)
   - Error messages from console/logs
   - Environment details (OS, Node version, etc.)

2. **Check first:**
   - Browser console for errors
   - Network tab for failed requests
   - Server logs for backend errors

## Success Criteria

The fix is considered successful when:

- ✅ Status page loads and shows accurate information
- ✅ Configuration errors are clearly identified
- ✅ Auto-init API can create admin user
- ✅ Login page provides helpful error messages
- ✅ Users can self-diagnose and fix issues
- ✅ No 500 errors for common misconfiguration scenarios
- ✅ Documentation is clear and complete
