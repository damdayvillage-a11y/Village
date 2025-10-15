# Damday Village - CapRover Deployment Credentials & Setup

**⚠️ SECURITY WARNING: This file contains examples and placeholder credentials.**

**DO NOT commit actual production credentials to version control!**

- Store actual credentials in a password manager or secure vault
- Use environment variables for sensitive configuration
- This file is for reference and documentation only
- Replace all placeholder values with actual production values when deploying

## Current CapRover Configuration

### Server Details
- **CapRover URL**: `https://captain.your-server.com`
- **Server IP**: `[Your Server IP]`
- **Server Location**: `[Your Server Location]`

### PostgreSQL Database (CapRover One-Click App)

**Example Configuration (Replace with your actual values):**

```bash
App Name: postgres
Database Name: villagedb
Username: YOUR_DB_USERNAME
Password: YOUR_SECURE_DB_PASSWORD
Internal Service URL: srv-captain--postgres:5432
```

**Full Database URL Format (for CapRover env vars):**
```
DATABASE_URL=postgresql://YOUR_DB_USERNAME:YOUR_ENCODED_PASSWORD@srv-captain--postgres:5432/villagedb
```

> **Important Notes**: 
> - The `srv-captain--postgres` is CapRover's internal service name (keep as-is)
> - Special characters in password MUST be URL-encoded: `@` becomes `%40`, `#` becomes `%23`, etc.
> - Use a strong, unique password for production
> - Store actual credentials in a secure password manager, not in version control

**Example with URL encoding:**
If your password is `MyP@ss#123`, the encoded version would be `MyP%40ss%23123`

### Village Application

```bash
App Name: village
Domain: damdayvillage.com (or your configured domain)
Port: 80 (internal container port)
```

### Required Environment Variables in CapRover

Navigate to: **CapRover → Apps → village → App Configs → Environment Variables**

#### Core Variables (REQUIRED)

```bash
NODE_ENV=production

# Your actual domain - REPLACE with your domain!
NEXTAUTH_URL=https://your-domain.com

# Generate with: openssl rand -base64 32
# REPLACE with actual generated secret!
NEXTAUTH_SECRET=[REPLACE_WITH_GENERATED_SECRET_MIN_32_CHARS]

# Database connection (use URL encoding for special characters)
# Replace YOUR_DB_USER and YOUR_ENCODED_PASSWORD with actual values
DATABASE_URL=postgresql://YOUR_DB_USER:YOUR_ENCODED_PASSWORD@srv-captain--postgres:5432/villagedb

# Build optimizations
NEXT_TELEMETRY_DISABLED=1
GENERATE_SOURCEMAP=false
CI=true
CAPROVER_BUILD=true
```

#### Initialization Variables (Optional, for first deploy)

```bash
# Set these ONLY for first deployment, then remove them
RUN_MIGRATIONS=true
RUN_SEED=true
```

After first successful deployment with seeding, **remove or set to false**:
```bash
RUN_MIGRATIONS=false
RUN_SEED=false
```

## Default Application Credentials

### Admin Account
```
Email: admin@damdayvillage.org
Password: Admin@123
```

### Host Account
```
Email: host@damdayvillage.org
Password: Host@123
```

**⚠️ CRITICAL: Change these passwords immediately after first login!**

## Generating NEXTAUTH_SECRET

On your local machine or CapRover server:
```bash
openssl rand -base64 32
```

Copy the output and paste it as the `NEXTAUTH_SECRET` value in CapRover.

## First-Time Deployment Steps

### 1. Setup PostgreSQL Database

1. Go to CapRover → One-Click Apps/Databases
2. Select "PostgreSQL"
3. Configure:
   - App Name: `postgres`
   - Database Name: `villagedb`
   - Username: Choose a secure username (example: `villageuser`)
   - Password: Generate a strong password (use a password manager)
4. Click "Deploy"
5. Wait for deployment to complete
6. **Save your credentials securely** - you'll need them for DATABASE_URL

### 2. Create Village Application

1. Go to CapRover → Apps
2. Click "Create a New App"
3. App Name: `village`
4. Click "Create New App"

### 3. Configure Environment Variables

1. Go to village app → "App Configs" tab
2. Add all environment variables listed above under "Required Environment Variables"
3. Generate a new `NEXTAUTH_SECRET` using: `openssl rand -base64 32`
4. Set `RUN_MIGRATIONS=true` and `RUN_SEED=true` for first deploy
5. Click "Save & Update"

### 4. Enable HTTPS & Domain

1. Go to village app → "HTTP Settings" tab
2. Enable "HTTPS"
3. Add your domain: `damdayvillage.com`
4. Enable "Force HTTPS"
5. Click "Save & Update"

### 5. Deploy Application

#### Option A: Via GitHub (Recommended)

1. Fork/clone the repository
2. Go to village app → "Deployment" tab
3. Select "Method 3: Deploy from Github/Bitbucket/Gitlab"
4. Connect your repository
5. Branch: `main`
6. Click "Save & Update"

#### Option B: Via CLI

```bash
# Install CapRover CLI
npm install -g caprover

# Login
caprover login

# Deploy
cd /path/to/Village
caprover deploy
```

