#!/bin/bash

# Deployment script for village_leaders table creation
# This script should be run on the server after deploying the code changes

echo "=================================================="
echo "Village Leaders Database Migration Deployment"
echo "=================================================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set"
    echo "Please set DATABASE_URL before running this script"
    echo ""
    echo "Example:"
    echo "  export DATABASE_URL='postgresql://user:password@host:port/database'"
    echo ""
    exit 1
fi

echo "✅ DATABASE_URL is set"
echo ""

# Step 1: Run the database migration
echo "📝 Step 1: Running database migration..."
echo "----------------------------------------"
node scripts/migrate-village-leaders.js

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Migration failed! Please check the error messages above."
    echo "Common issues:"
    echo "  - Database connection error"
    echo "  - Insufficient permissions"
    echo "  - Database URL incorrect"
    echo ""
    exit 1
fi

echo ""
echo "✅ Migration completed successfully"
echo ""

# Step 2: Generate Prisma Client
echo "📝 Step 2: Generating Prisma Client..."
echo "----------------------------------------"
npm run db:generate

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Prisma client generation failed!"
    echo ""
    exit 1
fi

echo ""
echo "✅ Prisma client generated successfully"
echo ""

# Step 3: Verify the table
echo "📝 Step 3: Verifying table creation..."
echo "----------------------------------------"

# Use psql to verify if available
if command -v psql &> /dev/null; then
    echo "Checking village_leaders table..."
    psql "$DATABASE_URL" -c "SELECT COUNT(*) as leader_count FROM village_leaders;" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Table verified successfully"
    else
        echo ""
        echo "⚠️  Could not verify table (psql command failed)"
        echo "Table should still be created - check manually"
    fi
else
    echo "⚠️  psql not available - skipping verification"
    echo "Table should be created - verify manually if needed"
fi

echo ""
echo "=================================================="
echo "✅ Deployment Complete!"
echo "=================================================="
echo ""
echo "Next steps:"
echo "  1. Restart your application server"
echo "  2. Visit /admin-panel/leadership to manage leaders"
echo "  3. Verify homepage displays leaders correctly"
echo ""
echo "Admin Panel Features:"
echo "  - Leadership Management: /admin-panel/leadership"
echo "  - Homepage Editor: /admin-panel/homepage-editor"
echo "  - Page Builder: /admin-panel/cms/page-builder"
echo ""
echo "For issues, check:"
echo "  - DATABASE_MIGRATION_GUIDE.md"
echo "  - ADMIN_PANEL_NAVIGATION_GUIDE.md"
echo ""
