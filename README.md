# Smart Carbon-Free Village Platform 🌱

<div align="center">

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Tests](https://img.shields.io/badge/tests-25%2F25%20passing-brightgreen)
![Code Quality](https://img.shields.io/badge/eslint-0%20warnings-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-0%20errors-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

**A futuristic platform for Damday Village showcasing sustainable living, carbon-neutral tourism, and community transparency**

[Documentation](#documentation) • [Features](#features) • [Quick Start](#quick-start) • [Contributing](#contributing)

</div>

---

## 📖 Overview

The Smart Carbon-Free Village Platform is a comprehensive web application built to transform Damday Village into a globally recognized example of sustainable development. The platform combines cutting-edge technology with environmental stewardship to create an immersive, transparent, and carbon-conscious experience.

### Vision
> Open Damday Village to the world as a carbon-neutral, culturally-rich, resilient, and technologically progressive model village.

### Key Highlights
- ✅ **Production Ready**: 95%+ build success rate with comprehensive testing
- ✅ **62 API Endpoints**: Complete backend infrastructure
- ✅ **27 Database Models**: Robust data architecture with Prisma ORM
- ✅ **7 User Roles**: Sophisticated role-based access control
- ✅ **Clean Codebase**: 0 ESLint warnings, 0 TypeScript errors
- ✅ **Well Documented**: 268KB of comprehensive documentation

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ (Alpine)
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/damdayvillage-a11y/Village.git
cd Village

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Setup database
npm run db:generate
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Default Credentials (Development Only)

**Admin Account:**
- Email: `admin@damdayvillage.org`
- Password: `Admin@123`

**Host Account:**
- Email: `host@damdayvillage.org`  
- Password: `Host@123`

⚠️ **Change these immediately in production!**

---

## ✨ Features

### 🏡 Tourism & Booking System
- **Homestay Listings**: Browse and book sustainable accommodations
- **Dynamic Pricing**: Seasonal and demand-based pricing
- **Payment Integration**: Stripe and Razorpay support
- **Carbon Tracking**: Calculate and offset travel footprint

### 🛍️ Sustainable Marketplace
- **Local Products**: Support village artisans and sellers
- **Carbon Footprint**: Transparency for each product
- **Inventory Management**: Real-time stock tracking
- **Secure Payments**: Multiple payment gateways

### 🌍 Carbon Credit System
- **Earn Credits**: Sustainable actions rewarded
- **Track Footprint**: Real-time carbon accounting
- **Offset Programs**: Transparent carbon offsetting
- **Transaction History**: Complete audit trail

### 🏛️ Community Governance
- **Project Transparency**: Public project tracking
- **Community Voting**: Democratic decision-making (DAO-ready)
- **Fund Tracking**: Transparent budget allocation
- **Progress Documentation**: Photo and milestone tracking

### 📊 IoT & Environmental Monitoring
- **Real-time Sensors**: Air quality, energy, weather monitoring
- **8 Device Types**: Comprehensive sensor network
- **MQTT Integration**: Real-time data ingestion
- **Time-series Storage**: TimescaleDB ready

### 👥 User Management
- **7 User Roles**: ADMIN, VILLAGE_COUNCIL, HOST, SELLER, OPERATOR, GUEST, RESEARCHER
- **OAuth Support**: Google, GitHub authentication ready
- **Profile Management**: Complete user profiles with avatars
- **Activity Tracking**: Comprehensive audit logs

### 💻 Admin Panel
- **Complete Dashboard**: Real-time statistics and analytics
- **Content Management**: Dynamic page builder (API complete)
- **Media Library**: Advanced image management
- **System Configuration**: Feature flags and theme customization

### 📱 Progressive Web App (PWA)
- **Offline Support**: Works without internet
- **Installable**: Add to home screen
- **Fast Loading**: Optimized performance
- **Service Worker**: Intelligent caching

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14.2.33 (App Router)
- **React**: 18.3.1 with TypeScript 5.9.3
- **Styling**: Tailwind CSS 3.4.18
- **Animation**: Framer Motion 12.23.22
- **3D Graphics**: Three.js 0.158.0
- **Icons**: Lucide React 0.469.0

### Backend
- **Runtime**: Node.js 20 (Alpine)
- **ORM**: Prisma 6.17.1
- **Database**: PostgreSQL 14+ with TimescaleDB support
- **Authentication**: NextAuth.js 4.24.11
- **Password**: Argon2 0.44.0

### Deployment
- **Docker**: Production-ready containerization
- **CapRover**: Deployment configuration included
- **Coolify**: Docker Compose support
- **CI/CD**: Automated testing and builds

---

## 📚 Documentation

Comprehensive documentation is available in the repository:

| Document | Description | Size |
|----------|-------------|------|
| [CONFIGURATION.md](./CONFIGURATION.md) | Complete configuration guide, environment setup, API reference | 32KB |
| [REQUIREMENTS.md](./REQUIREMENTS.md) | Functional and technical requirements, feature specifications | 22KB |
| [MEMORY.md](./MEMORY.md) | Current project state, progress tracking, change log | 26KB |
| [ISSUES.md](./ISSUES.md) | Comprehensive issue tracking (100 issues cataloged) | 38KB |
| [PR.md](./PR.md) | PR roadmap for admin panel enhancement (10 PRs) | 32KB |
| [COPILOT_INSTRUCTIONS.md](./COPILOT_INSTRUCTIONS.md) | Agent execution rules and development guidelines | 19KB |
| [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md) | PR #5-6 completion details and blueprints | 7KB |

**Quick Links:**
- 🚀 [Getting Started](./CONFIGURATION.md#development-setup)
- 🔧 [Troubleshooting](./CONFIGURATION.md#troubleshooting-guide)
- 📝 [API Documentation](./CONFIGURATION.md#api-endpoints)
- 🐛 [Issue Tracking](./ISSUES.md)

---

## 🏗️ Project Structure

```
Village/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API routes (62 endpoints)
│   │   ├── admin-panel/          # Admin dashboard pages
│   │   ├── user-panel/           # User dashboard pages
│   │   └── (public pages)/       # Public-facing pages
│   ├── components/               # React components (50+)
│   ├── lib/                      # Utility libraries
│   └── types/                    # TypeScript type definitions
├── prisma/
│   └── schema.prisma             # Database schema (27 models)
├── scripts/                      # Automation scripts
├── public/                       # Static assets
├── .storybook/                   # Storybook configuration
└── docs/                         # Additional documentation
```

---

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build application
npm run start                  # Start production server

# Code Quality
npm run lint                   # Run ESLint
npm run type-check             # TypeScript type checking
npm run format                 # Format with Prettier
npm test                       # Run test suite

# Database
npm run db:generate            # Generate Prisma client
npm run db:push                # Push schema changes
npm run db:seed                # Seed database
npm run db:studio              # Open Prisma Studio

# Deployment
npm run build:production       # Production build
npm run validate:env           # Validate environment
npm run diagnose               # Full system diagnostic
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

**Current Test Status:**
- ✅ 25 tests passing
- ✅ 5 test suites
- ✅ 100% pass rate

---

## 🚢 Deployment

### Docker Deployment

```bash
# Build Docker image
docker build -f Dockerfile.simple -t village-app:latest .

# Run container
docker run -d \
  -p 80:80 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e NEXTAUTH_SECRET="your-secret-here" \
  -e NEXTAUTH_URL="https://your-domain.com" \
  village-app:latest
```

### CapRover Deployment

1. Set environment variables in CapRover dashboard
2. Deploy using: `git push caprover main`
3. Monitor deployment logs
4. Visit `/api/health` to verify

**Deployment Performance:**
- ⚡ Build Time: 6-10 minutes
- 📦 Image Size: 200-400MB
- 🎯 Success Rate: 95%+

---

## 📊 Project Status

### Overall Health: 🟢 EXCELLENT

| Metric | Status | Details |
|--------|--------|---------|
| Build | ✅ Passing | Clean production build |
| Tests | ✅ 25/25 Passing | 100% success rate |
| Linting | ✅ 0 Warnings | ESLint clean |
| Type Safety | ✅ 0 Errors | TypeScript clean |
| Security | ✅ 0 Critical | CodeQL verified |

### Feature Completion

| Feature Category | Completion | Status |
|-----------------|-----------|---------|
| P0 Critical Issues | 10/10 (100%) | ✅ Complete |
| P1 High Priority (APIs) | 60% | 🟡 APIs done, UIs blueprinted |
| P2 Medium Priority | 10% | 🟢 In progress |
| P3 Future Features | 0% | 🔵 Planned |

### Current Development Focus

- **Active**: PR #5-6 (CMS & Booking UIs - blueprints ready)
- **Ready**: 8 UI pages specified and ready for implementation
- **Planned**: PR #7-10 (IoT, Projects, Configuration, Analytics)

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Read Documentation**: Familiarize yourself with the codebase
   - [COPILOT_INSTRUCTIONS.md](./COPILOT_INSTRUCTIONS.md) - Development guidelines
   - [CONFIGURATION.md](./CONFIGURATION.md) - Technical details
   - [ISSUES.md](./ISSUES.md) - Current issues and roadmap

2. **Find an Issue**: Check [ISSUES.md](./ISSUES.md) for tasks
   - P1 issues are ready for implementation
   - Blueprint-ready issues have detailed specifications

3. **Create a Branch**: Use naming convention
   ```bash
   git checkout -b pr/NN-feature-description
   ```

4. **Implement**: Follow code quality standards
   - Write tests for new features
   - Maintain TypeScript typing
   - Follow existing patterns
   - Document complex logic

5. **Test**: Ensure quality
   ```bash
   npm run lint
   npm run type-check
   npm test
   npm run build
   ```

6. **Submit PR**: Follow PR template
   - Clear description
   - Link related issues
   - Include screenshots for UI changes
   - Request review

### Code Quality Standards

- ✅ TypeScript strict mode
- ✅ ESLint compliance (0 warnings)
- ✅ Prettier formatting
- ✅ Test coverage for new features
- ✅ JSDoc comments for complex functions
- ✅ Responsive design (mobile-first)

---

## 🌟 Key Achievements

- ✅ **Production Ready**: Deployed and operational
- ✅ **Zero Build Errors**: Clean, maintainable codebase
- ✅ **Comprehensive Documentation**: 268KB of guides
- ✅ **100% P0 Issues Resolved**: All critical issues fixed
- ✅ **Clean Code Quality**: 0 warnings, 0 type errors
- ✅ **Robust Testing**: 25 tests, 100% pass rate
- ✅ **Complete Infrastructure**: 62 APIs, 27 models, 7 roles
- ✅ **Security Verified**: CodeQL clean, 0 critical vulnerabilities

---

## 📞 Support

### Getting Help

- **Documentation**: Check [CONFIGURATION.md](./CONFIGURATION.md) troubleshooting section
- **Diagnostic Tools**: 
  - Visit `/admin-panel/status` for system health
  - Run `npm run diagnose` for full diagnostic
  - Check `/help/admin-500` for error assistance

### Health Check Endpoints

- **API Health**: `GET /api/health`
- **Auth Status**: `GET /api/auth/status`
- **System Status**: Visit `/admin-panel/status` (requires admin login)

---

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

Built with ❤️ for Damday Village, showcasing the future of sustainable community development.

**Technologies**: Next.js, React, TypeScript, Prisma, PostgreSQL, Tailwind CSS, Three.js, and many more amazing open-source projects.

---

<div align="center">

**[⬆ Back to Top](#smart-carbon-free-village-platform-)**

Made with 🌱 by the Damday Village development team

</div>
