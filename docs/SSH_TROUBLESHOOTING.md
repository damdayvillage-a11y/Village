# SSH Troubleshooting Guide - CapRover Deployment

## Common Error: "npm ERR! enoent ENOENT: no such file or directory, open '/root/package.json'"

### Problem
When you SSH into your CapRover server and run commands like:
```bash
npm run validate:env
npm run db:seed
npm run admin:verify
```

You get this error:
```
npm ERR! code ENOENT
npm ERR! syscall open
npm ERR! path /root/package.json
npm ERR! errno -2
npm ERR! enoent ENOENT: no such file or directory, open '/root/package.json'
```

### Why This Happens
You are running the commands on the **host server** (your CapRover VPS), but the application and `package.json` are **inside the Docker container**. The npm commands need to be run inside the container, not on the host.

### Solution: Run Commands Inside the Docker Container

#### Step 1: Find Your Container
First, SSH into your CapRover server and find the container ID/name:

```bash
# SSH into your server
ssh root@your-server-ip

# List all containers and find your app
docker ps | grep village

# Or more specifically
docker ps | grep srv-captain--village
```

This will show something like:
```
abc123def456   captain-overlay-image:srv-captain--village   ...   srv-captain--village.1.xyz
```

The container ID is `abc123def456` (first column).

#### Step 2: Execute Commands Inside the Container

Instead of running `npm run db:seed` directly, run:

```bash
# Method 1: Using container ID
docker exec -it abc123def456 npm run db:seed

# Method 2: Using automatic detection (recommended)
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run db:seed
```

## Common Tasks - Correct Commands

### 1. Validate Environment Variables
```bash
# ❌ WRONG (on host)
npm run validate:env

# ✅ CORRECT (in container)
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run validate:env
```

### 2. Seed Database (Create Admin User)
```bash
# ❌ WRONG (on host)
npm run db:seed

# ✅ CORRECT (in container)
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run db:seed
```

### 3. Verify Admin User
```bash
# ❌ WRONG (on host)
npm run admin:verify

# ✅ CORRECT (in container)
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run admin:verify
```

### 4. Test Database Connection
```bash
# ❌ WRONG (on host)
npm run db:test

# ✅ CORRECT (in container)
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run db:test
```

### 5. Diagnose Admin Login Issues
```bash
# ✅ CORRECT (in container)
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run admin:diagnose
```

### 6. Run Prisma Commands
```bash
# Push database schema
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npx prisma db push

# Generate Prisma client
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npx prisma generate

# Open Prisma Studio (not recommended on production)
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npx prisma studio
```

## Admin Login Error: "Unable to sign in. Please try again or contact support."

### Causes and Solutions

#### 1. Admin User Not Created

**Symptoms:**
- Login fails with "Unable to sign in" error
- Fresh deployment or database was recreated

**Solution:**
The application should auto-create the admin user on startup. If it didn't:

```bash
# Method 1: Run the seed script (creates admin + sample data)
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run db:seed

# Method 2: Use the admin init API (creates only admin user)
curl -X POST https://your-domain.com/api/admin/init

# Verify the admin user was created
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run admin:verify
```

Expected output from `admin:verify`:
```
✅ Admin user found:
   - Name: Village Administrator
   - Email: admin@damdayvillage.org
   - Role: ADMIN
   - Verified: ✅
   - Active: ✅
✅ Admin password is set
✅ Default password verification successful
```

#### 2. Database Connection Issues

**Symptoms:**
- Login form loads but login fails
- Container logs show database errors

**Solution:**

```bash
# Check database connectivity
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run db:test

# Check container environment variables
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') sh -c "env | grep DATABASE_URL"

# Check application logs
docker logs $(docker ps | grep srv-captain--village | awk '{print $1}') | tail -50
```

If DATABASE_URL is wrong, update it in CapRover:
1. Go to CapRover Dashboard → Apps → Your App
2. Click "App Configs" → "Environment Variables"
3. Update DATABASE_URL
4. Click "Save & Update"
5. Wait for container to restart

#### 3. NEXTAUTH Configuration Issues

**Symptoms:**
- Login fails immediately
- Browser console shows authentication errors

**Solution:**

```bash
# Check NEXTAUTH configuration
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') sh -c "env | grep NEXTAUTH"
```

Required settings:
- `NEXTAUTH_URL` must match your domain (e.g., `https://damdayvillage.com`)
- `NEXTAUTH_SECRET` must be at least 32 characters

If wrong, update in CapRover and restart the app.

#### 4. Password Hash Issues

**Symptoms:**
- Admin user exists but login still fails
- Verify script shows password is set

**Solution:**

```bash
# Diagnose the issue
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run admin:diagnose

# If password is corrupted, recreate admin user
# First, get a shell in the container
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') sh

# Inside the container, run Node.js
node

# In Node.js REPL, run this:
const { PrismaClient } = require('@prisma/client');
const bcryptjs = require('bcryptjs');
const db = new PrismaClient();

async function resetAdmin() {
  const salt = await bcryptjs.genSalt(12);
  const hashedPassword = await bcryptjs.hash('Admin@123', salt);
  
  await db.user.upsert({
    where: { email: 'admin@damdayvillage.org' },
    update: { password: hashedPassword, active: true, verified: true },
    create: {
      email: 'admin@damdayvillage.org',
      name: 'Village Administrator',
      role: 'ADMIN',
      password: hashedPassword,
      verified: true,
      active: true,
      preferences: { language: 'en', notifications: true }
    }
  });
  
  console.log('Admin reset complete!');
  await db.$disconnect();
}

resetAdmin();
// Wait for it to complete, then press Ctrl+D to exit Node.js
// Type 'exit' to leave the container
```

