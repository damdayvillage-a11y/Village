# Quick Deployment Guide - Login Fix

## 🎯 Problem Solved
Login was failing with "Unable to sign in" error even with correct environment variables set. This is now **FIXED**.

## ✅ What Was Fixed

1. **User Creation**: Users now automatically created with `active: true` and `verified: true`
2. **Auto-Healing**: Existing users with incorrect fields are automatically fixed on startup
3. **Better Logging**: Clear error messages showing why login fails (if it does)
4. **Security**: Secrets properly managed (templates in repo, actual values in deployment platform)

## 🚀 How to Deploy

### Step 1: Set Environment Variables in CapRover

Go to your CapRover app → App Configs → Environmental Variables and set:

```bash
# REQUIRED - Must set these!
NODE_ENV=production
NEXTAUTH_URL=https://damdayvillage.com
NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>
DATABASE_URL=postgresql://username:password@srv-captain--postgres:5432/villagedb

# OPTIONAL - For first deployment (auto-creates users and data)
RUN_MIGRATIONS=true
RUN_SEED=true

# OPTIONAL - Customize default passwords (otherwise uses Admin@123 and Host@123)
# ADMIN_DEFAULT_PASSWORD=YourSecurePassword123
# HOST_DEFAULT_PASSWORD=YourSecurePassword123
```

**Important Notes:**
- Generate your own unique `NEXTAUTH_SECRET` with: `openssl rand -base64 32`
- Replace `username:password` with your actual PostgreSQL credentials
- For CapRover internal PostgreSQL, use `srv-captain--postgres` as the host

### Step 2: Deploy

Click "Deploy" in CapRover or push to your connected Git repository.

### Step 3: Wait for Startup

The application will:
1. Run migrations (creates database tables)
2. Auto-create admin and host users (if they don't exist)
3. Auto-fix any existing users with incorrect fields
4. Start the server

Check the logs to see:
```
✅ Admin user created successfully!
   Email: admin@damdayvillage.org
   Role: ADMIN
   Verified: true
   Active: true
```

### Step 4: Login

1. Go to: `https://damdayvillage.com/auth/signin`
2. Login with:
   - **Email**: `admin@damdayvillage.org`
   - **Password**: `Admin@123` (or your custom password if you set `ADMIN_DEFAULT_PASSWORD`)
3. **SUCCESS!** 🎉

**⚠️ IMPORTANT**: Change the default password immediately after first login!

## 🔍 Troubleshooting

### If Login Still Fails

1. **Check logs** for authentication errors:
   - Look for: `Login attempt for...` messages
   - Check: `verified=` and `active=` values

2. **Verify environment variables**:
   ```bash
   # In CapRover logs or app settings, ensure these are set:
   ✓ NEXTAUTH_URL (no placeholders, must be your actual domain)
   ✓ NEXTAUTH_SECRET (at least 32 characters)
   ✓ DATABASE_URL (must connect to PostgreSQL)
   ```

3. **Check user status** in logs:
   ```
   ✅ Admin user exists
      Email: admin@damdayvillage.org
      Role: ADMIN
      Verified: true    ← Must be true
      Active: true      ← Must be true
   ```

4. **Auto-fix triggered?** Look for:
   ```
   ⚠️  Admin user needs update (active or verified field is false)
   🔧 Updating admin user...
   ✅ Admin user updated successfully!
   ```

### Common Issues

**Issue**: "Invalid email or password"
- **Cause**: User doesn't exist or password is wrong
- **Fix**: Check logs for user creation; try default password `Admin@123`

**Issue**: Login succeeds but immediately logs out
- **Cause**: User has `verified: false` or `active: false`
- **Fix**: The auto-fix should handle this; check logs for update messages

**Issue**: "Configuration error"
- **Cause**: Missing or invalid environment variables
- **Fix**: Verify all required env vars are set in CapRover

## 📊 What the Logs Should Show

### Successful Deployment Logs
```
🚀 Starting Damday Village application...
🔄 Running database migrations...
🌱 Seeding database...
✅ Created users: Village Administrator and Raj Singh

🔑 Default Login Credentials:
   Admin Email: admin@damdayvillage.org
   Admin Password: Admin@123
   Host Email: host@damdayvillage.org
   Host Password: Host@123

🔍 Validating startup configuration...
✅ NEXTAUTH_URL: https://damdayvillage.com
✅ NEXTAUTH_SECRET: Set (44 chars)
✅ DATABASE_URL: postgresql://...

Testing database connectivity...
✅ Database connection successful!
✅ Admin user exists
   Email: admin@damdayvillage.org
   Role: ADMIN
   Verified: true
   Active: true
✅ Host user exists
   Email: host@damdayvillage.org
   Role: HOST
   Verified: true
   Active: true

✅ All configuration checks passed!
🚀 Starting application...
✅ Initialization complete, starting Next.js server...
```

### Successful Login Logs
```
Successful login for user: admin@damdayvillage.org (verified=true, active=true)
User admin@damdayvillage.org signed in via credentials
```

## 🎉 Success Criteria

After deployment, you should be able to:
- ✅ Visit the login page without errors
- ✅ Login with `admin@damdayvillage.org` / `Admin@123`
- ✅ Be redirected to the dashboard
- ✅ See your admin panel

## 📝 Post-Deployment Checklist

- [ ] Deployment completed successfully
- [ ] Logs show users created with `verified: true, active: true`
- [ ] Login page loads without errors
- [ ] Can login with admin credentials
- [ ] Redirected to dashboard after login
- [ ] **Changed default password** (CRITICAL!)
- [ ] Can access admin panel features

## 🔐 Security Best Practices

1. **Change default passwords immediately** after first login
2. **Never commit secrets** to Git (use CapRover environment variables)
3. **Use strong passwords** for admin and database accounts
4. **Enable HTTPS** (already configured in next.config.js)
5. **Regularly update** dependencies and passwords

## 📚 Additional Resources

- **Full Documentation**: See `LOGIN_FIX_NOTES.md` for detailed technical explanation
- **CapRover Guide**: See `docs/md-files/CAPGUIDE.md` for complete deployment guide
- **Environment Template**: See `.env.caprover` for all available configuration options

## 💬 Support

If you still have issues after following this guide:
1. Check application logs in CapRover
2. Visit `/admin-panel/status` on your deployed app for diagnostics
3. Review `LOGIN_FIX_NOTES.md` for detailed troubleshooting

---

**Last Updated**: 2025-10-19  
**Status**: ✅ Login issues resolved - fully automated deployment
