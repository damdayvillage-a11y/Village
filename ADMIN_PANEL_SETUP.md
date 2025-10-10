# Admin Panel Setup & Troubleshooting

## Quick Start

This guide helps you set up and troubleshoot the admin panel for Damday Village platform.

### Prerequisites

1. PostgreSQL database server running
2. Node.js 20+ installed
3. Environment variables configured

### Setup Steps

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/damdayvillage-a11y/Village.git
   cd Village
   npm ci
   ```

2. **Configure environment variables:**
   Create a `.env` file (or set in your deployment platform):
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/database"
   NEXTAUTH_URL="https://damdayvillage.com"
   NEXTAUTH_SECRET="[generate with: openssl rand -base64 32]"
   NODE_ENV="production"
   ```

3. **Run database migrations:**
   ```bash
   npx prisma migrate deploy
   ```

4. **Seed admin user:**
   ```bash
   npm run db:seed
   ```

5. **Build and start:**
   ```bash
   npm run build
   npm start
   ```

6. **Access admin panel:**
   Navigate to `https://your-domain.com/admin-panel`

## Default Admin Credentials

After running `npm run db:seed`:

- **Email:** `admin@damdayvillage.org`
- **Password:** `Admin@123`

**⚠️ IMPORTANT:** Change the password immediately after first login!

## Common Issues & Solutions

### Issue 1: 500 Internal Server Error on Login

**Symptom:** When accessing `/admin-panel`, you get a 500 error or redirect to error page.

**Causes:**
- Database not configured or unreachable
- Environment variables missing or using dummy/placeholder values
- **CRITICAL:** CapRover placeholders (like `$$cap_appname$$`) not replaced with actual values
- Admin user not created

**Solutions:**

1. **Validate environment configuration (MOST COMMON ISSUE):**
   ```bash
   npm run validate:env
   ```
   
   **Common errors:**
   - ❌ **NEXTAUTH_URL contains placeholders** like `$$cap_appname$$.$$cap_root_domain$$`
     - **Fix:** Replace with actual domain: `https://damdayvillage.com`
   - ❌ **DATABASE_URL contains placeholders** like `$$cap_database_url$$`
     - **Fix:** Replace with actual PostgreSQL URL: `postgresql://user:pass@host:5432/db`
   - ❌ **NEXTAUTH_SECRET contains placeholders** or is too short
     - **Fix:** Generate with `openssl rand -base64 32` and use the result

2. **Check database connection:**
   ```bash
   curl https://your-domain.com/api/health
   ```
   
   If database is unhealthy:
   - Verify DATABASE_URL is correct and doesn't contain placeholders
   - Check if PostgreSQL is running
   - Test connection: `psql -h host -U user -d database`

3. **Verify admin user exists:**
   ```bash
   npm run admin:verify
   ```
   
   If admin doesn't exist, you have three options:
   
   **Option A - Automatic (Recommended):**
   Visit or POST to: `https://your-domain.com/api/admin/init`
   ```bash
   curl -X POST https://your-domain.com/api/admin/init
   ```
   
   **Option B - Database seed:**
   ```bash
   npm run db:seed
   ```
   
   **Option C - Manual using Prisma:**
   ```bash
   npx prisma studio
   # Then manually create user with role=ADMIN
   ```
   
   **Default Credentials** (after creation):
   - Email: `admin@damdayvillage.org`
   - Password: `Admin@123`
   - ⚠️ **Change these immediately after first login!**

4. **Check startup configuration:**
   ```bash
   node scripts/startup-check.js
   ```
   
   This will show any configuration issues.

### Issue 2: "Invalid Credentials" Error

**Symptom:** Login form shows "Invalid credentials" error.

**Solutions:**

1. Verify you're using the correct default credentials:
   - Email: `admin@damdayvillage.org`
   - Password: `Admin@123`

2. Check if admin user exists:
   ```bash
   npm run admin:verify
   ```

3. If admin user doesn't exist, seed the database:
   ```bash
   npm run db:seed
   ```

### Issue 3: "Authentication Service Unavailable"

**Symptom:** Error message says authentication service is unavailable.

**Cause:** Database connection failed or NextAuth configuration error.

**Solutions:**

1. Check database is running and accessible
2. Verify DATABASE_URL in environment variables
3. Check application logs for detailed error messages
4. Test database connection directly

### Issue 4: Redirect Loop or Session Issues

**Symptom:** After login, you're redirected back to login page repeatedly.

**Causes:**
- NEXTAUTH_URL doesn't match your domain
- NEXTAUTH_SECRET not set or changed between requests
- Cookie issues (domain mismatch, SameSite settings)

**Solutions:**

1. Ensure NEXTAUTH_URL matches your actual domain exactly
2. Ensure NEXTAUTH_SECRET is set and consistent
3. Clear browser cookies and try again
4. Check browser console for cookie-related errors

## Verification Commands

Use these commands to diagnose issues:

```bash
# Check environment configuration
npm run validate:env

# Verify admin user exists
npm run admin:verify

# Check database health
curl https://your-domain.com/api/health

# Run startup configuration check
node scripts/startup-check.js

# View application logs (in production)
# CapRover: caprover logs --app village-app-production
# Docker: docker logs container-name
# PM2: pm2 logs village-app
```

