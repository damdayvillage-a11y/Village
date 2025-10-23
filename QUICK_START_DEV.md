# Quick Start Guide for Developers

**Smart Carbon-Free Village Platform**  
**Last Updated**: 2025-10-23

---

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 20+
- Docker
- Git

### Setup Steps

```bash
# 1. Clone the repository (if not already)
git clone https://github.com/damdayvillage-a11y/Village.git
cd Village

# 2. Install dependencies
npm install

# 3. Start PostgreSQL database
docker run -d \
  --name village-postgres \
  -e POSTGRES_USER=village_user \
  -e POSTGRES_PASSWORD=village_pass \
  -e POSTGRES_DB=smart_village_db \
  -p 5432:5432 \
  postgres:16-alpine

# 4. Copy environment file
cp .env.example .env
# Edit .env if needed, default values work for local dev

# 5. Setup database
npm run db:generate  # Generate Prisma client
npm run db:push      # Create database schema
npm run db:seed      # Load sample data

# 6. Start development server
npm run dev
```

**Open**: http://localhost:3000

---

## 🔑 Default Login Credentials

### Admin Account
- **URL**: http://localhost:3000/auth/signin
- **Email**: `admin@damdayvillage.org`
- **Password**: `Admin@123`

### Host Account
- **Email**: `host@damdayvillage.org`
- **Password**: `Host@123`

⚠️ **Change these in production!**

---

## 📚 Key Pages

### Public Pages
- **Homepage**: http://localhost:3000
- **Homestays**: http://localhost:3000/homestays
- **Marketplace**: http://localhost:3000/marketplace
- **Digital Twin**: http://localhost:3000/digital-twin
- **Projects**: http://localhost:3000/projects

### Admin Panel
- **Dashboard**: http://localhost:3000/admin-panel
- **Users**: http://localhost:3000/admin-panel/users
- **Content**: http://localhost:3000/admin-panel/content
- **Bookings**: http://localhost:3000/admin-panel/bookings
- **Products**: http://localhost:3000/admin-panel/marketplace/products
- **Settings**: http://localhost:3000/admin-panel/settings

### User Panel
- **Dashboard**: http://localhost:3000/user-panel
- **Profile**: http://localhost:3000/user-panel/profile
- **Bookings**: http://localhost:3000/user-panel/bookings
- **Orders**: http://localhost:3000/user-panel/orders

---

## 🛠️ Development Commands

### Running the App
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
```

### Database Management
```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database (dev)
npm run db:migrate   # Create migration (dev)
npm run db:seed      # Seed sample data
npm run db:studio    # Open Prisma Studio (http://localhost:5555)
npm run db:test      # Test database connection
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run format       # Format with Prettier
npm run format:check # Check formatting
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Docker Commands
```bash
# PostgreSQL
docker start village-postgres   # Start database
docker stop village-postgres    # Stop database
docker restart village-postgres # Restart database
docker logs village-postgres    # View logs
docker exec -it village-postgres psql -U village_user -d smart_village_db  # Connect to DB
```

---

## 🔧 Common Tasks

### Reset Database
```bash
docker restart village-postgres
npm run db:push
npm run db:seed
```

### Add New Database Model
```bash
# 1. Edit prisma/schema.prisma
# 2. Generate client
npm run db:generate
# 3. Push changes
npm run db:push
# 4. Update seed if needed
```

### View Database Contents
```bash
npm run db:studio
# Opens at http://localhost:5555
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:3000/api/health

# Village info
curl http://localhost:3000/api/village/info

# Auth status (requires login)
curl http://localhost:3000/api/auth/status
```

---

## 📖 Documentation

### Essential Docs
- [SETUP_COMPLETED.md](./SETUP_COMPLETED.md) - Setup completion report
- [MEMORY.md](./MEMORY.md) - Project state and progress
- [CONFIGURATION.md](./CONFIGURATION.md) - Complete configuration guide
- [REQUIREMENTS.md](./REQUIREMENTS.md) - Feature requirements
- [README.md](./README.md) - Project overview

### API Documentation
- **Endpoints**: 62 total
- **Auth**: NextAuth.js with credentials
- **Database**: Prisma ORM with PostgreSQL
- **Models**: 27 database models

### Architecture
- **Frontend**: Next.js 14.2.33 (App Router)
- **Backend**: Node.js 20
- **Database**: PostgreSQL 16.10
- **Auth**: NextAuth.js 4.24.11
- **ORM**: Prisma 6.17.1

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check if container is running
docker ps | grep village-postgres

# Restart if needed
docker restart village-postgres

# Test connection
npm run db:test
```

### Build Errors
```bash
# Clean and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Type Errors
```bash
# Regenerate Prisma client
npm run db:generate

# Check types
npm run type-check
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

---

## 🔐 Security Notes

### Development
- ✅ Default passwords are for development only
- ✅ Database runs in isolated Docker container
- ✅ Environment variables in `.env` (not committed)

### Production
- ⚠️ Change all default passwords
- ⚠️ Use environment-specific secrets
- ⚠️ Enable SSL/TLS for database
- ⚠️ Configure proper SMTP
- ⚠️ Set up monitoring and logging

---

## 📊 Project Status

### Current State
- ✅ Build: Passing
- ✅ Tests: 25/25 passing
- ✅ Linting: 0 warnings
- ✅ Types: 0 errors
- ✅ Security: 0 critical issues

### Features
- ✅ Authentication & Authorization (7 roles)
- ✅ Admin Panel (19 API endpoints)
- ✅ User Panel (15 API endpoints)
- ✅ Booking System
- ✅ Marketplace
- ✅ IoT Device Management
- ✅ Carbon Credit System
- ✅ Community Projects
- ✅ Content Management

---

## 🎯 Next Steps

### Explore the Platform
1. Login as admin
2. Navigate through admin panel
3. Create test content
4. Test booking flow
5. Explore marketplace
6. Check user panel features

### Start Development
1. Pick an issue from [ISSUES.md](./ISSUES.md)
2. Create feature branch: `pr/NN-description`
3. Implement changes
4. Test thoroughly
5. Submit PR

### Learn More
- Read [COPILOT_INSTRUCTIONS.md](./COPILOT_INSTRUCTIONS.md)
- Check [PR.md](./PR.md) for roadmap
- Review existing API endpoints
- Explore component library

---

## 💡 Tips

### Performance
- Use `npm run dev` for fast refresh
- Use `npm run db:studio` to inspect data
- Use React DevTools for debugging

### Best Practices
- Follow TypeScript strict mode
- Write tests for new features
- Use Prisma for all database queries
- Follow existing code patterns
- Document complex logic

### Resources
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- NextAuth.js Docs: https://next-auth.js.org
- Tailwind CSS: https://tailwindcss.com

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Run tests and linting
5. Submit PR
6. Wait for review

---

## 📞 Support

- **Documentation**: Check docs/ directory
- **Issues**: See [ISSUES.md](./ISSUES.md)
- **System Health**: http://localhost:3000/admin-panel/status
- **Database**: http://localhost:5555 (Prisma Studio)

---

**Happy Coding! 🚀**

---

*Last Updated: 2025-10-23*  
*Version: 1.0.0*
