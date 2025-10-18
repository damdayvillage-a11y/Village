#!/bin/bash
# Docker Build Validation Script
# This script validates the Dockerfile.simple configuration before deployment

set -e

echo "🔍 Docker Build Validation Script"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track validation status
ERRORS=0
WARNINGS=0

# Function to print success
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print error
error() {
    echo -e "${RED}❌ $1${NC}"
    ((ERRORS++))
}

# Function to print warning
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

# Check if required files exist
echo "📁 Checking Required Files..."
required_files=(
    "Dockerfile.simple"
    ".dockerignore"
    "captain-definition"
    "package.json"
    "package-lock.json"
    "next.config.js"
    "prisma/schema.prisma"
    "scripts/docker-entrypoint.sh"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        success "$file exists"
    else
        error "$file is missing!"
    fi
done

echo ""

# Validate Dockerfile.simple structure
echo "🐳 Validating Dockerfile.simple..."

# Check for multi-stage build
STAGE_COUNT=$(grep -c "^FROM" Dockerfile.simple || true)
if [ "$STAGE_COUNT" -eq 3 ]; then
    success "Multi-stage build detected ($STAGE_COUNT stages)"
else
    error "Expected 3 stages, found $STAGE_COUNT"
fi

# Check for cleanup commands
if grep -q "npm cache clean" Dockerfile.simple; then
    success "npm cache cleanup found"
else
    warning "npm cache cleanup not found"
fi

if grep -q "rm -rf .next/cache" Dockerfile.simple; then
    success ".next/cache cleanup found"
else
    warning ".next/cache cleanup not found"
fi

# Check for WORKDIR
if grep -q "^WORKDIR /app" Dockerfile.simple; then
    success "WORKDIR set correctly"
else
    error "WORKDIR not set or incorrect"
fi

# Check for Node version
NODE_VERSION=$(grep "^FROM node:" Dockerfile.simple | head -1 | cut -d: -f2 | cut -d- -f1)
if [ "$NODE_VERSION" = "20" ]; then
    success "Using Node.js 20"
else
    warning "Using Node.js $NODE_VERSION (expected 20)"
fi

echo ""

# Validate .dockerignore
echo "📋 Validating .dockerignore..."

# Check if important exclusions are present
exclusions=(
    "node_modules"
    "docs/"
    "*.md"
    ".git"
    "**/*.test.ts"
    ".storybook"
)

for exclusion in "${exclusions[@]}"; do
    if grep -q "$exclusion" .dockerignore; then
        success "$exclusion is excluded"
    else
        warning "$exclusion not found in .dockerignore"
    fi
done

echo ""

# Validate captain-definition
echo "⚓ Validating captain-definition..."

if [ -f "captain-definition" ]; then
    if grep -q "Dockerfile.simple" captain-definition; then
        success "captain-definition points to Dockerfile.simple"
    else
        error "captain-definition doesn't point to Dockerfile.simple"
    fi
    
    if grep -q '"schemaVersion": 2' captain-definition; then
        success "Using schema version 2"
    else
        warning "Not using schema version 2"
    fi
fi

echo ""

# Check package.json scripts
echo "📦 Validating package.json..."

if [ -f "package.json" ]; then
    if grep -q '"build:production"' package.json; then
        success "build:production script exists"
    else
        error "build:production script missing"
    fi
    
    if grep -q '"next": "' package.json; then
        success "Next.js dependency found"
    else
        error "Next.js dependency missing"
    fi
    
    if grep -q '"@prisma/client": "' package.json; then
        success "Prisma client dependency found"
    else
        error "Prisma client dependency missing"
    fi
fi

echo ""

# Check next.config.js
echo "⚙️  Validating next.config.js..."

if [ -f "next.config.js" ]; then
    if grep -q "output: 'standalone'" next.config.js; then
        success "Standalone output mode configured"
    else
        error "Standalone output mode not configured"
    fi
    
    if grep -q "swcMinify: true" next.config.js; then
        success "SWC minification enabled"
    else
        warning "SWC minification not enabled"
    fi
fi

echo ""

# Check if docker-entrypoint.sh is executable
echo "🚀 Validating docker-entrypoint.sh..."

if [ -f "scripts/docker-entrypoint.sh" ]; then
    if [ -x "scripts/docker-entrypoint.sh" ]; then
        success "docker-entrypoint.sh is executable"
    else
        warning "docker-entrypoint.sh is not executable (will be fixed during build)"
    fi
    
    if grep -q "exec node server.js" scripts/docker-entrypoint.sh; then
        success "Entrypoint starts server.js"
    else
        error "Entrypoint doesn't start server.js"
    fi
fi

echo ""

# Check Prisma schema
echo "🗄️  Validating Prisma schema..."

if [ -f "prisma/schema.prisma" ]; then
    if grep -q "generator client" prisma/schema.prisma; then
        success "Prisma client generator found"
    else
        error "Prisma client generator missing"
    fi
    
    if grep -q "datasource db" prisma/schema.prisma; then
        success "Database datasource found"
    else
        error "Database datasource missing"
    fi
fi

echo ""

# Estimate build context size
echo "📊 Estimating Build Context Size..."

# Create a temporary tar to simulate Docker context
TEMP_TAR=$(mktemp)
tar --exclude-from=.dockerignore -czf "$TEMP_TAR" . 2>/dev/null || true
CONTEXT_SIZE=$(du -h "$TEMP_TAR" | cut -f1)
rm "$TEMP_TAR"

echo "   Build context size: $CONTEXT_SIZE"
if [ -n "$CONTEXT_SIZE" ]; then
    success "Build context size calculated"
else
    warning "Could not calculate build context size"
fi

echo ""

# Summary
echo "=================================="
echo "📊 Validation Summary"
echo "=================================="

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo ""
    echo "Your Dockerfile is ready for deployment to CapRover."
    echo ""
    echo "Next steps:"
    echo "1. Commit and push your changes: git push origin main"
    echo "2. Deploy to CapRover: git push caprover main"
    echo "3. Monitor build logs in CapRover UI"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Validation passed with $WARNINGS warning(s)${NC}"
    echo ""
    echo "Your Dockerfile should work, but review the warnings above."
    echo "You can proceed with deployment."
    exit 0
else
    echo -e "${RED}❌ Validation failed with $ERRORS error(s) and $WARNINGS warning(s)${NC}"
    echo ""
    echo "Please fix the errors above before deploying."
    exit 1
fi
