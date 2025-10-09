# Production Setup Guide for Admin Panel

## Overview

This guide provides step-by-step instructions for configuring the Damday Village platform for production deployment. **All settings must use actual production values - no dummy or placeholder configurations.**

## Prerequisites

Before deploying to production, ensure you have:

1. ✅ A PostgreSQL database server running and accessible
2. ✅ Domain name configured (e.g., damdayvillage.com)
3. ✅ SSL certificate for HTTPS
4. ✅ SMTP server or email service (optional but recommended)
5. ✅ Access to your deployment platform (CapRover, Vercel, etc.)

## Required Environment Variables

### 1. Database Configuration

**DATABASE_URL** - PostgreSQL connection string

```env
# Format:
DATABASE_URL="postgresql://username:password@host:port/database"

# Example:
DATABASE_URL="postgresql://village_user:SecurePassword123@db.example.com:5432/village_prod"

# ⚠️ DO NOT USE:
DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"  # ❌ WRONG
```

**How to set up:**
1. Create a PostgreSQL database
2. Create a database user with appropriate permissions
3. Note the connection details (host, port, username, password, database name)
4. Construct the connection string following the format above
5. Set it in your deployment platform's environment variables

### 2. Authentication Configuration

**NEXTAUTH_URL** - Your application's public URL

```env
# Must be your actual domain with HTTPS in production
NEXTAUTH_URL="https://damdayvillage.com"

# ⚠️ DO NOT USE:
NEXTAUTH_URL="http://localhost:3000"  # ❌ WRONG (for production)
```

**NEXTAUTH_SECRET** - Secret key for JWT signing

```env
# Must be a secure random string with at least 32 characters
NEXTAUTH_SECRET="your-long-random-secret-key-here-min-32-chars"

# Generate a secure secret:
# Option 1: Using OpenSSL
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# ⚠️ DO NOT USE:
NEXTAUTH_SECRET="your-nextauth-secret-key"  # ❌ WRONG (example value)
NEXTAUTH_SECRET="dummy-secret-for-build"    # ❌ WRONG (build-time value)
```

### 3. Application Configuration

**NODE_ENV** - Environment mode

```env
NODE_ENV="production"

# This is required for production optimizations
```

## Optional But Recommended Environment Variables

### Email Service (for notifications and password resets)

```env
# SMTP Configuration
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="noreply@damdayvillage.com"
EMAIL_SERVER_PASSWORD="your-email-password"
EMAIL_FROM="noreply@damdayvillage.com"

# OR SendGrid
SENDGRID_API_KEY="SG.your-sendgrid-api-key"
EMAIL_FROM="noreply@damdayvillage.com"
```

### OAuth Providers (optional)

```env
# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth (optional)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### Payment Providers (for booking features)

```env
# Stripe (for international payments)
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."

# Razorpay (for Indian payments)
RAZORPAY_KEY_ID="rzp_live_..."
RAZORPAY_KEY_SECRET="..."
```

## Step-by-Step Deployment

### Step 1: Prepare Your Database

1. **Create the database:**
   ```sql
   CREATE DATABASE village_prod;
   CREATE USER village_user WITH ENCRYPTED PASSWORD 'SecurePassword123';
   GRANT ALL PRIVILEGES ON DATABASE village_prod TO village_user;
   ```

2. **Test the connection:**
   ```bash
   psql -h your-db-host -U village_user -d village_prod
   ```

3. **Note the connection details** for your DATABASE_URL

### Step 2: Configure Environment Variables

1. **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and save it securely.

2. **Set environment variables in your deployment platform:**
   - CapRover: Go to App Settings → Environment Variables
   - Vercel: Go to Project Settings → Environment Variables
   - Docker: Create a `.env.production` file (never commit to git)

3. **Verify all required variables are set:**
   ```bash
   npm run validate:env
   ```

### Step 3: Run Database Migrations

Before starting the application, run database migrations:

```bash
npx prisma migrate deploy
```

This creates all necessary tables in your database.

### Step 4: Seed Admin User

Create the default admin user:

```bash
npm run db:seed
```

**Default admin credentials:**
- Email: `admin@damdayvillage.org`
- Password: `Admin@123`

**⚠️ IMPORTANT:** Change the admin password immediately after first login!

### Step 5: Verify Setup

1. **Check database health:**
   ```bash
   curl https://your-domain.com/api/health
   ```
   
   Should return:
   ```json
   {
     "status": "healthy",
     "services": {
       "database": {
         "status": "healthy"
       }
     }
   }
   ```

2. **Verify admin user:**
   ```bash
   npm run admin:verify
   ```

### Step 6: Deploy Application

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```
   Or deploy to your platform (CapRover, Vercel, etc.)

### Step 7: Test Admin Panel