## Configuration Reference

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_URL` | Your application URL | `https://damdayvillage.com` |
| `NEXTAUTH_SECRET` | Secret for JWT signing (32+ chars) | Generate with `openssl rand -base64 32` |
| `NODE_ENV` | Environment mode | `production` or `development` |

### Optional Environment Variables

| Variable | Description | Required For |
|----------|-------------|--------------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Google sign-in |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | Google sign-in |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | GitHub sign-in |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth secret | GitHub sign-in |
| `EMAIL_SERVER_HOST` | SMTP server hostname | Email notifications |
| `EMAIL_SERVER_PORT` | SMTP server port | Email notifications |
| `EMAIL_SERVER_USER` | SMTP username | Email notifications |
| `EMAIL_SERVER_PASSWORD` | SMTP password | Email notifications |
| `EMAIL_FROM` | From email address | Email notifications |

## Security Best Practices

1. **Never use dummy values in production:**
   - ❌ `DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy`
   - ❌ `NEXTAUTH_SECRET=dummy-secret-for-build`
   - ✅ Use real, secure values generated specifically for production

2. **Use strong NEXTAUTH_SECRET:**
   ```bash
   # Generate a secure secret
   openssl rand -base64 32
   ```

3. **Change default admin password immediately:**
   After first login, go to User Settings and change password.

4. **Use HTTPS in production:**
   Ensure NEXTAUTH_URL starts with `https://` in production.

5. **Secure your database:**
   - Use strong passwords
   - Restrict network access
   - Enable SSL connections
   - Regular backups

## Admin Panel Features

Once logged in, the admin panel provides:

### Available Now
- ✅ **Dashboard:** Overview of system statistics
- ✅ **User Management:** Add, edit, and manage user accounts
- ✅ **Content Editor:** Edit homepage and content blocks
- ✅ **Statistics:** View user count, bookings, reviews

### Coming Soon
- 🔜 **Page Manager:** Create and edit pages
- 🔜 **Complaints & Reviews:** Manage user feedback
- 🔜 **Booking Management:** View and manage bookings
- 🔜 **Marketplace Admin:** Manage products and sellers
- 🔜 **Media Manager:** Upload and manage media files
- 🔜 **Theme Customizer:** Customize colors and branding
- 🔜 **System Settings:** Configure application behavior

## API Endpoints for Diagnostics

### Health Check
```bash
GET /api/health
```

Returns system health status including database connectivity.

### Admin Stats
```bash
GET /api/admin/stats
```

Returns admin dashboard statistics (requires admin authentication).

## Troubleshooting Checklist

When experiencing issues, go through this checklist:

- [ ] Database is running and accessible
- [ ] DATABASE_URL is set correctly (not dummy value)
- [ ] NEXTAUTH_URL matches your domain exactly
- [ ] NEXTAUTH_SECRET is set (32+ characters, not dummy value)
- [ ] NODE_ENV is set to "production" in production
- [ ] Database migrations have been run (`npx prisma migrate deploy`)
- [ ] Admin user has been created (`npm run db:seed`)
- [ ] HTTPS/SSL is enabled in production
- [ ] Application logs don't show connection errors
- [ ] Health check endpoint returns healthy status

## Getting Help

If you still experience issues after following this guide:

1. **Run all diagnostic commands** listed above
2. **Check application logs** for error messages
3. **Review documentation:**
   - [docs/PRODUCTION_SETUP_GUIDE.md](./docs/PRODUCTION_SETUP_GUIDE.md)
   - [docs/AUTH_ERROR_HANDLING.md](./docs/AUTH_ERROR_HANDLING.md)
   - [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)
4. **Contact support:** support@damdayvillage.com

Include in your support request:
- Output of `npm run validate:env`
- Output of `npm run admin:verify`
- Response from `/api/health` endpoint
- Any error messages from application logs
- Your deployment platform (CapRover, Vercel, etc.)

## Production Deployment Platforms

### CapRover

1. Create app in CapRover dashboard
2. Set environment variables in App Settings
3. Enable HTTPS in App Settings
4. Deploy with git push or Docker

Detailed guide: [docs/CAPROVER_DEPLOYMENT.md](./docs/CAPROVER_DEPLOYMENT.md)

### Vercel

1. Connect GitHub repository
2. Set environment variables in Project Settings
3. Deploy automatically on push

### Docker

1. Build image: `docker build -t village-app .`
2. Run container with environment variables
3. Use Docker Compose for multi-container setup

Example:
```yaml
version: '3.8'
services:
  app:
    image: village-app
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/village
      - NEXTAUTH_URL=https://your-domain.com
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    ports:
      - "3000:3000"
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=village
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
```

## Next Steps

After successful setup:

1. ✅ Login to admin panel at `/admin-panel`
2. ✅ Change default admin password
3. ✅ Add additional admin users if needed
4. ✅ Configure OAuth providers (optional)
5. ✅ Set up email notifications
6. ✅ Customize content and theme
7. ✅ Configure monitoring and backups
8. ✅ Test all features thoroughly

---

**Last Updated:** January 2025  
**Version:** 1.0.0

For the most up-to-date information, see:
- [docs/PRODUCTION_SETUP_GUIDE.md](./docs/PRODUCTION_SETUP_GUIDE.md)
- [ADMIN_LOGIN_FIX_SUMMARY.md](./ADMIN_LOGIN_FIX_SUMMARY.md)
