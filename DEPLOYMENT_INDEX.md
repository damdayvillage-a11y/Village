# 📚 Deployment Documentation Index

> **Complete guide to deploying the Village application on various platforms**

## 🎯 Quick Navigation

### For New Deployments

**Coolify (Recommended)** 🌟
- Start here: [Coolify Quick Start](./COOLIFY_QUICK_START.md) - 15 minutes
- Full guide: [Coolify Deployment Guide](./COOLIFY_DEPLOYMENT_GUIDE.md)

**CapRover (Legacy)**
- Start here: [CapRover Quick Fix](./CAPROVER_QUICK_FIX.md)
- Full guide: [CapRover Deployment Guide](./CAPROVER_DEPLOYMENT_GUIDE.md)

### For Migrations

**Moving from CapRover to Coolify**
- Migration guide: [CapRover to Coolify Migration](./CAPROVER_TO_COOLIFY_MIGRATION.md)

### For Troubleshooting

- Issues? [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Environment setup: [Environment Variables Reference](./ENVIRONMENT_VARIABLES.md)

---

## 📖 Complete Documentation List

### Coolify Deployment

| Document | Description | Time Required | Difficulty |
|----------|-------------|---------------|------------|
| [Coolify Quick Start](./COOLIFY_QUICK_START.md) | Fast deployment guide | 15 min | ⭐⭐☆☆☆ |
| [Coolify Deployment Guide](./COOLIFY_DEPLOYMENT_GUIDE.md) | Complete deployment instructions | 30-45 min | ⭐⭐⭐☆☆ |
| [CapRover to Coolify Migration](./CAPROVER_TO_COOLIFY_MIGRATION.md) | Migrate from CapRover | 2-4 hours | ⭐⭐⭐☆☆ |
| [Docker Compose (Coolify)](./docker-compose.coolify.yml) | Docker Compose configuration | - | - |
| [.env.coolify](./.env.coolify) | Environment variables template | - | - |

### CapRover Deployment (Legacy)

| Document | Description | Time Required | Difficulty |
|----------|-------------|---------------|------------|
| [CapRover Quick Fix](./CAPROVER_QUICK_FIX.md) | Fix "something bad" errors | 5 min | ⭐⭐☆☆☆ |
| [CapRover Deployment Guide](./CAPROVER_DEPLOYMENT_GUIDE.md) | Complete CapRover guide | 30-45 min | ⭐⭐⭐☆☆ |
| [CapRover Admin Panel Fix](./CAPROVER_ADMIN_PANEL_FIX.md) | Fix admin panel 500 errors | 10-15 min | ⭐⭐☆☆☆ |
| [CapRover Step-by-Step](./CAPROVER_STEP_BY_STEP.md) | Detailed step-by-step guide | 20-30 min | ⭐⭐☆☆☆ |
| [CapRover Env Check](./CAPROVER_ENV_CHECK.md) | Environment validation | 5 min | ⭐☆☆☆☆ |
| [.env.caprover](./.env.caprover) | CapRover environment template | - | - |

### General Documentation

| Document | Description | When to Use |
|----------|-------------|-------------|
| [Environment Variables Reference](./ENVIRONMENT_VARIABLES.md) | Complete environment variables guide | Setting up any deployment |
| [Troubleshooting Guide](./TROUBLESHOOTING.md) | Solutions to common issues | When facing problems |
| [Changes Summary](./CHANGES.md) | What was fixed and changed | Understanding recent updates |
| [Deployment Fix Summary](./DEPLOYMENT_FIX_SUMMARY.md) | Summary of deployment fixes | Reference for fixes made |
| [Production Diagnostic Tools](./PRODUCTION_DIAGNOSTIC_TOOLS.md) | Diagnostic endpoints and tools | Monitoring and debugging |

---

## 🚀 Deployment Workflows

### New Deployment on Coolify

```mermaid
graph TD
    A[Start] --> B[Read Quick Start Guide]
    B --> C[Create PostgreSQL Database]
    C --> D[Deploy Application]
    D --> E[Configure Environment Variables]
    E --> F[Setup Networking & SSL]
    F --> G[Run Migrations]
    G --> H[Seed Database]
    H --> I[Verify Health Checks]
    I --> J[Test Admin Login]
    J --> K[Success!]
```

**Steps:**
1. [Coolify Quick Start](./COOLIFY_QUICK_START.md) (15 min)
2. Follow step-by-step instructions
3. Verify everything works
4. Done! ✅

---

### New Deployment on CapRover

```mermaid
graph TD
    A[Start] --> B[Read Quick Fix Guide]
    B --> C[Deploy Application]
    C --> D[Fix Environment Variables]
    D --> E[Replace ALL Placeholders]
    E --> F[Setup Database]
    F --> G[Run Migrations]
    G --> H[Create Admin User]
    H --> I[Verify Health]
    I --> J[Test Admin Panel]
    J --> K[Success!]
```

**Steps:**
1. [CapRover Quick Fix](./CAPROVER_QUICK_FIX.md) (5 min)
2. [CapRover Deployment Guide](./CAPROVER_DEPLOYMENT_GUIDE.md) (30-45 min)
3. Fix all `$$cap_*$$` placeholders
4. Test and verify
5. Done! ✅

---

### Migration from CapRover to Coolify

```mermaid
graph TD
    A[Start] --> B[Backup CapRover Data]
    B --> C[Document Current Setup]
    C --> D[Setup Coolify Project]
    D --> E[Create Database in Coolify]
    E --> F[Import or Fresh Start]
    F --> G[Deploy Application]
    G --> H[Configure Environment]
    H --> I[Run Migrations]
    I --> J[Test Everything]
    J --> K[Update DNS]
    K --> L[Decommission CapRover]
    L --> M[Success!]
```

**Steps:**
1. [CapRover to Coolify Migration](./CAPROVER_TO_COOLIFY_MIGRATION.md) (2-4 hours)
2. Follow migration checklist
3. Test thoroughly
4. Switch DNS when ready
5. Done! ✅

---

## 🔍 Finding What You Need

### "I'm new and want to deploy quickly"

→ Start with [Coolify Quick Start](./COOLIFY_QUICK_START.md)

### "I have CapRover errors (500, build hangs)"

→ Read [CapRover Quick Fix](./CAPROVER_QUICK_FIX.md) or [CapRover Admin Panel Fix](./CAPROVER_ADMIN_PANEL_FIX.md)

### "I want to migrate from CapRover to Coolify"

→ Follow [CapRover to Coolify Migration](./CAPROVER_TO_COOLIFY_MIGRATION.md)

### "I'm getting specific errors"

→ Check [Troubleshooting Guide](./TROUBLESHOOTING.md)

### "I need to configure environment variables"

→ Read [Environment Variables Reference](./ENVIRONMENT_VARIABLES.md)

### "I want to understand what changed"

→ See [Changes Summary](./CHANGES.md) or [Deployment Fix Summary](./DEPLOYMENT_FIX_SUMMARY.md)

### "I need diagnostic tools"

→ Use [Production Diagnostic Tools](./PRODUCTION_DIAGNOSTIC_TOOLS.md)

---

## 📝 Checklists

### Pre-Deployment Checklist

- [ ] Choose platform (Coolify recommended)
- [ ] Have domain ready (or use platform default)
- [ ] Have database credentials prepared
- [ ] Read deployment guide for your platform
- [ ] Understand environment variables needed
- [ ] Have backup plan if issues occur

### Deployment Checklist

- [ ] Database created and running
- [ ] Application deployed successfully
- [ ] All environment variables set
- [ ] No placeholder values remaining
- [ ] Migrations run successfully
- [ ] Admin user created/verified
- [ ] Health checks passing
- [ ] Admin panel accessible
- [ ] SSL/HTTPS working
- [ ] Default passwords changed

### Post-Deployment Checklist

- [ ] All features tested
- [ ] Performance acceptable
- [ ] Logs reviewed (no errors)
- [ ] Backups configured
- [ ] Monitoring set up (optional)
- [ ] Team notified of new URL
- [ ] Documentation updated
- [ ] Old deployment decommissioned (if migrating)

---

## 🎯 Platform Comparison

### Why Choose Coolify?

✅ **Pros:**
- Modern, intuitive interface
- No placeholder variable issues
- Built-in backup system
- Better resource management
- Automatic SSL/HTTPS
- Active development
- Better logging and monitoring

❌ **Cons:**
- Newer platform (less mature)
- Smaller community than CapRover
- May need to install on your own server

**Best For:**
- New deployments
- Users wanting simplicity
- Teams needing better monitoring
- Projects with backup requirements

---

### Why Choose CapRover?

✅ **Pros:**
- Well-established platform
- Large community
- Many one-click apps
- Good documentation
- Battle-tested

❌ **Cons:**
- Placeholder variable issues (`$$cap_*$$`)
- More complex environment setup
- Manual backup configuration
- Admin panel 500 errors (if misconfigured)

**Best For:**
- Existing CapRover deployments
- Users familiar with CapRover
- Scenarios where migration isn't needed

---

## 🆘 Getting Help

### Documentation Issues

If you find issues with documentation:
1. Check if there's a newer version
2. Search existing GitHub issues
3. Open new issue with specific problem

### Deployment Issues

If you face deployment problems:
1. Check [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. Review platform-specific guide
3. Check platform logs for errors
4. Collect diagnostic information
5. Open GitHub issue with details

### Community Support

- **GitHub Issues:** [Repository Issues](https://github.com/damdayvillage-a11y/Village/issues)
- **Coolify Discord:** [Join Here](https://coolify.io/discord)
- **Documentation:** You're reading it! 📚

---

## 🔄 Documentation Updates

This documentation is continuously updated. Last updates:

- **2025-01-10:** Added comprehensive Coolify guides
- **2025-01-10:** Added migration guide from CapRover
- **2025-01-10:** Added environment variables reference
- **2025-01-10:** Added troubleshooting guide
- Previous: Various CapRover fixes and guides

Check the repository for the latest version.

---

## 📋 Quick Reference

### Essential Commands

```bash
# Validate environment
npm run validate:env

# Verify admin user
npm run admin:verify

# Run migrations
npx prisma migrate deploy

# Seed database
npm run db:seed

# Generate Prisma client
npm run db:generate

# Health check
curl https://your-domain.com/api/health

# Auth status
curl https://your-domain.com/api/auth/status
```

### Environment Variables (Core)

```bash
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=[32+ chars]
DATABASE_URL=postgresql://user:pass@host:5432/db
NEXT_TELEMETRY_DISABLED=1
CI=true
```

### Default Credentials (Change After First Login!)

```
Admin: admin@damdayvillage.org / Admin@123
Host: host@damdayvillage.org / Host@123
```

---

## 🎓 Learning Path

### Beginner

1. Start with [README.md](./README.md)
2. Follow [Coolify Quick Start](./COOLIFY_QUICK_START.md)
3. Learn about [Environment Variables](./ENVIRONMENT_VARIABLES.md)
4. Keep [Troubleshooting Guide](./TROUBLESHOOTING.md) handy

### Intermediate

1. Read [Coolify Deployment Guide](./COOLIFY_DEPLOYMENT_GUIDE.md)
2. Understand [Environment Variables Reference](./ENVIRONMENT_VARIABLES.md)
3. Learn about [Production Diagnostic Tools](./PRODUCTION_DIAGNOSTIC_TOOLS.md)
4. Review [Changes Summary](./CHANGES.md)

### Advanced

1. Study [Migration Guide](./CAPROVER_TO_COOLIFY_MIGRATION.md)
2. Master [Troubleshooting Guide](./TROUBLESHOOTING.md)
3. Implement custom monitoring
4. Optimize performance
5. Contribute to documentation

---

## 📊 Success Metrics

After successful deployment, you should have:

- ✅ Application accessible via domain
- ✅ SSL/HTTPS working
- ✅ Health check returning healthy
- ✅ Admin panel accessible (no 500 errors!)
- ✅ Database connected and working
- ✅ All features functional
- ✅ Backups configured
- ✅ Monitoring set up (optional)

---

**Version:** 1.0  
**Last Updated:** January 2025  
**Maintained by:** Village Development Team

**Star this repo if you found this documentation helpful! ⭐**