1. Navigate to `https://your-domain.com/admin-panel`
2. You should be redirected to the sign-in page
3. Sign in with admin credentials
4. Change the default password in User Settings

## Troubleshooting

### Issue: 500 Error on Admin Panel Login

**Causes:**
1. Database connection failed
2. NEXTAUTH_SECRET not set or using dummy value
3. NEXTAUTH_URL doesn't match your domain

**Solutions:**

1. **Check database connection:**
   ```bash
   curl https://your-domain.com/api/health
   ```
   If database is unhealthy, verify DATABASE_URL is correct.

2. **Check environment variables:**
   - Ensure NEXTAUTH_SECRET is set to a secure value (not dummy)
   - Ensure NEXTAUTH_URL matches your actual domain
   - Ensure NODE_ENV is set to "production"

3. **Check application logs:**
   Look for error messages like:
   - "Database connection failed"
   - "Authentication service unavailable"
   - "NEXTAUTH_SECRET is required"

4. **Verify admin user exists:**
   ```bash
   npm run admin:verify
   ```
   If admin doesn't exist, run `npm run db:seed`

### Issue: "Invalid Credentials" Error

**Causes:**
1. Admin user not seeded
2. Wrong password
3. Email verification required but not completed

**Solutions:**

1. Run `npm run admin:verify` to check if admin user exists
2. If not, run `npm run db:seed` to create admin user
3. Use default credentials: `admin@damdayvillage.org` / `Admin@123`
4. Check if user is marked as verified in database

### Issue: "Authentication Service Unavailable"

**Causes:**
1. Database is down or unreachable
2. Database connection timeout

**Solutions:**

1. Check if PostgreSQL is running:
   ```bash
   pg_isready -h your-db-host -U village_user
   ```

2. Test database connection directly:
   ```bash
   psql -h your-db-host -U village_user -d village_prod
   ```

3. Check firewall rules allow connections to database

4. Verify DATABASE_URL format is correct

## Configuration from Admin Panel

Once the admin panel is accessible, you can configure additional settings through the UI:

1. **User Management**: Add/remove users, assign roles
2. **Content Management**: Edit pages, articles, and media
3. **Booking Settings**: Configure homestay availability and pricing
4. **System Settings**: Adjust application behavior (coming soon)
5. **Theme Customization**: Modify colors and branding (coming soon)

**Note:** Core settings (DATABASE_URL, NEXTAUTH_SECRET, etc.) must still be set via environment variables for security reasons. Only application-level settings can be changed through the admin panel.

## Security Checklist

Before going live, ensure:

- [ ] NEXTAUTH_SECRET is secure (32+ characters, randomly generated)
- [ ] DATABASE_URL uses strong password
- [ ] HTTPS/SSL is enabled
- [ ] Default admin password has been changed
- [ ] Database backups are configured
- [ ] Monitoring and logging are enabled
- [ ] Error messages don't expose sensitive information in production
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled for authentication endpoints

## Monitoring

### Health Check

The application provides a health check endpoint:

```bash
curl https://your-domain.com/api/health
```

Use this endpoint to:
- Monitor application status
- Check database connectivity
- Integrate with uptime monitoring services (UptimeRobot, Pingdom, etc.)

### Application Logs

Check logs for errors:
```bash
# In CapRover
caprover logs --app village-app-production --tail 100

# In Docker
docker logs your-container-name --tail 100

# In PM2
pm2 logs village-app
```

## Support

If you continue to experience issues:

1. **Check the health endpoint:** `https://your-domain.com/api/health`
2. **Review application logs** for detailed error messages
3. **Run diagnostics:**
   ```bash
   npm run validate:env
   npm run admin:verify
   ```
4. **Consult documentation:**
   - [AUTH_ERROR_HANDLING.md](./AUTH_ERROR_HANDLING.md)
   - [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
5. **Contact support:** support@damdayvillage.com

## Quick Reference

### Essential Commands

```bash
# Validate environment configuration
npm run validate:env

# Check database connectivity
curl https://your-domain.com/api/health

# Verify admin user exists
npm run admin:verify

# Seed admin user
npm run db:seed

# Run database migrations
npx prisma migrate deploy

# Generate Prisma client
npm run db:generate

# Build application
npm run build

# Start production server
npm start
```

### Default Credentials

**Admin User:**
- Email: `admin@damdayvillage.org`
- Password: `Admin@123`

**⚠️ Change these immediately after first login!**

## Next Steps

After successful deployment:

1. ✅ Login to admin panel
2. ✅ Change default admin password
3. ✅ Configure email service for notifications
4. ✅ Set up OAuth providers (optional)
5. ✅ Configure payment providers
6. ✅ Add additional admin users
7. ✅ Customize content and theme
8. ✅ Set up monitoring and backups
9. ✅ Test all features thoroughly

---

**Last Updated:** January 2025
**Version:** 1.0.0