## Quick Reference - Interactive Shell

### Get a Shell Inside the Container

```bash
# Start an interactive shell
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') sh

# Now you're inside the container! You can run:
npm run db:seed
npm run admin:verify
npx prisma db push
ls -la
cat .env
env | grep DATABASE
# etc...

# Exit when done
exit
```

### Check Application Logs

```bash
# View recent logs
docker logs $(docker ps | grep srv-captain--village | awk '{print $1}') | tail -100

# Follow logs in real-time
docker logs -f $(docker ps | grep srv-captain--village | awk '{print $1}')

# Search logs for errors
docker logs $(docker ps | grep srv-captain--village | awk '{print $1}') | grep -i error

# Search for admin-related logs
docker logs $(docker ps | grep srv-captain--village | awk '{print $1}') | grep -i admin
```

### Check Database from PostgreSQL Container

```bash
# Get a shell in PostgreSQL container
docker exec -it $(docker ps | grep srv-captain--postgres | awk '{print $1}') sh

# Connect to database
psql -U postgres -d villagedb

# Check if admin user exists
SELECT id, email, name, role, verified, active FROM "User" WHERE email = 'admin@damdayvillage.org';

# Exit psql
\q

# Exit container
exit
```

## Default Admin Credentials

After running `npm run db:seed` or using `/api/admin/init`:

```
Email: admin@damdayvillage.org
Password: Admin@123
```

**⚠️ IMPORTANT:** Change this password immediately after first login!

## Troubleshooting Checklist

When admin login doesn't work, check these in order:

- [ ] Application container is running: `docker ps | grep srv-captain--village`
- [ ] Database container is running: `docker ps | grep srv-captain--postgres`
- [ ] Database connection works: `docker exec ... npm run db:test`
- [ ] Environment variables are set: `docker exec ... sh -c "env | grep -E 'DATABASE|NEXTAUTH'"`
- [ ] Admin user exists: `docker exec ... npm run admin:verify`
- [ ] Application logs show no errors: `docker logs ... | tail -50`
- [ ] Can access homepage: `curl https://your-domain.com`
- [ ] Can access login page: `curl https://your-domain.com/auth/signin`

## Still Having Issues?

### Check System Status Page

Visit your application's status page:
```
https://your-domain.com/admin-panel/status
```

This shows:
- Database connectivity
- Environment configuration
- System health
- Admin user status

### Check Error Pages

For detailed troubleshooting in English or Hindi:
```
https://your-domain.com/help/admin-500
https://your-domain.com/help/admin-500-hi
```

### Enable Debug Logging

Temporarily enable debug mode:

```bash
# Add DEBUG environment variable in CapRover
DEBUG=*
```

Then restart the app and check logs for detailed information.

## Common Mistakes

### ❌ Running npm commands on the host
```bash
ssh root@server
npm run db:seed  # This will fail!
```

### ✅ Running npm commands in the container
```bash
ssh root@server
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run db:seed
```

### ❌ Trying to access files on the host
```bash
ssh root@server
cd /root
cat package.json  # Not here!
```

### ✅ Accessing files in the container
```bash
ssh root@server
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') cat package.json
```

## Advanced: Create Aliases for Convenience

Add these to your `~/.bashrc` or `~/.profile` on the CapRover server:

```bash
# Add to ~/.bashrc
alias village-exec='docker exec -it $(docker ps | grep srv-captain--village | awk "{print \$1}")'
alias village-logs='docker logs $(docker ps | grep srv-captain--village | awk "{print \$1}")'
alias village-shell='docker exec -it $(docker ps | grep srv-captain--village | awk "{print \$1}") sh'

# Reload
source ~/.bashrc

# Now you can use:
village-exec npm run db:seed
village-logs | tail -50
village-shell
```

## Environment-Specific Notes

### CapRover Environment

The application runs inside a Docker container managed by CapRover. The container:
- Runs on Alpine Linux
- Uses Node.js 20
- Listens on port 80 internally
- Is mapped to your domain by CapRover

### File Locations

**On Host (CapRover server):**
- CapRover config: `/captain/`
- Docker volumes: `/var/lib/docker/volumes/`
- You should NOT directly access application files here

**Inside Container:**
- Application root: `/app/`
- Node modules: `/app/node_modules/`
- Package.json: `/app/package.json`
- Prisma schema: `/app/prisma/schema.prisma`

## Summary

Remember these key points:

1. **DO NOT run npm commands directly on the host** - they won't work
2. **Always use `docker exec` to run commands inside the container**
3. **The application auto-creates admin user on startup** - if it didn't, run `npm run db:seed`
4. **Check logs** when something goes wrong
5. **Use the interactive shell** (`docker exec -it ... sh`) for multiple commands

---

**Last Updated:** 2025-10-19  
**Version:** 1.0.0
