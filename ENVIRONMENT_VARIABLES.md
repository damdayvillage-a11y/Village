# 🔧 Environment Variables Reference

> **Complete guide to all environment variables for the Village application**

## 📋 Table of Contents

1. [Required Variables](#required-variables)
2. [Optional Variables](#optional-variables)
3. [Build-Time Variables](#build-time-variables)
4. [Service-Specific Variables](#service-specific-variables)
5. [Validation](#validation)

---

## ✅ Required Variables

These variables **MUST** be set for the application to work:

### 1. NODE_ENV

**Description:** Application environment mode  
**Format:** String  
**Valid Values:** `development`, `production`, `test`  
**Example:** `production`  
**Required:** Yes

```bash
NODE_ENV=production
```

**Purpose:**
- Controls optimization and caching
- Affects logging verbosity
- Enables production optimizations

---

### 2. NEXTAUTH_URL

**Description:** Full URL where your application is hosted  
**Format:** Complete URL with protocol  
**Example:** `https://village.yourdomain.com`  
**Required:** Yes  
**Critical:** Must be your actual domain!

```bash
# Production
NEXTAUTH_URL=https://village.yourdomain.com

# Staging
NEXTAUTH_URL=https://staging.village.yourdomain.com

# Local development
NEXTAUTH_URL=http://localhost:3000
```

**⚠️ Common Mistakes:**
- ❌ `NEXTAUTH_URL=http://localhost:3000` (in production)
- ❌ `NEXTAUTH_URL=$$cap_appname$$.$$cap_root_domain$$` (placeholder)
- ❌ `NEXTAUTH_URL=your-domain.com` (missing protocol)
- ✅ `NEXTAUTH_URL=https://village.yourdomain.com` (correct!)

**Purpose:**
- Used by NextAuth.js for callbacks
- Required for OAuth providers
- Used in email templates
- Session cookie configuration

---

### 3. NEXTAUTH_SECRET

**Description:** Secret key for encrypting sessions and tokens  
**Format:** Random string, minimum 32 characters  
**Example:** `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`  
**Required:** Yes  
**Critical:** Must be unique and secret!

```bash
NEXTAUTH_SECRET=your-generated-secret-here-minimum-32-characters
```

**Generate with:**
```bash
# Method 1: OpenSSL (recommended)
openssl rand -base64 32

# Method 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Method 3: Online generator (not recommended for production)
# Use: https://generate-secret.vercel.app/32
```

**⚠️ Common Mistakes:**
- ❌ `NEXTAUTH_SECRET=change-me` (too short, not secret)
- ❌ `NEXTAUTH_SECRET=dummy-secret-for-build` (placeholder)
- ❌ Using same secret across environments
- ✅ Unique, random, 32+ character string

**Purpose:**
- Encrypts session cookies
- Signs JWT tokens
- Encrypts sensitive data
- Security critical!

---

### 4. DATABASE_URL

**Description:** PostgreSQL database connection string  
**Format:** PostgreSQL connection URI  
**Example:** `postgresql://user:password@host:5432/database`  
**Required:** Yes

```bash
# Coolify (internal connection)
DATABASE_URL=postgresql://villageuser:SecurePassword123@village-db:5432/villagedb

# CapRover (with prefix)
DATABASE_URL=postgresql://postgres:password@srv-captain--postgres:5432/villagedb

# External database
DATABASE_URL=postgresql://user:pass@db.example.com:5432/villagedb

# With connection pooling
DATABASE_URL=postgresql://user:pass@host:5432/db?connection_limit=10&pool_timeout=30

# Local development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/village_dev
```

**Format Breakdown:**
```
postgresql://[username]:[password]@[host]:[port]/[database]?[options]
```

**⚠️ Common Mistakes:**
- ❌ `DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy` (build-time dummy)
- ❌ Wrong host name (use internal service name in Coolify/CapRover)
- ❌ Incorrect port (PostgreSQL default is 5432)
- ❌ Wrong password (must match database password)
- ✅ Use internal connection when in same network

**Purpose:**
- Connects to PostgreSQL database
- Used by Prisma ORM
- Handles all data operations
- Connection pooling

**Optional Parameters:**
```bash
# Connection pooling
?connection_limit=10
?pool_timeout=30

# SSL mode
?sslmode=require
?sslmode=prefer

# Schema
?schema=public

# Combined
?connection_limit=10&pool_timeout=30&sslmode=require
```

---

## 🔧 Build-Time Variables

These optimize the build process:

### NEXT_TELEMETRY_DISABLED

**Description:** Disable Next.js telemetry  
**Format:** 1 or 0  
**Default:** 0  
**Recommended:** 1 (for faster builds)

```bash
NEXT_TELEMETRY_DISABLED=1
```

**Purpose:** Speeds up builds by skipping telemetry

---

### GENERATE_SOURCEMAP

**Description:** Generate source maps for debugging  
**Format:** true or false  
**Default:** true  
**Recommended:** false (in production)

```bash
GENERATE_SOURCEMAP=false
```

**Purpose:** Reduces build size and time

---

### CI

**Description:** Indicates CI/CD environment  
**Format:** true or false  
**Default:** false  
**Recommended:** true (in production builds)

```bash
CI=true
```

**Purpose:** 
- Optimizes build for CI/CD
- Stricter error handling
- No interactive prompts

---

### TYPESCRIPT_NO_TYPE_CHECK

**Description:** Skip TypeScript type checking during build  
**Format:** true or false  
**Default:** false  
**Use:** Only if build hangs

```bash
TYPESCRIPT_NO_TYPE_CHECK=true
```

**Purpose:** Speeds up builds (use only if needed)

---

### DISABLE_ESLINT

**Description:** Skip ESLint during build  
**Format:** true or false  
**Default:** false  
**Use:** Only if build fails on lint errors

```bash
DISABLE_ESLINT=true
```

**Purpose:** Allows build to proceed despite lint warnings

---

## 💳 Payment Provider Variables

### Stripe

**Description:** Stripe payment integration  
**Required:** Only if using Stripe  
**Get Keys:** https://dashboard.stripe.com/apikeys

```bash
# Test mode
STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...

# Live mode
STRIPE_PUBLISHABLE_KEY=pk_live_51...
STRIPE_SECRET_KEY=sk_live_51...

# Webhook secret
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Purpose:**
- Process credit card payments
- Handle subscriptions
- Manage refunds
- Webhook events

---

### Razorpay

**Description:** Razorpay payment integration (India)  
**Required:** Only if using Razorpay  
**Get Keys:** https://dashboard.razorpay.com/app/keys

```bash
# Test mode
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_SECRET=...

# Live mode
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_SECRET=...

# Webhook secret
RAZORPAY_WEBHOOK_SECRET=...
```

**Purpose:**
- Process UPI payments
- Credit/debit card payments
- Net banking
- Wallet payments

---

## 🔐 OAuth Provider Variables

### Google OAuth

**Description:** Google Sign-In integration  
**Required:** Only if using Google OAuth  
**Setup:** https://console.cloud.google.com/apis/credentials

```bash
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
```

**Callback URL to configure:**
```
https://your-domain.com/api/auth/callback/google
```

---

### GitHub OAuth

**Description:** GitHub Sign-In integration  
**Required:** Only if using GitHub OAuth  
**Setup:** https://github.com/settings/applications/new

```bash
GITHUB_CLIENT_ID=Iv1.1234567890abcdef
GITHUB_CLIENT_SECRET=1234567890abcdef...
```

**Callback URL to configure:**
```
https://your-domain.com/api/auth/callback/github
```

---

## 📧 Email Service Variables

### SMTP Configuration

**Description:** Email sending via SMTP  
**Required:** Only if sending emails  
**Providers:** SendGrid, Mailgun, Gmail, etc.

```bash
# SMTP server details
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password

# From address
EMAIL_FROM=noreply@yourdomain.com

# Optional: Secure connection
EMAIL_SERVER_SECURE=false
```

**Common Providers:**

```bash
# Gmail
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587

# SendGrid
EMAIL_SERVER_HOST=smtp.sendgrid.net
EMAIL_SERVER_PORT=587

# Mailgun
EMAIL_SERVER_HOST=smtp.mailgun.org
EMAIL_SERVER_PORT=587

# AWS SES
EMAIL_SERVER_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_SERVER_PORT=587
```

**Purpose:**
- Send verification emails
- Password reset emails
- Booking confirmations
- Notifications

---

## 🌐 IoT/MQTT Variables

### MQTT_BROKER_URL

**Description:** MQTT broker for IoT devices  
**Format:** MQTT connection URL  
**Required:** Only if using IoT features

```bash
# Local Mosquitto
MQTT_BROKER_URL=mqtt://localhost:1883

# Remote broker
MQTT_BROKER_URL=mqtt://broker.example.com:1883

# With authentication
MQTT_BROKER_URL=mqtt://username:password@broker.example.com:1883

# Secure connection (MQTTS)
MQTT_BROKER_URL=mqtts://broker.example.com:8883
```

**Purpose:**
- Connect to IoT devices
- Receive sensor data
- Send commands to devices
- Real-time monitoring

---

## 📊 Optional Feature Variables

### Analytics

```bash
# Google Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Plausible Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
```

---

### Monitoring

```bash
# Sentry error tracking
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ENVIRONMENT=production

# Log level
LOG_LEVEL=info
```

---

### Storage

```bash
# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abcdefg

# AWS S3
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

---

### Web3/Blockchain

```bash
# Enable Web3 features
ENABLE_WEB3=false

# Polygon/Ethereum provider
WEB3_PROVIDER_URL=https://polygon-mumbai.g.alchemy.com/v2/your-key

# Private key for contract interactions (NEVER COMMIT!)
PRIVATE_KEY=0x...

# Contract addresses
NFT_CONTRACT_ADDRESS=0x...
TOKEN_CONTRACT_ADDRESS=0x...
```

---

## 🔍 Validation

### Validate Your Configuration

Run the validation script:

```bash
npm run validate:env
```

This checks:
- ✅ All required variables are set
- ✅ No dummy/placeholder values
- ✅ Correct formats (URLs, secrets, etc.)
- ✅ Minimum lengths for secrets
- ⚠️ Warnings for optional variables

**Expected Output:**

```
🔍 Validating production environment variables...

✅ All required variables are set
✅ No dummy values detected
✅ All formats are correct
✅ Secrets meet minimum length requirements

✓ Environment is ready for production!
```

---

### Check Environment Endpoint

Visit the diagnostic endpoint:

```
https://your-domain.com/api/admin/check-env
```

**Response:**
```json
{
  "status": "valid",
  "errors": [],
  "warnings": [],
  "checks": {
    "NEXTAUTH_URL": {"valid": true},
    "NEXTAUTH_SECRET": {"valid": true, "length": 44},
    "DATABASE_URL": {"valid": true, "connected": true}
  }
}
```

---

## 📝 Environment Templates

### .env.production (Template)

```bash
# === REQUIRED CORE VARIABLES ===
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
DATABASE_URL=postgresql://user:password@host:5432/database

# === BUILD OPTIMIZATION ===
NEXT_TELEMETRY_DISABLED=1
GENERATE_SOURCEMAP=false
CI=true

# === PAYMENT PROVIDERS (Optional) ===
# STRIPE_PUBLISHABLE_KEY=pk_live_...
# STRIPE_SECRET_KEY=sk_live_...
# RAZORPAY_KEY_ID=rzp_live_...
# RAZORPAY_SECRET=...

# === OAUTH PROVIDERS (Optional) ===
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
# GITHUB_CLIENT_ID=...
# GITHUB_CLIENT_SECRET=...

# === EMAIL SERVICE (Optional) ===
# EMAIL_SERVER_HOST=smtp.example.com
# EMAIL_SERVER_PORT=587
# EMAIL_FROM=noreply@yourdomain.com

# === IOT/MQTT (Optional) ===
# MQTT_BROKER_URL=mqtt://broker.example.com:1883
```

---

### .env.development (Template)

```bash
# === DEVELOPMENT ENVIRONMENT ===
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-at-least-32-characters-long
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/village_dev

# === BUILD OPTIMIZATION ===
NEXT_TELEMETRY_DISABLED=1
GENERATE_SOURCEMAP=true

# === PAYMENT PROVIDERS (Test Mode) ===
# STRIPE_PUBLISHABLE_KEY=pk_test_...
# STRIPE_SECRET_KEY=sk_test_...
# RAZORPAY_KEY_ID=rzp_test_...
# RAZORPAY_SECRET=...

# === LOCAL SERVICES ===
# MQTT_BROKER_URL=mqtt://localhost:1883
```

---

## ⚠️ Security Best Practices

### DO:
- ✅ Use strong, unique passwords
- ✅ Generate random secrets (32+ chars)
- ✅ Use different values for staging/production
- ✅ Store secrets securely (password manager)
- ✅ Rotate secrets regularly
- ✅ Use environment-specific values
- ✅ Enable SSL/HTTPS in production

### DON'T:
- ❌ Commit `.env` files to Git
- ❌ Share secrets in plain text
- ❌ Use same secrets across environments
- ❌ Use short or simple passwords
- ❌ Use placeholder values in production
- ❌ Leave default passwords unchanged
- ❌ Expose DATABASE_URL publicly

---

## 🆘 Troubleshooting

### "Environment variable not set"

**Solution:**
1. Check variable name spelling
2. Ensure no typos
3. Restart application after adding
4. Verify in Coolify/CapRover dashboard

### "Invalid NEXTAUTH_URL"

**Solution:**
1. Must include protocol (`https://`)
2. Must be your actual domain
3. No trailing slash
4. Match your deployment URL

### "Database connection failed"

**Solution:**
1. Verify DATABASE_URL format
2. Check database is running
3. Verify password is correct
4. Use internal connection in same network

### "NextAuth secret too short"

**Solution:**
1. Must be minimum 32 characters
2. Generate with: `openssl rand -base64 32`
3. Use random, unpredictable string

---

## 📚 Additional Resources

- [Coolify Deployment Guide](./COOLIFY_DEPLOYMENT_GUIDE.md)
- [CapRover Migration Guide](./CAPROVER_TO_COOLIFY_MIGRATION.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)

---

**Version:** 1.0  
**Last Updated:** January 2025  
**Maintained by:** Village Development Team
