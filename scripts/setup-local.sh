#!/bin/bash

# Local Development Setup Script
# This script sets up the local development environment for the Smart Carbon-Free Village project

set -e  # Exit on error

echo "🌱 Setting up Smart Carbon-Free Village for local development..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from example...${NC}"
    
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ Created .env from .env.example${NC}"
    else
        # Create a basic .env file
        cat > .env << 'EOF'
# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/smart_village_db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-this-to-a-random-secret-in-production"

# Node Environment
NODE_ENV="development"

# Optional: OAuth providers (leave empty if not using)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
EOF
        echo -e "${GREEN}✅ Created basic .env file${NC}"
    fi
    
    echo -e "${YELLOW}📝 Please review and update .env file with your configuration${NC}"
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi

echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed${NC}"
    echo "Please install PostgreSQL:"
    echo "  - macOS: brew install postgresql"
    echo "  - Ubuntu/Debian: sudo apt-get install postgresql"
    echo "  - Windows: Download from https://www.postgresql.org/download/windows/"
    exit 1
fi

echo -e "${GREEN}✅ PostgreSQL is installed${NC}"

# Check if PostgreSQL is running
if ! pg_isready &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL is not running. Attempting to start...${NC}"
    
    # Try to start PostgreSQL based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start postgresql || true
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo service postgresql start || true
    fi
    
    sleep 2
    
    if ! pg_isready &> /dev/null; then
        echo -e "${RED}❌ Failed to start PostgreSQL${NC}"
        echo "Please start PostgreSQL manually and run this script again"
        exit 1
    fi
fi

echo -e "${GREEN}✅ PostgreSQL is running${NC}"

# Create database if it doesn't exist
DB_NAME="smart_village_db"
if ! psql -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    echo -e "${YELLOW}Creating database: $DB_NAME${NC}"
    createdb "$DB_NAME" || {
        echo -e "${YELLOW}Trying with postgres user...${NC}"
        sudo -u postgres createdb "$DB_NAME" || {
            echo -e "${RED}❌ Failed to create database${NC}"
            exit 1
        }
    }
    echo -e "${GREEN}✅ Database created${NC}"
else
    echo -e "${GREEN}✅ Database exists${NC}"
fi

echo ""
echo "📦 Installing npm dependencies..."
npm install

echo ""
echo "🔄 Generating Prisma client..."
npm run db:generate

echo ""
echo "📊 Pushing database schema..."
npm run db:push

echo ""
echo "🌱 Seeding database with initial data..."
npx tsx scripts/seed.ts || npm run db:seed

echo ""
echo "✅ Verifying admin setup..."
npm run admin:verify

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "To start the development server, run:"
echo "  ${GREEN}npm run dev${NC}"
echo ""
echo "Default admin credentials:"
echo "  Email: admin@damdayvillage.org"
echo "  Password: Admin@123"
echo ""
echo "Admin panel: http://localhost:3000/admin-panel"
