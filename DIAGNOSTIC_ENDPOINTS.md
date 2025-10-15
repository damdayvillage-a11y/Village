# Diagnostic Endpoints and Tools

This document lists all available diagnostic endpoints and tools for troubleshooting your deployment.

---

## 🌐 Browser-Accessible Endpoints

Visit these URLs in your browser for instant diagnostics:

### System Status & Health

| Endpoint | Description | When to Use |
|----------|-------------|-------------|
| `/admin-panel/status` | Complete system health dashboard | Check overall system status with visual UI |
| `/api/health` | API health check (JSON) | Automated health monitoring |
| `/api/auth/status` | Authentication system status | Diagnose login/auth issues |
| `/api/admin/check-env` | Environment variable validation | Verify all required env vars are set |
| `/api/admin/verify-setup` | Admin user verification | Check if admin user exists and is configured |

### Help Pages

| Endpoint | Description | Language |
|----------|-------------|----------|
| `/help/admin-500` | Quick fix guide for 500 errors | English |
| `/help/admin-500-hi` | Quick fix guide for 500 errors | हिंदी (Hindi) |

### Admin User Management

| Endpoint | Description | Method |
|----------|-------------|--------|
| `/api/admin/init` | Create admin user automatically | GET or POST |

---

## 🖥️ Command-Line Tools

Run these commands in your terminal or container shell:

### Diagnostic Commands

```bash
# Comprehensive CapRover diagnostic
npm run caprover:diagnose <domain>
# Example: npm run caprover:diagnose https://village.captain.yourdomain.com

# Validate environment variables
npm run validate:env

# Verify admin user exists
npm run admin:verify

# Test database connection
npm run db:test

# Diagnose admin login issues (remote)
npm run admin:diagnose <domain>
# Example: npm run admin:diagnose https://village.captain.yourdomain.com
```

### Database Commands

```bash
# Run database migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Create seed data and admin user
npm run db:seed

# Open Prisma Studio (development only)
npm run db:studio
```

### Build & Deployment Commands

```bash
# Validate TypeScript without building
npm run type-check

# Run linter
npm run lint

# Run tests
npm run test

# Build for production
npm run build

# Start production server
npm start
```

---

## 📋 Diagnostic Endpoint Details

### 1. `/admin-panel/status`

**Purpose:** Visual system health dashboard

**What it shows:**
- ✅/❌ Environment variable configuration status
- ✅/❌ Database connectivity
- ✅/❌ Admin user existence
- ✅/❌ Authentication service status
- Recommended actions for any issues
- Quick command reference

**Best for:** 
- Quick visual overview
- Non-technical users
- First-time troubleshooting

**Example Response:** Interactive HTML page with status cards

---

### 2. `/api/health`

**Purpose:** API health check for monitoring systems

**What it returns (JSON):**
```json
{
  "status": "healthy" | "degraded" | "unhealthy",
  "timestamp": "2025-10-15T09:00:00.000Z",
  "services": {
    "database": {
      "status": "healthy" | "unhealthy" | "skip",
      "message": "Database connected"
    },
    "api": {
      "status": "healthy",
      "message": "API is operational"
    }
  }
}
```

**Best for:**
- Automated monitoring (Prometheus, DataDog, etc.)
- Load balancer health checks
- CI/CD pipeline validation

---

### 3. `/api/auth/status`

**Purpose:** Detailed authentication system diagnostics

**What it returns (JSON):**
```json
{
  "status": "healthy" | "degraded" | "misconfigured",
  "healthy": true | false,
  "checks": {
    "timestamp": "2025-10-15T09:00:00.000Z",
    "environment": "production",
    "nextauth_url": {
      "configured": true,
      "value": "OK" | "error message"
    },
    "nextauth_secret": {
      "configured": true,
      "length": 44,
      "valid": true
    },
    "database": {
      "configured": true,
      "connected": true,
      "admin_exists": true,
      "message": "Admin user found (role: ADMIN, active: true, verified: true)"
    }
  },
  "recommendations": [
    "List of recommended actions if issues found"
  ],
  "help": "URL to documentation if needed"
}
```

**Best for:**
- Diagnosing 500 errors on login
- Verifying authentication setup
- API-based troubleshooting

---

### 4. `/api/admin/check-env`

**Purpose:** Validate environment variable configuration

**What it returns (JSON):**
```json
{
  "configured": true | false,
  "hasErrors": false,
  "hasWarnings": false,
  "checkedVars": 3,
  "message": "All required environment variables are configured",
  "errors": [],
  "warnings": [],
  "details": {
    "NEXTAUTH_URL": {
      "status": "ok",
      "message": "Configured"
    },
    "NEXTAUTH_SECRET": {
      "status": "ok",
      "message": "Configured"
    },
    "DATABASE_URL": {
      "status": "ok",
      "message": "Configured"
    },
    "NODE_ENV": {
      "status": "ok",
      "value": "production",
      "message": "Production mode"
    }
  },
  "recommendations": [
    "List of recommended actions"
  ]
}
```

**Best for:**
- Verifying CapRover placeholder replacement
- Checking production configuration
- Pre-deployment validation

---

### 5. `/api/admin/verify-setup`

**Purpose:** Verify admin user configuration

