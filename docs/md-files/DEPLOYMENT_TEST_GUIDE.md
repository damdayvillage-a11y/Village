# Deployment Testing Guide - Auto-Initialization Feature

This guide helps you test the new automatic admin/host user creation feature after deployment.

## Prerequisites

- Application deployed to CapRover or similar platform
- Database configured and accessible
- Environment variables properly set (DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET)

## Test Scenarios

### Scenario 1: Fresh Deployment (No Existing Users)

This is the primary use case - deploying to a fresh database.

**Steps:**
1. Deploy the application to your platform
2. Wait for deployment to complete (~2-3 minutes)
3. Check container logs

**Expected Logs:**
```
🔍 Running startup configuration check...
Environment: production
✅ NEXTAUTH_URL: https://your-domain.com
✅ NEXTAUTH_SECRET: Set (44 chars)
✅ DATABASE_URL: postgresql://****@srv-captain--postgres:5432/villagedb

Testing database connectivity and admin setup...
✅ Database connection successful!
⚠️  Admin user not found in database
🔧 Auto-creating admin user...
✅ Admin user created successfully!
   Email: admin@damdayvillage.org
   Role: ADMIN
   Password: Admin@123
   ⚠️  IMPORTANT: Change this password immediately after first login!
⚠️  Host user not found in database
🔧 Auto-creating host user...
✅ Host user created successfully!
   Email: host@damdayvillage.org
   Role: HOST
   Password: Host@123
   ⚠️  IMPORTANT: Change this password immediately after first login!

✅ Starting application...
🚀 Starting Next.js server...
```

**Verification:**
1. Visit: `https://your-domain.com/api/auth/status`
   - Should show: `"admin_exists": true`
   - Should show: `"database": {"connected": true}`

2. Visit: `https://your-domain.com/admin-panel/login`
   - Login with: `admin@damdayvillage.org` / `Admin@123`
   - Should successfully login

3. Visit: `https://your-domain.com/host/login`
   - Login with: `host@damdayvillage.org` / `Host@123`
   - Should successfully login

**Success Criteria:**
- ✅ No 500 errors on login attempts
- ✅ Admin user exists and can login
- ✅ Host user exists and can login
- ✅ No SSH commands were needed
- ✅ Clear logs showing user creation

---

### Scenario 2: Existing Deployment (Users Already Exist)

This tests that the feature doesn't break existing deployments.

**Steps:**
1. Deploy update to existing application with users already in database
2. Wait for deployment to complete
3. Check container logs

**Expected Logs:**
```
🔍 Running startup configuration check...
Environment: production
✅ NEXTAUTH_URL: https://your-domain.com
✅ NEXTAUTH_SECRET: Set (44 chars)
✅ DATABASE_URL: postgresql://****@srv-captain--postgres:5432/villagedb

Testing database connectivity and admin setup...
✅ Database connection successful!
✅ Admin user exists
   Email: admin@damdayvillage.org
   Role: ADMIN
✅ Host user exists
   Email: host@damdayvillage.org
   Role: HOST

✅ Starting application...
```

**Verification:**
1. Login with existing credentials
2. Verify no duplicate users were created
3. Verify no errors in logs

**Success Criteria:**
- ✅ No attempt to create duplicate users
- ✅ Existing users can still login
- ✅ No errors or warnings
- ✅ Backward compatible

---

### Scenario 3: Database Connection Issues

This tests graceful failure when database is not accessible.

**Steps:**
1. Deploy with invalid DATABASE_URL or inaccessible database
2. Check container logs

**Expected Logs:**
```
🔍 Running startup configuration check...
Environment: production
✅ NEXTAUTH_URL: https://your-domain.com
✅ NEXTAUTH_SECRET: Set (44 chars)
✅ DATABASE_URL: postgresql://****@srv-captain--postgres:5432/villagedb

Testing database connectivity and admin setup...
⚠️  Database connection test failed: Connection timeout
   App will start but database operations may fail.
   Please verify DATABASE_URL and ensure PostgreSQL is running.

⚠️  WARNINGS:
   • Database connection test failed

✅ Starting application...
```

**Verification:**
1. Application should still start (not crash)
2. Clear error message about database connection
3. Admin user not created (but no crash)

**Success Criteria:**
- ✅ Application starts despite database issues
- ✅ Clear error messages
- ✅ No crash or exit
- ✅ User can fix database and restart

---

### Scenario 4: Custom Password via Environment Variable

This tests the ability to set custom default passwords.

**Steps:**
1. Set environment variables before deployment:
   ```bash
   ADMIN_DEFAULT_PASSWORD=MySecureAdminPass123!
   HOST_DEFAULT_PASSWORD=MySecureHostPass123!
   ```
