# How to Fix Admin Login and SSH Command Issues

## 🎯 Quick Fix (TL;DR)

If you're getting "Unable to sign in" and npm commands are failing, do this:

```bash
# 1. SSH into your server
ssh root@your-server-ip

# 2. Create the admin user (run inside container)
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run db:seed

# 3. Try logging in again
# URL: https://your-domain.com/admin-panel/login
# Email: admin@damdayvillage.org
# Password: Admin@123
```

**⚠️ Change password immediately after first login!**

---

## 📖 Understanding the Problem

### Why npm commands fail on SSH

When you SSH into your CapRover server and run:
```bash
npm run db:seed
```

You get this error:
```
npm ERR! enoent ENOENT: no such file or directory, open '/root/package.json'
```

**Why?** Because:
1. You're on the **host server** (in `/root` directory)
2. The application runs inside a **Docker container**
3. The `package.json` file is **inside the container**, not on the host

Think of it like this:
- Your server is a building
- Docker containers are apartments inside the building
- The application lives in an apartment, not in the lobby (host)
- You need to "go into the apartment" to run commands

### The Solution

Always use `docker exec` to run commands inside the container:

```bash
# ❌ WRONG (runs on host - will fail)
npm run db:seed

# ✅ CORRECT (runs inside container)
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run db:seed
```

---

## 🔧 Step-by-Step Fix

### Step 1: SSH into Your Server

```bash
ssh root@your-server-ip
```

### Step 2: Find Your Container

```bash
docker ps | grep srv-captain--village
```

You should see output like:
```
abc123def456   captain-overlay-image:srv-captain--village   ...
```

The `abc123def456` is your container ID.

### Step 3: Create Admin User

Run this command (all on one line):

```bash
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run db:seed
```

You should see:
```
🌱 Seeding Smart Carbon-Free Village database...
✅ Created village: Damday Village
✅ Created admin user
✅ Created host user
...
```

### Step 4: Verify Admin User

```bash
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run admin:verify
```

Expected output:
```
✅ Admin user found:
   - Name: Village Administrator
   - Email: admin@damdayvillage.org
   - Role: ADMIN
   - Verified: ✅
   - Active: ✅
✅ Admin password is set
```

### Step 5: Login

Go to: `https://your-domain.com/admin-panel/login`

Use these credentials:
- **Email:** `admin@damdayvillage.org`
- **Password:** `Admin@123`

**⚠️ Important:** Change this password immediately after logging in!

---

## 📝 Common Commands Reference

All these commands should be run with `docker exec` when you're SSH'd into the server:

### Create Admin User
```bash
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run db:seed
```

### Verify Admin User Exists
```bash
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run admin:verify
```

### Check Environment Variables
```bash
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run validate:env
```

### Test Database Connection
```bash
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run db:test
```

### Diagnose Admin Login Issues
```bash
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run admin:diagnose
```

### View Application Logs
```bash
docker logs $(docker ps | grep srv-captain--village | awk '{print $1}') | tail -100
```

### Get Interactive Shell (Easier for Multiple Commands)
```bash
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') sh

# Now you're inside the container! You can run:
npm run db:seed
npm run admin:verify
ls -la
exit  # when done
```

---

## 🎓 Pro Tips

### 1. Create Aliases for Convenience

Add to your `~/.bashrc` on the server:

```bash
alias village-exec='docker exec -it $(docker ps | grep srv-captain--village | awk "{print \$1}")'
alias village-logs='docker logs $(docker ps | grep srv-captain--village | awk "{print \$1}")'
alias village-shell='docker exec -it $(docker ps | grep srv-captain--village | awk "{print \$1}") sh'
```

Then reload:
```bash
source ~/.bashrc
```

Now you can use shorter commands:
```bash
village-exec npm run db:seed
village-logs | tail -50
village-shell
```

### 2. Use the Web Interface (No SSH Needed)

You can also create the admin user via the web:

1. Go to: `https://your-domain.com/api/admin/init`
2. This will create the admin user automatically
3. Then login normally

### 3. Check System Status

Visit: `https://your-domain.com/admin-panel/status`

This page shows:
- Database connectivity
- Environment configuration
- Admin user status
- System health

---

## ❓ Troubleshooting

### Container Not Found

If `docker ps | grep srv-captain--village` shows nothing:

1. **Check all containers:**
   ```bash
   docker ps -a
   ```

2. **Find your app name** in CapRover dashboard

3. **Adjust the grep:**
   ```bash
   docker ps | grep your-app-name
   ```

### Admin User Still Can't Login

1. **Check the logs:**
   ```bash
   docker logs $(docker ps | grep srv-captain--village | awk '{print $1}') | grep -i admin
   ```

2. **Verify environment variables:**
   ```bash
   docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') sh -c "env | grep -E 'DATABASE|NEXTAUTH'"
   ```

3. **Check database connection:**
   ```bash
   docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run db:test
   ```

4. **Visit the help page:**
   - English: `https://your-domain.com/help/admin-500`
   - Hindi: `https://your-domain.com/help/admin-500-hi`

### Database Connection Issues

If commands fail with database errors:

1. **Check DATABASE_URL is set** in CapRover App Configs
2. **Verify PostgreSQL is running:**
   ```bash
   docker ps | grep postgres
   ```
3. **Test PostgreSQL connection:**
   ```bash
   docker exec -it $(docker ps | grep postgres | awk '{print $1}') psql -U postgres -c "SELECT 1"
   ```

---

## 📚 Documentation Resources

For more detailed information:

1. **[Quick SSH Reference](docs/QUICK_SSH_REFERENCE.md)** - One-page quick reference
2. **[SSH Troubleshooting Guide](docs/SSH_TROUBLESHOOTING.md)** - Complete troubleshooting
3. **[Deployment Guide](docs/DEPLOY.md)** - Full deployment instructions
4. **[Documentation Index](docs/README.md)** - All documentation

---

## 🆘 Still Having Issues?

1. **Check the system status page:** `https://your-domain.com/admin-panel/status`
2. **Read the help pages:**
   - English: `https://your-domain.com/help/admin-500`
   - Hindi: `https://your-domain.com/help/admin-500-hi`
3. **Review the logs:** `docker logs <container-id>`
4. **Check environment variables** in CapRover dashboard
5. **Consult the documentation** in the `docs/` directory

---

## ✅ Summary

**Remember these key points:**

1. ❌ **Never run npm commands directly on the host** - they will fail
2. ✅ **Always use `docker exec`** to run commands inside the container
3. 🔄 **The app auto-creates admin users** on startup - manual creation is backup
4. 🔒 **Change default passwords** immediately after first login
5. 📖 **Use the documentation** - it has detailed troubleshooting steps

**Most common command you'll need:**
```bash
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run db:seed
```

---

**Last Updated:** 2025-10-19  
**Version:** 1.0.0
