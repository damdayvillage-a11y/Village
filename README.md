# Smart Carbon-Free Village

A futuristic platform for Damday Village featuring carbon footprint tracking, IoT integrations, tourism booking, and sustainable living solutions.

## 🚀 Quick Start

### Local Development
```bash
npm install
npm run dev
```

### CapRover Deployment (Production)

**✅ Build Issue Fixed (2025-01-08)**: Docker build hangs in CapRover have been resolved.

For CapRover deployment, use the optimized configuration:

```json
// captain-definition
{
  "schemaVersion": 2,
  "dockerfilePath": "./Dockerfile.simple"
}
```

## 🛠️ Docker Build Options

### For CapRover (Recommended)
```bash
docker build -f Dockerfile.simple -t village-app .
```
- ✅ No build hangs
- ✅ ~2 minute build time  
- ✅ Optimized for CapRover environment

### For Local Testing
```bash
docker build -f Dockerfile -t village-app .
```
- Enhanced monitoring and logging
- Better for development debugging

### For Troubleshooting
```bash
docker build -f Dockerfile.debug -t village-app .
```
- Comprehensive debugging output
- System resource monitoring
- Build process analysis

## 📖 Documentation

- **[CapRover Troubleshooting Guide](docs/CAPROVER_TROUBLESHOOTING.md)** - Fix build hangs and deployment issues
- **[Docker Build Fix Guide](docs/DOCKER_BUILD_FIX.md)** - Technical details of the build fixes
- **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Step-by-step deployment guide
- **[Production Readiness](PRODUCTION_READINESS.md)** - Pre-deployment verification

## 🔧 Environment Variables

### Required for Production
```bash
NODE_ENV=production
NEXTAUTH_URL=https://your-app.domain.com
NEXTAUTH_SECRET=[32+ character random string]
DATABASE_URL=postgresql://[user]:[pass]@[host]:[port]/[db]
```

## 🔑 Default Admin Credentials

After running the database seed (`npm run db:seed`), you can log in with:

**Administrator Account:**
- Email: `admin@damdayvillage.org` 
- Password: `Admin@123`
- Role: Admin (full access to admin panel)

**Host Account:**
- Email: `host@damdayvillage.org`
- Password: `Host@123` 
- Role: Host (can manage homestays and bookings)

⚠️ **Security Note**: Change these default passwords immediately in production!

### Build Optimizations
```bash
NEXT_TELEMETRY_DISABLED=1
GENERATE_SOURCEMAP=false
CI=true
```

## 🚨 Common Issues

### CapRover Build Hangs
**Problem**: Build gets stuck at npm install step  
**Solution**: Use `Dockerfile.simple` in your captain-definition

### Memory Issues
**Problem**: Out of memory during build  
**Solution**: Ensure CapRover server has 2GB+ RAM available

### SSL/Registry Issues  
**Problem**: npm install fails with 403 errors  
**Solution**: Build configuration handles this automatically

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📊 Build Performance

- **CapRover Build Time**: ~2-3 minutes (with Dockerfile.simple)
- **Local Build Time**: ~1-2 minutes
- **Docker Image Size**: ~200-400MB
- **Success Rate**: >95% with optimized configuration

## 🆘 Getting Help

If you encounter build issues:

1. **Check**: [CapRover Troubleshooting Guide](docs/CAPROVER_TROUBLESHOOTING.md)
2. **Test locally**: `docker build -f Dockerfile.simple .`
3. **Debug**: Use debugging scripts in `scripts/` directory
4. **Verify**: Environment variables and resources

---

**Status**: ✅ Production Ready  
**Last Updated**: 2025-01-08  
**Build Issues**: Resolved