**What it returns (JSON):**
```json
{
  "configured": true | false,
  "adminExists": true | false,
  "email": "admin@damdayvillage.org",
  "role": "ADMIN",
  "active": true,
  "verified": true,
  "issues": [],
  "recommendations": [
    "Admin user is properly configured"
  ]
}
```

**Best for:**
- Checking admin user status
- Verifying user permissions
- Troubleshooting login failures

---

### 6. `/api/admin/init`

**Purpose:** Create default admin user

**Methods:** GET or POST

**What it does:**
- Checks if admin user already exists
- Creates admin user if doesn't exist
- Returns credentials

**Example Response (Success):**
```json
{
  "success": true,
  "message": "Admin user created successfully",
  "admin": {
    "id": "...",
    "email": "admin@damdayvillage.org",
    "name": "Village Administrator",
    "role": "ADMIN"
  },
  "credentials": {
    "email": "admin@damdayvillage.org",
    "password": "Admin@123",
    "warning": "⚠️ IMPORTANT: Change this password immediately after first login!"
  }
}
```

**Example Response (Already Exists):**
```json
{
  "success": true,
  "message": "Admin user already exists",
  "admin": {
    "email": "admin@damdayvillage.org",
    "role": "ADMIN"
  },
  "credentials": {
    "email": "admin@damdayvillage.org",
    "note": "Use your configured password or default: Admin@123"
  }
}
```

**Best for:**
- First-time setup
- Recovering from missing admin user
- Automated deployment scripts

---

## 🔍 Command-Line Tool Details

### `npm run caprover:diagnose`

**Full diagnostic suite for CapRover deployments**

**Usage:**
```bash
npm run caprover:diagnose [domain]
# Example: npm run caprover:diagnose https://village.captain.yourdomain.com
```

**What it checks:**
- ✅ Local environment variables
- ✅ Placeholder detection
- ✅ Remote endpoint accessibility
- ✅ Database connectivity
- ✅ Admin user existence

**Output:** Comprehensive report with:
- Critical issues (blocking deployment)
- Warnings (non-blocking issues)
- Fix commands for each issue
- Quick fix steps
- Documentation links

---

### `npm run validate:env`

**Validates production environment variables**

**What it checks:**
- Required variables are set
- No dummy/placeholder values
- Proper format and length
- Production-appropriate values

**Exit codes:**
- `0` - All validations passed
- `1` - Critical errors found

---

### `npm run admin:verify`

**Verifies admin user setup**

**What it checks:**
- Admin user exists in database
- Password is set
- User is active and verified
- Role is ADMIN

**Output:**
```
🔍 Verifying admin setup...

✅ Admin user found:
   - Name: Village Administrator
   - Email: admin@damdayvillage.org
   - Role: ADMIN
   - Verified: ✅
   - Active: ✅

✅ Admin password is set
✅ Default password verification successful

🎉 Admin setup verification complete!

🔑 You can now log in with:
   Email: admin@damdayvillage.org
   Password: Admin@123
```

---

### `npm run db:test`

**Tests database connection**

**What it checks:**
- DATABASE_URL is set and valid
- Can connect to database
- Can execute queries
- Admin user exists (optional)

**Output:**
```
🔍 Testing Database Connection

Database URL: postgresql://****@srv-captain--postgres:5432/villagedb
✅ Detected CapRover internal service name (srv-captain--*)

Connection Details:
  Protocol: postgresql
  User: postgres
  Host: srv-captain--postgres
  Port: 5432
  Database: villagedb

Attempting to connect to database...

✅ Database connection successful!
✅ Admin user exists: admin@damdayvillage.org
```

---

## 🚨 Troubleshooting Workflow

### When you get a 500 error:

1. **Quick Check (Browser):**
   ```
   Visit: https://your-domain.com/admin-panel/status
   ```
   - Shows visual status of all systems
   - Provides immediate recommendations

2. **Detailed API Check (Browser or curl):**
   ```bash
   curl https://your-domain.com/api/auth/status
   ```
   - Returns detailed JSON diagnostics
   - Shows exactly what's misconfigured

3. **Environment Validation (Container):**
   ```bash
   docker exec -it $(docker ps | grep captain-village | awk '{print $1}') sh
   npm run validate:env
   ```
   - Validates all environment variables
   - Detects placeholders and dummy values

4. **Database Check (Container):**
   ```bash
   npm run db:test
   ```
   - Verifies database connectivity
   - Checks admin user exists

5. **Full Diagnostic (Container):**
   ```bash
   npm run caprover:diagnose https://your-domain.com
   ```
   - Comprehensive system check
   - Generates detailed report with fixes

---

## 📚 Related Documentation

- **[CAPROVER_500_FIX_GUIDE.md](./CAPROVER_500_FIX_GUIDE.md)** - Step-by-step fix guide (English)
- **[CAPROVER_500_FIX_GUIDE_HINDI.md](./CAPROVER_500_FIX_GUIDE_HINDI.md)** - हिंदी में गाइड
- **[QUICK_START_CAPROVER.md](./QUICK_START_CAPROVER.md)** - Quick start guide
- **[CAPGUIDE.md](./CAPGUIDE.md)** - Complete CapRover deployment guide
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - General troubleshooting

---

**Last Updated:** 2025-10-15
**Version:** 1.0.0