### 6. Verify Deployment

1. Check build logs in CapRover dashboard
2. Wait for build to complete (5-10 minutes)
3. Visit: `https://your-domain.com/api/health`
   - Should return: `{"status":"healthy",...}`
4. Visit: `https://your-domain.com/admin-panel/status`
   - All checks should be green ✅

### 7. First Login

1. Visit: `https://your-domain.com/admin-panel/login`
2. Login with default admin credentials (created by seed script):
   - Email: `admin@damdayvillage.org`
   - Password: `Admin@123`
3. **⚠️ CRITICAL: Immediately change the password to a strong, unique password!**
4. These are well-known default credentials and pose a security risk if not changed

### 8. Clean Up Environment Variables

After first successful deployment:
1. Go to CapRover → Apps → village → App Configs
2. Remove or set to false:
   ```bash
   RUN_MIGRATIONS=false
   RUN_SEED=false
   ```
3. Click "Save & Update"

## Post-Deployment Operations

### Run Migrations Manually

If migrations need to be run after deployment:

```bash
# Get container ID
CONTAINER_ID=$(docker ps | grep srv-captain--village | awk '{print $1}')

# Run migrations
docker exec -it $CONTAINER_ID sh -c "node /app/node_modules/prisma/build/index.js migrate deploy --schema=/app/prisma/schema.prisma"
```

### Seed Database Manually

If you need to re-seed the database:

```bash
# Get container ID
CONTAINER_ID=$(docker ps | grep srv-captain--village | awk '{print $1}')

# Run seed script
docker exec -it $CONTAINER_ID sh -c "/app/node_modules/.bin/tsx /app/scripts/seed.ts"
```

### Check Logs

```bash
# View application logs
docker logs $(docker ps | grep srv-captain--village | awk '{print $1}') --tail 100 -f

# View database logs
docker logs $(docker ps | grep srv-captain--postgres | awk '{print $1}') --tail 50
```

### Verify Admin User

```bash
CONTAINER_ID=$(docker ps | grep srv-captain--village | awk '{print $1}')
docker exec -it $CONTAINER_ID sh -c "node /app/scripts/verify-admin.js"
```

## Troubleshooting

### Build Fails - Out of Memory

Enable swap on the server:
```bash
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

Make it permanent:
```bash
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Database Connection Failed

1. Verify PostgreSQL is running:
   ```bash
   docker ps | grep postgres
   ```

2. Test database connection:
   ```bash
   # Replace YOUR_DB_USER with your actual database username
   docker exec -it $(docker ps | grep srv-captain--postgres | awk '{print $1}') \
     psql -U YOUR_DB_USER -d villagedb -c 'SELECT 1;'
   ```

3. Check if database URL is correct in CapRover env vars

### Admin Panel 500 Error

1. Check application logs
2. Verify Prisma client is generated:
   ```bash
   docker exec -it $CONTAINER_ID ls -la /app/node_modules/@prisma/client
   ```
3. Verify database connection works
4. Re-run seed script

### Container Won't Start

1. Check environment variables are set correctly
2. Check logs for startup errors
3. Verify entrypoint script has execute permissions
4. Check disk space: `df -h`

## Security Checklist

- [x] Change default admin password immediately after first login
- [x] Change default host password
- [x] Use strong NEXTAUTH_SECRET (minimum 32 characters)
- [x] Enable HTTPS with valid SSL certificate
- [x] Enable "Force HTTPS" in CapRover
- [x] Don't commit this file with real passwords to public repositories
- [ ] Setup database backups (CapRover backup or pg_dump)
- [ ] Setup monitoring (optional: Sentry, LogRocket, etc.)
- [ ] Review and update firewall rules
- [ ] Setup regular security updates

## Backup Strategy

### Database Backup

```bash
# Manual backup (replace YOUR_DB_USER with your database username)
docker exec $(docker ps | grep srv-captain--postgres | awk '{print $1}') \
  pg_dump -U YOUR_DB_USER villagedb > backup_$(date +%Y%m%d).sql

# Restore from backup
docker exec -i $(docker ps | grep srv-captain--postgres | awk '{print $1}') \
  psql -U YOUR_DB_USER villagedb < backup_20241015.sql
```

### Automated Backup (Cron)

Add to crontab (`crontab -e`):
```bash
# Daily backup at 2 AM (replace YOUR_DB_USER with your username)
0 2 * * * docker exec $(docker ps | grep srv-captain--postgres | awk '{print $1}') \
  pg_dump -U YOUR_DB_USER villagedb > /backups/village_$(date +\%Y\%m\%d).sql
```

## Support & Documentation

- **Main Documentation**: `/docs/DEPLOY.md`
- **Quick Fix Guide**: `/docs/QUICK_FIX_GUIDE.md`
- **Production Checklist**: `/docs/PRODUCTION_DEPLOYMENT_CHECKLIST.md`
- **Health Endpoint**: `https://your-domain.com/api/health`
- **Admin Status**: `https://your-domain.com/admin-panel/status`

---

**Last Updated**: 2025-10-15
**Document Version**: 1.0
