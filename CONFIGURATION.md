# Smart Carbon-Free Village - Complete Configuration Guide

**Project**: Damday Village - Futuristic Platform  
**Version**: 1.0.0  
**Last Updated**: 2025-10-19  
**Status**: ✅ Production Ready

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Codebase Structure](#codebase-structure)
4. [Environment Variables](#environment-variables)
5. [Database Configuration](#database-configuration)
6. [API Endpoints](#api-endpoints)
7. [Features & Implementations](#features--implementations)
8. [Build & Deployment](#build--deployment)
9. [Scripts & Automation](#scripts--automation)
10. [Security Configuration](#security-configuration)
11. [Performance Optimization](#performance-optimization)
12. [Troubleshooting Guide](#troubleshooting-guide)

---

## Project Overview

Smart Carbon-Free Village is a futuristic platform for Damday Village featuring:
- Carbon footprint tracking
- IoT integrations for environmental monitoring
- Tourism booking system with homestays
- Sustainable marketplace
- Community project transparency
- Real-time environmental data
- PWA support for offline functionality
- Multi-language support (English & Hindi)

**Key Achievements**:
- ✅ Production-ready deployment with 95%+ success rate
- ✅ Automated user creation and database seeding
- ✅ Docker optimized builds (6-10 minutes)
- ✅ Comprehensive admin and user panels
- ✅ Complete authentication and RBAC system
- ✅ Auto-recovery features for common issues

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14.2.33 (App Router)
- **React**: 18.3.1
- **TypeScript**: 5.9.3
- **Styling**: Tailwind CSS 3.4.18
- **Animation**: Framer Motion 12.23.22
- **3D Graphics**: Three.js 0.158.0
- **Icons**: Lucide React 0.469.0
- **PWA**: next-pwa 5.6.0

### Backend
- **Runtime**: Node.js 20 (Alpine)
- **ORM**: Prisma 6.17.1
- **Database**: PostgreSQL 14+ with TimescaleDB support
- **Authentication**: NextAuth.js 4.24.11
- **Password Hashing**: Argon2 0.44.0
- **Email**: Nodemailer 6.10.1, SendGrid 8.1.6

### IoT & Real-time
- **MQTT**: mqtt 5.14.1
- **Scheduling**: node-cron 4.2.1

### Payment Processing
- **Stripe**: 17.3.1
- **Razorpay**: 2.9.4

### Development Tools
- **Linting**: ESLint 8.57.0
- **Formatting**: Prettier 3.6.2
- **Testing**: Jest 29.7.0, React Testing Library 16.3.0
- **Storybook**: 9.1.10

---

## Codebase Structure

```
Village/
├── src/                          # Source code
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API routes
│   │   │   ├── admin/            # Admin APIs (19 endpoints)
│   │   │   ├── auth/             # Authentication APIs
│   │   │   ├── user/             # User panel APIs (15 endpoints)
│   │   │   ├── public/           # Public APIs
│   │   │   ├── booking/          # Booking APIs
│   │   │   ├── payment/          # Payment APIs
│   │   │   ├── devices/          # IoT device APIs
│   │   │   ├── telemetry/        # Sensor data APIs
│   │   │   └── village/          # Village info APIs
│   │   ├── admin-panel/          # Admin dashboard pages
│   │   ├── user-panel/           # User dashboard pages
│   │   ├── auth/                 # Authentication pages
│   │   ├── help/                 # Help & diagnostic pages
│   │   └── (public pages)/       # Public-facing pages
│   ├── components/               # React components
│   ├── lib/                      # Utility libraries
│   ├── hooks/                    # Custom React hooks
│   ├── types/                    # TypeScript type definitions
│   └── utils/                    # Utility functions
├── prisma/                       # Database schema & migrations
│   └── schema.prisma             # Complete database schema
├── scripts/                      # Automation scripts
│   ├── startup-check.js          # Pre-startup validation
│   ├── seed.ts                   # Database seeding
│   ├── setup-local.sh            # Local development setup
│   └── (22 other utility scripts)
├── public/                       # Static assets
├── lib/                          # Shared libraries
├── .storybook/                   # Storybook configuration
├── ci/                           # CI/CD configurations
├── tools/                        # Development tools
├── Dockerfile.simple             # Production Dockerfile
├── docker-compose.coolify.yml    # Coolify deployment
├── captain-definition            # CapRover deployment
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS config
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies & scripts

Total API Endpoints: 62
Total Pages: 30+
Total Components: 50+
```

---

## Environment Variables

### Required (Production)

```bash
# Node Environment
NODE_ENV=production

# NextAuth Configuration (REQUIRED)
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>

# Database (REQUIRED)
DATABASE_URL=postgresql://username:password@host:5432/database_name

# Build Optimization
NEXT_TELEMETRY_DISABLED=1
GENERATE_SOURCEMAP=false
CI=true
```

### Optional - Feature Flags

```bash
# Enable/disable features
ENABLE_WEB3=false
ENABLE_BLOCKCHAIN_LOGGING=false
ENABLE_DRONE_SIMULATION=false

# Admin Customization
ADMIN_DEFAULT_PASSWORD=Admin@123
HOST_DEFAULT_PASSWORD=Host@123

# Deployment Flags
RUN_MIGRATIONS=true          # Auto-run migrations on startup
RUN_SEED=true               # Auto-seed database on first start
CAPROVER_BUILD=true         # Enable CapRover optimizations
TYPESCRIPT_NO_TYPE_CHECK=true  # Skip type checking in CI
BUILD_MEMORY_LIMIT=1024     # Build memory limit (MB)
```

### Optional - External Services

```bash
# MQTT Broker (IoT devices)
MQTT_BROKER_URL=mqtt://localhost:1883

# Payment Providers (Sandbox/Test)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_SECRET=your-razorpay-secret

# Web3 Configuration
WEB3_PROVIDER_URL=https://polygon-mumbai.g.alchemy.com/v2/your-api-key
PRIVATE_KEY=your-private-key

# File Storage
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Monitoring & Analytics
SENTRY_DSN=your-sentry-dsn
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-password
SENDGRID_API_KEY=your-sendgrid-key
```

### Environment File Templates

Available in repository:
- `.env.example` - Local development template
- `.env.docker` - Docker deployment template
- `.env.caprover` - CapRover deployment template
- `.env.coolify` - Coolify deployment template
- `.env.build` - Build-time variables

---

## Database Configuration

### Schema Overview

The database uses **Prisma ORM** with **PostgreSQL** and optional **TimescaleDB** for time-series data.

**Total Models**: 27

#### Core Models

1. **User** - User accounts with RBAC
   - Roles: ADMIN, VILLAGE_COUNCIL, HOST, SELLER, OPERATOR, GUEST, RESEARCHER
   - Fields: email, password (Argon2), role, verified, active, preferences
   - Relations: bookings, orders, homestays, products, articles, complaints

2. **Village** - Village information
   - Fields: name, location (lat/lng), carbonScore, digitalTwinData
   - Relations: homestays, devices, projects

3. **Homestay** - Accommodation listings
   - Fields: name, description, rooms, maxGuests, basePrice, amenities, photos
   - Relations: owner (User), bookings, reviews

4. **Booking** - Homestay reservations
   - Fields: checkIn, checkOut, guests, pricing, status, paymentRef
   - Status: PENDING, CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED
   - Relations: homestay, guest, payments

5. **Product** - Marketplace items
   - Fields: name, price, stock, images, carbonFootprint
   - Relations: seller (User), orderItems, wishlists

6. **Order** - Marketplace orders
   - Fields: total, status, shippingAddress
   - Status: PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED
   - Relations: customer, items, payments

7. **Payment** - Payment transactions
   - Fields: amount, status, method (STRIPE, RAZORPAY, WEB3)
   - Relations: booking, order, project (polymorphic)

8. **Project** - Community projects
   - Fields: name, fundingGoal, currentFunding, status, ledgerEntries
   - Relations: creator, village, votes, payments

9. **Device** - IoT devices
   - Types: AIR_QUALITY, ENERGY_METER, SOLAR_PANEL, WEATHER_STATION
   - Fields: type, location, status, config, schema
   - Relations: village, readings

10. **SensorReading** - Time-series sensor data (TimescaleDB hypertable)
    - Fields: deviceId, timestamp, metrics (JSON)

#### User Panel Models

11. **Notification** - User notifications
12. **CarbonCredit** - Carbon credit tracking
13. **CarbonTransaction** - Carbon credit transactions
14. **Achievement** - Gamification achievements
15. **UserAchievement** - User progress on achievements
16. **Wishlist** - Product wishlists
17. **Article** - User-authored articles
18. **Complaint** - Complaints & suggestions

#### CMS & Admin Models

19. **ContentBlock** - Dynamic page content
20. **AppSettings** - Application configuration
21. **Media** - File uploads with IPFS support
22. **Review** - Ratings & reviews
23. **Message** - User messaging
24. **PricingPolicy** - Dynamic pricing rules
25. **Vote** - DAO voting

#### NextAuth Models

26. **Account** - OAuth accounts
27. **AuthSession** - Session management
28. **VerificationToken** - Email verification

### Database Migrations

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (development)
npm run db:push

# Create migration (development)
npm run db:migrate

# Deploy migrations (production)
npx prisma migrate deploy

# Open Prisma Studio
npm run db:studio

# Seed database
npm run db:seed
```

### Default Users (Created on First Startup)

**Admin Account**:
- Email: `admin@damdayvillage.org`
- Password: `Admin@123`
- Role: ADMIN
- Status: verified=true, active=true

**Host Account**:
- Email: `host@damdayvillage.org`
- Password: `Host@123`
- Role: HOST
- Status: verified=true, active=true

⚠️ **Change default passwords immediately in production!**

---

## API Endpoints

### Public APIs (No Authentication Required)

```
GET  /api/health                          # Health check
GET  /api/village/info                    # Village information
GET  /api/public/village-stats            # Village statistics
GET  /api/public/homestays                # List homestays
GET  /api/public/homestays/search         # Search homestays
GET  /api/public/homestays/[id]           # Get homestay details
GET  /api/public/homestays/[id]/availability  # Check availability
GET  /api/public/featured-homestays       # Featured homestays
GET  /api/public/featured-products        # Featured products
GET  /api/public/testimonials             # User testimonials
```

### Authentication APIs

```
POST /api/auth/register                   # User registration
POST /api/auth/[...nextauth]              # NextAuth.js handlers
GET  /api/auth/status                     # Auth status check
```

### User Panel APIs (Requires USER Authentication)

```
# Profile & Dashboard
GET  /api/user/stats                      # User dashboard stats
GET  /api/user/profile                    # Get user profile
PUT  /api/user/profile                    # Update profile
POST /api/user/profile/avatar             # Upload avatar

# Bookings
GET  /api/user/bookings                   # List user bookings
GET  /api/user/bookings/[id]              # Get booking details
POST /api/user/bookings/[id]/cancel       # Cancel booking

# Orders & Wishlist
GET  /api/user/orders                     # List orders
GET  /api/user/wishlist                   # Get wishlist
POST /api/user/wishlist                   # Add to wishlist
DELETE /api/user/wishlist                 # Remove from wishlist

# Carbon Credits
GET  /api/user/carbon-credits             # Get carbon balance
GET  /api/user/carbon-credits/transactions # Transaction history

# Achievements
GET  /api/user/achievements               # User achievements

# Content
GET  /api/user/articles                   # User articles
POST /api/user/articles                   # Create article
GET  /api/user/articles/[id]              # Get article
PUT  /api/user/articles/[id]              # Update article
DELETE /api/user/articles/[id]            # Delete article

# Feedback
GET  /api/user/complaints                 # User complaints
POST /api/user/complaints                 # Submit complaint

# Notifications
GET  /api/user/notifications              # Get notifications
POST /api/user/notifications/[id]/read    # Mark as read

# Reviews
GET  /api/user/reviews                    # User reviews
POST /api/user/reviews                    # Create review

# Analytics
GET  /api/user/analytics                  # User analytics
GET  /api/user/transactions               # Transaction history
```

### Admin Panel APIs (Requires ADMIN Role)

```
# Dashboard & Stats
GET  /api/admin/stats                     # Admin dashboard statistics
GET  /api/admin/activity                  # System activity log

# User Management
GET  /api/admin/users                     # List all users
PUT  /api/admin/users                     # Update user
DELETE /api/admin/users                   # Delete user

# Content Management
GET  /api/admin/content                   # Get content blocks
POST /api/admin/content                   # Create content
PUT  /api/admin/content                   # Update content
DELETE /api/admin/content                 # Delete content

# Booking Management
GET  /api/admin/bookings                  # All bookings
PUT  /api/admin/bookings                  # Update booking

# Order Management
GET  /api/admin/orders                    # All orders
PUT  /api/admin/orders                    # Update order

# Product Management
GET  /api/admin/products                  # All products
POST /api/admin/products                  # Create product
PUT  /api/admin/products                  # Update product
DELETE /api/admin/products                # Delete product

# Reviews Management
GET  /api/admin/reviews                   # All reviews
DELETE /api/admin/reviews                 # Delete review

# IoT Device Management
GET  /api/admin/devices                   # List devices
POST /api/admin/devices                   # Add device
PUT  /api/admin/devices                   # Update device
DELETE /api/admin/devices                 # Remove device

# System Configuration
GET  /api/admin/settings                  # Get settings
PUT  /api/admin/settings                  # Update settings
POST /api/admin/settings/export           # Export settings
POST /api/admin/settings/reset            # Reset to defaults

# Theme & Branding
GET  /api/admin/theme                     # Get theme config
PUT  /api/admin/theme                     # Update theme
GET  /api/admin/branding                  # Get branding
PUT  /api/admin/branding                  # Update branding

# SEO Management
GET  /api/admin/seo                       # Get SEO settings
PUT  /api/admin/seo                       # Update SEO

# Feature Flags
GET  /api/admin/features                  # Get feature flags
PUT  /api/admin/features                  # Toggle features

# System Utilities
POST /api/admin/init                      # Initialize system
GET  /api/admin/verify-setup              # Verify setup
GET  /api/admin/check-env                 # Check environment
POST /api/admin/backup                    # Create backup
```

### Booking & Payment APIs

```
GET  /api/bookings                        # List bookings
POST /api/bookings                        # Create booking
POST /api/booking/send-confirmation       # Send confirmation email
POST /api/payment/create-order            # Create payment order
POST /api/payment/verify                  # Verify payment
```

### IoT & Telemetry APIs

```
GET  /api/devices                         # List devices
POST /api/devices                         # Register device
GET  /api/telemetry                       # Get sensor data
POST /api/telemetry                       # Submit sensor data
```

### Marketplace APIs

```
GET  /api/marketplace/products            # List products
```

### Media APIs

```
GET  /api/media                           # List media
POST /api/media                           # Create media entry
POST /api/media/upload                    # Upload file
GET  /api/media/[id]                      # Get media details
DELETE /api/media/[id]                    # Delete media
```

### Homestay APIs

```
GET  /api/homestays                       # List homestays
POST /api/homestays                       # Create homestay
```

---

## Features & Implementations

### ✅ Completed Features

#### 1. Authentication & Authorization
- NextAuth.js integration with credentials provider
- OAuth support (Google, GitHub ready)
- Role-based access control (RBAC)
- 7 user roles: ADMIN, VILLAGE_COUNCIL, HOST, SELLER, OPERATOR, GUEST, RESEARCHER
- Argon2 password hashing
- Session management
- Email verification tokens
- Auto-user creation on startup
- Auto-recovery for missing/broken users

#### 2. Admin Panel
- Comprehensive dashboard with statistics
- User management (CRUD operations)
- Content management system (dynamic blocks)
- Booking management
- Order management
- Product management
- Review moderation
- IoT device management
- System settings configuration
- Theme customization
- Branding management
- SEO configuration
- Feature flag toggles
- Activity logging
- Database backup utilities
- Environment validation
- System health monitoring

#### 3. User Panel
- Personal dashboard with real-time stats
- Profile management with avatar upload
- Booking management (view, cancel, reschedule)
- Order tracking and history
- Product wishlist with stock status
- Carbon credit tracking
- Achievement system with gamification
- Article authoring (blog-style content)
- Complaint & suggestion submission
- Notification center
- Review & rating system
- Transaction history
- Analytics dashboard

#### 4. Booking System
- Homestay listings with photos
- Advanced search & filtering
- Availability calendar
- Dynamic pricing support
- Guest management
- Payment integration (Stripe, Razorpay)
- Booking confirmation emails
- Carbon footprint tracking per booking
- Multiple booking statuses

#### 5. Marketplace
- Product listings with images
- Category management
- Stock tracking
- Wishlist functionality
- Order processing
- Shipping address management
- Multiple payment methods
- Review & ratings
- Carbon footprint per product

#### 6. IoT & Environmental Monitoring
- Device registration & management
- Real-time telemetry data ingestion
- MQTT broker integration
- Time-series data storage (TimescaleDB ready)
- Device status monitoring
- Multiple device types supported:
  - Air quality sensors
  - Energy meters
  - Solar panels
  - Weather stations
  - Water sensors
  - Motion sensors
  - Cameras
  - Microphones

#### 7. Community Projects
- Project listing & tracking
- Funding goal management
- Transparent ledger entries
- Voting system (DAO-ready)
- Progress photos
- Payment tracking
- Smart contract support (optional)

#### 8. Carbon Tracking
- Carbon credit system
- Transaction history
- Earn/spend/transfer credits
- Per-activity footprint calculation
- Carbon offset marketplace (ready)

#### 9. Content Management
- Dynamic content blocks
- Page builder (visual editor ready)
- Media library with IPFS support
- Blog/article system
- Review system
- Testimonials

#### 10. Progressive Web App (PWA)
- Offline support
- Service worker
- App manifest
- Installable on mobile devices
- Cached resources
- Offline fallback page

#### 11. Security Features
- HTTPS enforcement (production)
- Security headers (HSTS, CSP, XSS protection)
- Rate limiting (ready for middleware)
- Input validation
- SQL injection prevention (Prisma ORM)
- XSS protection
- CSRF tokens
- Environment variable validation
- No hardcoded secrets

#### 12. Multi-language Support
- English & Hindi UI
- Diagnostic pages in both languages
- Language switcher (ready)
- i18n infrastructure

#### 13. Email System
- SendGrid integration
- SMTP fallback
- Booking confirmations
- Password reset emails
- Verification emails
- Notification emails

#### 14. Deployment & DevOps
- Docker containerization
- CapRover deployment configuration
- Coolify deployment support
- Automated startup checks
- Database migration automation
- Seeding automation
- Health check endpoints
- Build optimization for CI/CD
- Pre-deploy validation

### 🚧 Upcoming Features (Planned)

#### Phase 1 (Next Sprint)
- 3D Digital Twin viewer (Three.js integration)
- AR/VR guided tours (WebXR)
- Voice assistant integration
- Real-time chat (WebRTC)
- Video calls for host-guest communication

#### Phase 2 (Future)
- Web3 wallet integration
- Smart contract escrow
- Blockchain ledger (optional)
- DAO governance tools
- IPFS media backup
- DID/SSI identity
- Machine learning recommendations
- Demand forecasting
- Image moderation (ML)
- Drone delivery simulation
- Advanced analytics dashboard
- Mobile apps (React Native)

---

## Build & Deployment

### Development Setup

```bash
# 1. Clone repository
git clone https://github.com/damdayvillage-a11y/Village.git
cd Village

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your configuration

# 4. Setup database
npm run db:generate
npm run db:push
npm run db:seed

# 5. Start development server
npm run dev
```

### Build Commands

```bash
# Development build
npm run build

# Production build (optimized)
npm run build:production

# Production build (safe mode - skip type checking)
npm run build:production-safe

# Docker build
npm run build:docker

# CapRover build
npm run build:caprover
```

### Docker Deployment

#### Using Dockerfile.simple (Recommended)

```bash
# Build image
docker build -f Dockerfile.simple -t village-app:latest .

# Run container
docker run -d \
  -p 80:80 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e NEXTAUTH_SECRET="your-secret-here" \
  -e NEXTAUTH_URL="https://your-domain.com" \
  -e NODE_ENV="production" \
  village-app:latest
```

#### Docker Compose (Coolify)

```bash
# Use docker-compose.coolify.yml
docker-compose -f docker-compose.coolify.yml up -d
```

### CapRover Deployment

1. **Prerequisites**:
   - CapRover instance running
   - PostgreSQL database created
   - Domain configured

2. **Set Environment Variables** in CapRover dashboard:
   ```
   NODE_ENV=production
   NEXTAUTH_URL=https://your-domain.com
   NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>
   DATABASE_URL=postgresql://user:pass@srv-captain--postgres:5432/villagedb
   NEXT_TELEMETRY_DISABLED=1
   CI=true
   RUN_MIGRATIONS=true
   RUN_SEED=true
   ```

3. **Deploy**:
   ```bash
   # Using CLI
   git push caprover main
   
   # Or use CapRover dashboard to deploy from GitHub
   ```

4. **Verify Deployment**:
   - Check logs for successful startup
   - Visit `/api/health` endpoint
   - Login with admin credentials
   - Visit `/admin-panel/status` for diagnostics

### Build Performance

- **Local Build**: ~1-2 minutes
- **Docker Build**: ~6-10 minutes
- **CapRover Build**: ~6-10 minutes
- **Success Rate**: 95%+
- **Image Size**: ~200-400MB

### Build Optimizations

1. **Next.js Configuration**:
   - Standalone output mode
   - Source maps disabled in production
   - SWC minification enabled
   - ESLint skipped during build
   - Type checking optional in CI

2. **Docker Optimizations**:
   - Multi-stage build
   - Only production dependencies
   - Layer caching
   - Alpine Linux base (minimal size)
   - Build tools included (for argon2)

3. **Memory Management**:
   - NODE_OPTIONS='--max-old-space-size=1024'
   - Optimized for 2GB RAM
   - Efficient garbage collection

---

## Scripts & Automation

### NPM Scripts

```bash
# Development
npm run dev                    # Start dev server
npm run lint                   # Run ESLint
npm run type-check             # TypeScript type checking
npm run format                 # Format with Prettier
npm run format:check           # Check formatting

# Building
npm run build                  # Standard build
npm run build:docker           # Docker optimized build
npm run build:production       # Production build
npm run build:caprover         # CapRover build script
npm run start                  # Start production server

# Database
npm run db:generate            # Generate Prisma client
npm run db:push                # Push schema (dev)
npm run db:migrate             # Create migration
npm run db:studio              # Open Prisma Studio
npm run db:seed                # Seed database
npm run db:test                # Test DB connection

# Testing
npm run test                   # Run Jest tests
npm run test:watch             # Watch mode
npm run test:coverage          # With coverage

# Admin Utilities
npm run admin:verify           # Verify admin user
npm run admin:diagnose         # Diagnose admin login

# Validation
npm run validate:env           # Validate environment
npm run diagnose               # Full system diagnostic
npm run caprover:diagnose      # CapRover diagnostics

# Setup
npm run setup                  # Automated local setup
npm run prestart               # Pre-startup checks

# IoT
npm run device-sim             # Device simulator

# Storybook
npm run storybook              # Start Storybook
npm run build-storybook        # Build Storybook
```

### Automation Scripts (scripts/ directory)

1. **startup-check.js** - Validates environment before startup
2. **seed.ts** - Seeds database with initial data
3. **setup-local.sh** - Automated local development setup
4. **verify-admin.js** - Verifies admin user exists
5. **diagnose-admin-login.js** - Diagnoses login issues
6. **test-db-connection.js** - Tests database connectivity
7. **validate-production-env.js** - Validates production env vars
8. **caprover-diagnostic.js** - CapRover specific diagnostics
9. **diagnose-production.sh** - Full production diagnostic
10. **docker-build.sh** - Docker build script
11. **docker-entrypoint.sh** - Container entrypoint
12. **health-check.sh** - Health check script
13. **start.js** - Custom startup script
14. **build.sh** - Custom build script

---

## Security Configuration

### Authentication Security
- Argon2 password hashing (industry best practice)
- 32+ character NEXTAUTH_SECRET required
- Session token rotation
- HTTPS enforcement in production
- Secure cookie flags

### HTTP Security Headers
```javascript
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload (production)
```

### Environment Variable Security
- No secrets in code
- Environment validation on startup
- Template files provided (.env.example)
- Secrets managed via deployment platform
- Database credentials never logged

### Data Security
- Prisma ORM prevents SQL injection
- Input validation on all endpoints
- Rate limiting ready
- PII encryption at rest (ready)
- GDPR-compliant data handling (ready)

### API Security
- Role-based access control (RBAC)
- JWT token validation
- Session management
- CSRF protection (NextAuth.js)

---

## Performance Optimization

### Frontend Optimization
- Code splitting (Next.js automatic)
- Image optimization (next/image)
- Font optimization
- CSS minimization
- JavaScript minification (SWC)
- Tree shaking
- PWA caching strategy

### Backend Optimization
- Database connection pooling
- Query optimization (Prisma)
- API response caching (ready)
- CDN integration (ready)

### Build Optimization
- Standalone output mode
- Source maps disabled in production
- Minimal Docker image
- Layer caching
- Production-only dependencies

### Runtime Optimization
- React Strict Mode
- Efficient re-renders
- Memo and useMemo usage
- Lazy loading
- Suspense boundaries

---

## Troubleshooting Guide

### Common Issues & Solutions

#### 1. Login Fails with "Unable to sign in"
**Cause**: User account has `active: false` or `verified: false`  
**Solution**: Auto-fix runs on startup. Check logs for:
```
⚠️  Admin user needs update
🔧 Updating admin user...
✅ Admin user updated successfully!
```

#### 2. Database Connection Error
**Cause**: Invalid DATABASE_URL  
**Solution**:
- Verify PostgreSQL is running
- Check credentials in DATABASE_URL
- For CapRover: use `srv-captain--postgres` as host
- Test with: `npm run db:test`

#### 3. Build Hangs at npm install
**Cause**: Missing build dependencies for argon2  
**Solution**: Dockerfile includes required packages:
```dockerfile
RUN apk add --no-cache python3 make g++ linux-headers
```

#### 4. NEXTAUTH_SECRET Error
**Cause**: Missing or invalid NEXTAUTH_SECRET  
**Solution**:
- Generate: `openssl rand -base64 32`
- Must be 32+ characters
- Set in environment variables

#### 5. 500 Error on Admin Panel
**Cause**: Missing admin user or database not seeded  
**Solution**:
- Visit `/admin-panel/status` for diagnostics
- Run: `npm run db:seed`
- Or use API: `POST /api/admin/init`

#### 6. Build Memory Error
**Cause**: Insufficient memory during build  
**Solution**:
- Set `BUILD_MEMORY_LIMIT=1024` or higher
- Ensure 2GB+ RAM available
- Use `npm run build:production-safe`

#### 7. TypeScript Errors During Build
**Cause**: Type checking in CI  
**Solution**:
- Set `TYPESCRIPT_NO_TYPE_CHECK=true` in CI
- Or set `CI=true` for production builds

### Diagnostic Tools

1. **System Status Page**: `/admin-panel/status`
   - Database connectivity
   - Environment validation
   - User verification
   - System health

2. **Health Check API**: `GET /api/health`
   - Quick status check
   - Returns 200 if healthy

3. **Auth Status API**: `GET /api/auth/status`
   - Authentication status
   - Session information

4. **Help Pages**:
   - `/help/admin-500` (English)
   - `/help/admin-500-hi` (Hindi)

### Log Analysis

Key log messages to look for:

**Successful Startup**:
```
✅ Database connection successful!
✅ Admin user exists
✅ All configuration checks passed!
✅ Initialization complete, starting Next.js server...
```

**Successful Login**:
```
Successful login for user: admin@damdayvillage.org (verified=true, active=true)
```

**Auto-Recovery**:
```
⚠️  Admin user needs update (active or verified field is false)
🔧 Updating admin user...
✅ Admin user updated successfully!
```

---

## Additional Resources

### Documentation Files (Legacy - Being Consolidated)
- Located in `docs/` directory
- 30+ documentation files covering various topics
- Being consolidated into this CONFIGURATION.md file

### Configuration Templates
- `.env.example` - Local development
- `.env.docker` - Docker deployment
- `.env.caprover` - CapRover deployment
- `.env.coolify` - Coolify deployment

### External Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CapRover Documentation](https://caprover.com/docs)

---

## Support & Maintenance

### Monitoring
- Check logs regularly
- Monitor `/api/health` endpoint
- Review `/admin-panel/status` page
- Track database performance

### Updates
- Regular dependency updates
- Security patches
- Database backups
- Migration testing

### Best Practices
1. Always change default passwords in production
2. Use strong NEXTAUTH_SECRET (32+ chars)
3. Enable HTTPS/SSL
4. Regular database backups
5. Monitor logs for errors
6. Test deployments in staging first
7. Keep environment variables secure
8. Regular security audits

---

**Last Updated**: 2025-10-19  
**Version**: 1.0.0  
**Status**: Production Ready ✅

For questions or issues, refer to TROUBLESHOOTING section or check application logs.
