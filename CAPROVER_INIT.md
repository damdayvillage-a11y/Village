# CapRover Initialization Commands

This document provides the initialization commands for automated database setup and seeding in CapRover.

## Quick Setup via Environment Variables (Recommended)

The easiest way to initialize the application is using environment variables. This approach is non-blocking and handles initialization automatically on container startup.

### Step 1: Set Environment Variables

In CapRover → Apps → village → App Configs → Environment Variables, add:

```bash
# First deployment only - enable initialization
RUN_MIGRATIONS=true
RUN_SEED=true
```

### Step 2: Deploy

Deploy the application via GitHub or CapRover CLI. The container will automatically:
1. Run database migrations
2. Seed the database with admin user and sample data
3. Start the Next.js server

### Step 3: Verify

After deployment completes:
```bash
# Check health endpoint
curl https://your-domain.com/api/health

# Expected output includes:
# "database": {"status": "healthy", ...}
# "admin": {"status": "healthy", "exists": true, ...}
```

### Step 4: Disable Auto-Initialization

After first successful deployment, disable auto-initialization:

```bash
# In CapRover environment variables, change:
RUN_MIGRATIONS=false
RUN_SEED=false

# Or remove these variables entirely
```

## Manual Initialization (Alternative)

If you prefer manual control, leave `RUN_MIGRATIONS` and `RUN_SEED` unset or false, and run commands manually after deployment.

### Get Container Shell Access

```bash
# Method 1: Via CapRover Dashboard
# Go to Apps → village → Deployment → "Open Terminal"

# Method 2: Via SSH/Docker CLI
CONTAINER_ID=$(docker ps | grep srv-captain--village | awk '{print $1}')
docker exec -it $CONTAINER_ID sh
```

### Run Migrations

```bash
# Inside container or via docker exec
node /app/node_modules/prisma/build/index.js migrate deploy --schema=/app/prisma/schema.prisma
```

Or from host:
```bash
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') \
  sh -c "node /app/node_modules/prisma/build/index.js migrate deploy --schema=/app/prisma/schema.prisma"
```

### Seed Database

```bash
# Inside container or via docker exec
/app/node_modules/.bin/tsx /app/scripts/seed.ts
```

Or from host:
```bash
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') \
  sh -c "/app/node_modules/.bin/tsx /app/scripts/seed.ts"
```

### Verify Admin User

```bash
# Inside container or via docker exec
node /app/scripts/verify-admin.js
```

Or from host:
```bash
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') \
  sh -c "node /app/scripts/verify-admin.js"
```

## CapRover Pre-Deploy Command (Advanced)

CapRover doesn't support pre-deploy hooks directly, but you can use the "Initialization Command" feature in some scenarios. However, the recommended approach is using environment variables as shown above.

## Troubleshooting

### Migrations Fail with "Database does not exist"

Ensure PostgreSQL database is created:
```bash
# Connect to PostgreSQL container
docker exec -it $(docker ps | grep srv-captain--postgres | awk '{print $1}') sh

# Create database if it doesn't exist
psql -U damdiyal -c "CREATE DATABASE villagedb;"
```

### Seeding Fails with "Table does not exist"

Run migrations first:
```bash
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') \
  sh -c "node /app/node_modules/prisma/build/index.js migrate deploy --schema=/app/prisma/schema.prisma"
```

### tsx Not Found

Ensure tsx is in dependencies (not devDependencies) and container was built after adding it:
```bash
# Check if tsx exists in production image
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') \
  ls -la /app/node_modules/.bin/tsx
```

If not found, rebuild the container:
1. Update package.json to include tsx in dependencies
2. Redeploy in CapRover

### Argon2 Compilation Errors in Alpine

The application automatically falls back to bcryptjs if argon2 fails. You'll see warnings but the application will continue:

```
⚠️  Argon2 hashing failed, falling back to bcryptjs
```

This is expected and safe. bcryptjs is pure JavaScript and works reliably in Alpine Linux.

### Container Restarts Immediately

Check logs for startup errors:
```bash
docker logs $(docker ps -a | grep srv-captain--village | awk '{print $1}') --tail 100
```

Common issues:
1. Database not accessible - check DATABASE_URL
2. Missing required environment variables - check .env.caprover
3. Port already in use - restart CapRover

## Automated CI/CD with GitHub Actions

For automated deployment and initialization via GitHub Actions, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to CapRover

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to CapRover
        uses: caprover/deploy-from-github@v1.0.1
        with:
          server: '${{ secrets.CAPROVER_SERVER }}'
          app: 'village'
          token: '${{ secrets.CAPROVER_APP_TOKEN }}'
      
      - name: Wait for deployment
        run: sleep 30
      
      - name: Check health
        run: |
          curl -f https://your-domain.com/api/health || exit 1
```

## Monitoring Initialization

### Check Logs in Real-Time

```bash
# Follow logs during initialization
docker logs -f $(docker ps | grep srv-captain--village | awk '{print $1}')
```

Look for these messages:
```
✅ Initialization complete, starting Next.js server...
🌱 Seeding Smart Carbon-Free Village database...
✅ Created village: Damday Village
✅ Created users: Village Administrator and Raj Singh
🎉 Database seeded successfully!
```

### Check Health Endpoint

```bash
# JSON output
curl https://your-domain.com/api/health | jq

# Check specific service
curl https://your-domain.com/api/health | jq '.services.admin'
```

Expected healthy output:
```json
{
  "status": "healthy",
  "exists": true,
  "verified": true,
  "message": "Admin user configured"
}
```

## Post-Initialization Checklist

- [ ] Health endpoint returns 200 OK
- [ ] Admin user check shows "exists": true
- [ ] Can access admin panel: https://your-domain.com/admin-panel/login
- [ ] Can login with: admin@damdayvillage.org / Admin@123
- [ ] Change default passwords immediately
- [ ] Disable RUN_MIGRATIONS and RUN_SEED in environment variables
- [ ] Setup database backups
- [ ] Configure monitoring (optional)

## Support

For more details, see:
- `CREDENTIALS.md` - Full deployment guide with credentials
- `docs/DEPLOY.md` - Production deployment documentation
- `docs/QUICK_FIX_GUIDE.md` - Common issues and fixes

---

**Last Updated**: 2025-10-15
