#!/bin/bash

# Production Database Setup Script
# This script initializes the database schema and creates the admin user
# Run this ONCE after deploying the application to production

set -e  # Exit on error

echo "🚀 Setting up production database..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL is not set${NC}"
    echo "Please set the DATABASE_URL environment variable"
    exit 1
fi

echo -e "${GREEN}✅ DATABASE_URL is configured${NC}"

# Check if DATABASE_URL contains dummy values
if [[ "$DATABASE_URL" == *"dummy:dummy"* ]] || [[ "$DATABASE_URL" == *'$$cap_'* ]]; then
    echo -e "${RED}❌ DATABASE_URL contains placeholder values${NC}"
    echo "Please replace dummy values with actual database credentials"
    exit 1
fi

echo -e "${GREEN}✅ DATABASE_URL looks valid${NC}"

# Test database connection
echo ""
echo "🔌 Testing database connection..."
node scripts/test-db-connection.js || {
    echo -e "${RED}❌ Database connection test failed${NC}"
    echo "Please check your DATABASE_URL and ensure the database is running"
    exit 1
}

echo ""
echo "📊 Deploying database migrations..."
npx prisma migrate deploy || {
    echo -e "${RED}❌ Migration deployment failed${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check if DATABASE_URL is correct"
    echo "2. Ensure the database server is running"
    echo "3. Verify the database user has permission to create tables"
    echo ""
    exit 1
}

echo -e "${GREEN}✅ Database schema deployed${NC}"

# Generate Prisma client
echo ""
echo "🔄 Generating Prisma client..."
npx prisma generate

echo -e "${GREEN}✅ Prisma client generated${NC}"

# Seed the database
echo ""
echo "🌱 Seeding database with initial data..."
npm run db:seed || {
    echo -e "${YELLOW}⚠️  Seeding failed, but database schema is deployed${NC}"
    echo "You can manually create the admin user later"
}

echo ""
echo "✅ Verifying admin setup..."
npm run admin:verify || {
    echo -e "${YELLOW}⚠️  Admin verification failed${NC}"
    echo "You may need to manually create the admin user"
    echo "Visit: https://your-domain.com/api/admin/init"
}

echo ""
echo -e "${GREEN}🎉 Production database setup complete!${NC}"
echo ""
echo "Default admin credentials:"
echo "  Email: admin@damdayvillage.org"
echo "  Password: Admin@123"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Change the admin password immediately after first login!${NC}"
echo ""
echo "Admin panel: https://your-domain.com/admin-panel"
echo "Status check: https://your-domain.com/api/auth/status"
echo ""
