# ⚡ Coolify Quick Start - 15 Minutes

> **Get your Village app running on Coolify in 15 minutes or less!**

## 🎯 What You'll Do

1. ✅ Create PostgreSQL database (2 min)
2. ✅ Deploy application (5 min)
3. ✅ Configure environment (3 min)
4. ✅ Setup database & admin (3 min)
5. ✅ Verify everything works (2 min)

**Total Time: ~15 minutes**

---

## 📋 Prerequisites

- Coolify instance running
- GitHub repository access
- Domain name (or use Coolify's default)

---

## 🚀 Step-by-Step

### Step 1: Create Project (30 seconds)

1. Login to Coolify
2. Click **"+ New"** → **"Project"**
3. Name: `village-app`
4. Click **"Save"**

---

### Step 2: Create Database (2 minutes)

1. In project, click **"+ New Resource"** → **"Database"** → **"PostgreSQL"**
2. Configure:
   - Name: `village-db`
   - Database: `villagedb`
   - Username: `villageuser`
   - Password: Generate strong password (SAVE IT!)
3. Click **"Create"**
4. Wait for green status ✅

**Save this connection string:**
```
postgresql://villageuser:YOUR_PASSWORD@village-db:5432/villagedb
```

---

### Step 3: Create Application (2 minutes)

1. In project, click **"+ New Resource"** → **"Application"**
2. Select **"Public Repository"**
3. Repository: `https://github.com/damdayvillage-a11y/Village`
4. Branch: `main`
5. Build Pack: **"Dockerfile"**
6. Dockerfile: `Dockerfile.simple`
7. Port: `80`
8. Click **"Continue"**

---

### Step 4: Configure Environment Variables (3 minutes)

Go to application → **"Environment Variables"**

Add these **4 REQUIRED** variables:

```bash
NODE_ENV=production

NEXTAUTH_URL=https://YOUR-DOMAIN.com

NEXTAUTH_SECRET=PASTE_SECRET_HERE

DATABASE_URL=postgresql://villageuser:YOUR_PASSWORD@village-db:5432/villagedb
```

**Generate NEXTAUTH_SECRET now:**

```bash
# Run this command on your computer:
openssl rand -base64 32

# Copy the output and paste as NEXTAUTH_SECRET
```

**Add these 3 OPTIMIZATION variables:**

```bash
NEXT_TELEMETRY_DISABLED=1
GENERATE_SOURCEMAP=false
CI=true
```

Click **"Save"**

---

### Step 5: Configure Networking (1 minute)

1. Go to **"Networking"** section
2. Enable **"Expose"**
3. Enable **"SSL/TLS"** (automatic Let's Encrypt)
4. Set your domain or use Coolify's default
5. Click **"Save"**

---

### Step 6: Deploy! (2-3 minutes)

1. Click big **"Deploy"** button
2. Watch build logs
3. Wait for completion (~2-3 minutes)
4. Status should turn green ✅

---

### Step 7: Setup Database (2 minutes)

Once deployed, go to application → **"Terminal"**

Run these 2 commands:

```bash
# 1. Run migrations
npx prisma migrate deploy

# 2. Create admin user
npm run db:seed
```

**Note your credentials:**
- Admin: `admin@damdayvillage.org` / `Admin@123`
- Host: `host@damdayvillage.org` / `Host@123`

---

### Step 8: Verify! (2 minutes)

#### Test Health Check

Visit: `https://your-domain.com/api/health`

Should see:
```json
{
  "status": "healthy",
  "services": {
    "database": {"status": "healthy"}
  }
}
```

#### Test Admin Login

1. Visit: `https://your-domain.com/admin-panel/login`
2. Login: `admin@damdayvillage.org` / `Admin@123`
3. Should work! ✅ (No 500 error!)
4. **Change password immediately!**

---

## ✅ Success Checklist

- [ ] Database created and running (green)
- [ ] Application deployed successfully
- [ ] Environment variables configured
- [ ] Migrations run successfully
- [ ] Admin user created
- [ ] Health check passes
- [ ] Admin login works
- [ ] Password changed

---

## 🎉 Done!

Your Village app is now running on Coolify!

**Next Steps:**
1. Change admin password
2. Configure optional services (payments, OAuth)
3. Setup monitoring
4. Enable automatic backups

---

## 🐛 Quick Troubleshooting

### Build Failed?
- Check Dockerfile is set to `Dockerfile.simple`
- Increase memory to 2GB
- Try "Force Rebuild"

### Can't Connect to Database?
- Verify database is running (green)
- Check DATABASE_URL matches database credentials
- Use service name `village-db` as host

### 500 Error on Login?
- Verify NEXTAUTH_URL is your actual domain
- Verify NEXTAUTH_SECRET is set (32+ chars)
- Run migrations: `npx prisma migrate deploy`
- Seed database: `npm run db:seed`

### Domain/SSL Issues?
- Check DNS points to Coolify server
- Wait for SSL certificate (takes ~2 minutes)
- Try using Coolify's default domain first

---

## 📚 Full Documentation

For detailed information:
- [Complete Deployment Guide](./COOLIFY_DEPLOYMENT_GUIDE.md)
- [Migration from CapRover](./CAPROVER_TO_COOLIFY_MIGRATION.md)
- [Environment Variables](./ENVIRONMENT_VARIABLES.md)

---

**Need Help?**
- Check [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Visit [Coolify Discord](https://coolify.io/discord)
- Open [GitHub Issue](https://github.com/damdayvillage-a11y/Village/issues)

---

**Version:** 1.0  
**Time Required:** ~15 minutes  
**Difficulty:** Easy ⭐⭐☆☆☆