2. Deploy to fresh database
3. Check logs for custom passwords

**Expected Logs:**
```
✅ Admin user created successfully!
   Email: admin@damdayvillage.org
   Role: ADMIN
   Password: MySecureAdminPass123!
   ⚠️  IMPORTANT: Change this password immediately after first login!
```

**Verification:**
1. Login should work with custom password
2. Default password should NOT work
3. Password visible in logs

**Success Criteria:**
- ✅ Custom password used instead of default
- ✅ Custom password logged for user reference
- ✅ Login works with custom password

---

### Scenario 5: Container Restart

This tests idempotency - that restarting doesn't cause issues.

**Steps:**
1. Deploy and wait for user creation
2. Restart container multiple times
3. Check logs each time

**Expected Behavior:**
- First startup: Users are created
- Subsequent restarts: "✅ Admin user exists" message
- No errors or attempts to recreate

**Success Criteria:**
- ✅ Users not recreated on restart
- ✅ No errors about duplicate users
- ✅ Fast startup (no creation delay)

---

## Troubleshooting

### Issue: Admin user not created

**Symptoms:**
- Logs show database connection successful
- But no "Auto-creating admin user..." message

**Possible Causes:**
1. bcryptjs module missing from container
2. Database schema not migrated
3. Permissions issue

**Debug Steps:**
```bash
# Check if bcryptjs exists in container
docker exec -it <container> ls -la node_modules/bcryptjs

# Check Prisma schema is up to date
docker exec -it <container> npx prisma migrate status

# Check container logs for errors
docker logs <container> --tail 100
```

---

### Issue: "Failed to auto-create admin user"

**Symptoms:**
- Logs show attempt to create user
- But shows error message

**Possible Causes:**
1. Database schema not migrated (User table doesn't exist)
2. Permission issues with database user
3. Unique constraint violation (user already exists)

**Debug Steps:**
```bash
# Check database tables exist
docker exec -it <postgres-container> psql -U postgres -d villagedb -c "\dt"

# Check if admin user already exists
docker exec -it <postgres-container> psql -U postgres -d villagedb -c "SELECT email, role FROM \"User\" WHERE email='admin@damdayvillage.org';"

# Run migrations manually if needed
docker exec -it <container> npx prisma migrate deploy
```

---

### Issue: "bcryptjs not found" error

**Symptoms:**
- Error in logs: "Cannot find module 'bcryptjs'"

**Fix:**
The Dockerfile should include bcryptjs. Verify:
```dockerfile
# This line should be in Dockerfile
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/bcryptjs ./node_modules/bcryptjs
```

If missing, rebuild the Docker image.

---

## Monitoring After Deployment

### Health Check Endpoints

1. **Authentication Status:**
   ```bash
   curl https://your-domain.com/api/auth/status | jq
   ```
   Look for: `"admin_exists": true`

2. **Admin Verification:**
   ```bash
   curl https://your-domain.com/api/admin/verify-setup | jq
   ```
   Look for: `"adminExists": true`

3. **Overall Health:**
   ```bash
   curl https://your-domain.com/api/health | jq
   ```
   Look for: `"status": "healthy"`

### Container Logs

Monitor logs for the first 2-3 minutes after deployment:
```bash
# CapRover
docker logs -f $(docker ps | grep srv-captain--village | awk '{print $1}')

# Generic Docker
docker logs -f <container-name>
```

Look for:
- ✅ "Admin user created successfully"
- ✅ "Host user created successfully"
- ✅ No red error messages
- ✅ "Starting Next.js server"

---

## Success Checklist

After deployment, verify:

- [ ] Container started successfully
- [ ] Database connection established
- [ ] Admin user created (or already exists)
- [ ] Host user created (or already exists)
- [ ] Can access: `/api/auth/status`
- [ ] Can access: `/admin-panel/login`
- [ ] Can login with admin credentials
- [ ] Can login with host credentials
- [ ] No 500 errors on login
- [ ] No SSH commands were needed
- [ ] Logs are clean (no errors)

---

## Reporting Issues

If you encounter issues during testing, please provide:

1. **Container Logs** (first 5 minutes after startup)
2. **Environment Setup** (CapRover/Coolify/Docker version)
3. **Database Type** (PostgreSQL version)
4. **Error Messages** (exact text from logs)
5. **Health Check Results** (curl output from `/api/auth/status`)

---

## Next Steps After Successful Deployment

1. ✅ Login with default credentials
2. ✅ **Change admin password immediately**
3. ✅ **Change host password immediately**
4. ✅ Configure additional settings as needed
5. ✅ Test all major features
6. ✅ Set up monitoring/backups

---

**Last Updated:** 2025-10-15
**Feature:** Automatic Admin/Host User Creation
**Version:** 1.0.0
