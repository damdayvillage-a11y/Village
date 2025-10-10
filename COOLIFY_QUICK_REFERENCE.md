# ⚡ Coolify Quick Reference Card

> **Essential commands and information for Village app on Coolify**

## 🚀 Quick Links

- **Quick Start:** [COOLIFY_QUICK_START.md](./COOLIFY_QUICK_START.md) (15 min)
- **Complete Guide:** [COOLIFY_DEPLOYMENT_GUIDE.md](./COOLIFY_DEPLOYMENT_GUIDE.md)
- **Troubleshooting:** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Migration:** [CAPROVER_TO_COOLIFY_MIGRATION.md](./CAPROVER_TO_COOLIFY_MIGRATION.md)

---

## 🔧 Required Environment Variables

```bash
# Core (4 variables)
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=[generate with: openssl rand -base64 32]
DATABASE_URL=postgresql://villageuser:password@village-db:5432/villagedb

# Build Optimization (3 variables)
NEXT_TELEMETRY_DISABLED=1
GENERATE_SOURCEMAP=false
CI=true
```

---

## 📝 Essential Commands

### Generate Secret
```bash
openssl rand -base64 32
```

### In Coolify Terminal (Application)

```bash
# Run migrations
npx prisma migrate deploy

# Seed database
npm run db:seed

# Verify admin
npm run admin:verify

# Check migration status
npx prisma migrate status
```

### Test Database Connection
```bash
psql $DATABASE_URL -c "SELECT 1"
```

---

## 🔍 Diagnostic URLs

```bash
# Health check
https://your-domain.com/api/health

# Auth status
https://your-domain.com/api/auth/status

# Environment check
https://your-domain.com/api/admin/check-env
```

---

## 🔑 Default Credentials

**⚠️ Change immediately after first login!**

```
Admin:
Email: admin@damdayvillage.org
Password: Admin@123

Host:
Email: host@damdayvillage.org
Password: Host@123
```

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Coolify instance ready
- [ ] Domain configured (or use default)
- [ ] Database credentials prepared
- [ ] Read quick start guide

### Deployment
- [ ] PostgreSQL created in Coolify
- [ ] Database running (green status)
- [ ] Application created from GitHub
- [ ] Dockerfile set to `Dockerfile.simple`
- [ ] Port set to `80`
- [ ] All environment variables configured
- [ ] SSL/HTTPS enabled
- [ ] Domain configured

### Post-Deployment
- [ ] Application deployed successfully
- [ ] Migrations run: `npx prisma migrate deploy`
- [ ] Database seeded: `npm run db:seed`
- [ ] Health check passes
- [ ] Admin login works
- [ ] Password changed
- [ ] Backups configured

---

## 🐛 Quick Troubleshooting

### Build Failed
```bash
# Solution:
1. Check Dockerfile is `Dockerfile.simple`
2. Increase memory to 2GB
3. Enable "Force Rebuild"
```

### Database Connection Failed
```bash
# Check:
1. Database is running (green)
2. DATABASE_URL format correct
3. Use service name: village-db

# Test:
psql $DATABASE_URL
```

### 500 Error on Login
```bash
# Check:
1. NEXTAUTH_URL is actual domain
2. NEXTAUTH_SECRET is set (32+ chars)
3. Run migrations: npx prisma migrate deploy
4. Seed database: npm run db:seed
```

### SSL Not Working
```bash
# Solution:
1. Check DNS points to Coolify server
2. Wait 2-5 minutes for certificate
3. Check Networking → SSL Status
```

---

## 📊 Resource Requirements

**Minimum:**
- Memory: 2GB
- CPU: 2 cores
- Disk: 10GB

**Recommended:**
- Memory: 4GB
- CPU: 4 cores
- Disk: 50GB

---

## 🔒 Security Checklist

- [ ] Strong database password (16+ chars)
- [ ] Unique NEXTAUTH_SECRET (32+ chars)
- [ ] Default admin password changed
- [ ] SSL/HTTPS enabled
- [ ] Database not exposed externally
- [ ] Environment variables secure
- [ ] Backups enabled
- [ ] Logs monitored

---

## 📞 Getting Help

**Documentation:**
- Quick Start: [COOLIFY_QUICK_START.md](./COOLIFY_QUICK_START.md)
- Troubleshooting: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- All Docs: [DEPLOYMENT_INDEX.md](./DEPLOYMENT_INDEX.md)

**Community:**
- GitHub: [Open Issue](https://github.com/damdayvillage-a11y/Village/issues)
- Coolify Discord: [Join](https://coolify.io/discord)

---

## ⏱️ Quick Timeline

| Task | Time |
|------|------|
| Create PostgreSQL | 2 min |
| Deploy application | 5 min |
| Configure environment | 3 min |
| Run migrations & seed | 3 min |
| Verify & test | 2 min |
| **Total** | **15 min** |

---

## 💡 Pro Tips

1. **Use internal database connection** (village-db, not localhost)
2. **Generate strong secrets** (32+ characters)
3. **Enable backups immediately** after deployment
4. **Change default passwords** right after first login
5. **Test health endpoints** before going live
6. **Monitor logs** regularly
7. **Keep documentation handy** for reference

---

## 🎯 Success Indicators

After deployment, verify:
- ✅ `https://your-domain.com` - Homepage loads
- ✅ `https://your-domain.com/api/health` - Returns healthy
- ✅ `https://your-domain.com/admin-panel/login` - No 500 error!
- ✅ SSL/HTTPS working (green padlock)
- ✅ All features functional
- ✅ Performance good

---

**Print this page for quick reference during deployment! 📄**

**Version:** 1.0 | **Updated:** January 2025
