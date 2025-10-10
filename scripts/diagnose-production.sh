#!/bin/bash
# Production Diagnostics Script
# Quick health check for deployed application

set -e

echo "🔍 Damday Village - Production Diagnostics"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the domain (default or from argument)
DOMAIN="${1:-https://damdayvillage.com}"

echo -e "${BLUE}Testing domain: ${DOMAIN}${NC}"
echo ""

# Test 1: General Health
echo "📊 Test 1: General Health Check"
echo "--------------------------------"
if curl -s -f "${DOMAIN}/api/health" > /tmp/health.json 2>/dev/null; then
    echo -e "${GREEN}✅ Application is responding${NC}"
    
    # Parse and display status
    if command -v jq &> /dev/null; then
        DB_STATUS=$(cat /tmp/health.json | jq -r '.services.database.status')
        echo "   Database: ${DB_STATUS}"
    else
        cat /tmp/health.json | grep -o '"status":"[^"]*"' | head -1
    fi
else
    echo -e "${RED}❌ Application is not responding${NC}"
    echo "   Check if the server is running and accessible"
    exit 1
fi
echo ""

# Test 2: Auth Service Status
echo "🔐 Test 2: Authentication Service Status"
echo "----------------------------------------"
if curl -s "${DOMAIN}/api/auth/status" > /tmp/auth-status.json 2>/dev/null; then
    if command -v jq &> /dev/null; then
        STATUS=$(cat /tmp/auth-status.json | jq -r '.status')
        HEALTHY=$(cat /tmp/auth-status.json | jq -r '.healthy')
        
        if [ "$HEALTHY" = "true" ]; then
            echo -e "${GREEN}✅ Auth service is healthy${NC}"
        else
            echo -e "${YELLOW}⚠️  Auth service status: ${STATUS}${NC}"
            echo ""
            echo "Issues found:"
            cat /tmp/auth-status.json | jq -r '.recommendations[]' | while read -r line; do
                echo "   • $line"
            done
        fi
        
        echo ""
        echo "Configuration checks:"
        echo "   NEXTAUTH_URL: $(cat /tmp/auth-status.json | jq -r '.checks.nextauth_url.value')"
        echo "   NEXTAUTH_SECRET: $(cat /tmp/auth-status.json | jq -r '.checks.nextauth_secret.valid')"
        echo "   Database: $(cat /tmp/auth-status.json | jq -r '.checks.database.message')"
    else
        cat /tmp/auth-status.json
    fi
else
    echo -e "${RED}❌ Could not check auth service status${NC}"
fi
echo ""

# Test 3: Admin Login Page
echo "🔑 Test 3: Admin Login Page"
echo "---------------------------"
if curl -s -f "${DOMAIN}/admin-panel/login" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Admin login page is accessible${NC}"
else
    echo -e "${RED}❌ Admin login page is not accessible${NC}"
fi
echo ""

# Test 4: Try authentication (with dummy credentials to test error handling)
echo "🧪 Test 4: Auth Error Handling"
echo "-------------------------------"
if curl -s "${DOMAIN}/auth/error?error=CredentialsSignin" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Error page is working${NC}"
else
    echo -e "${YELLOW}⚠️  Error page may not be accessible${NC}"
fi
echo ""

# Summary
echo "📋 Summary & Next Steps"
echo "========================"
echo ""

if [ -f /tmp/auth-status.json ]; then
    if command -v jq &> /dev/null; then
        HEALTHY=$(cat /tmp/auth-status.json | jq -r '.healthy')
        
        if [ "$HEALTHY" = "true" ]; then
            echo -e "${GREEN}✅ All systems operational!${NC}"
            echo ""
            echo "You can now:"
            echo "  1. Visit ${DOMAIN}/admin-panel/login"
            echo "  2. Login with: admin@damdayvillage.org"
            echo "  3. Default password: Admin@123"
            echo ""
            echo -e "${YELLOW}⚠️  Remember to change the default password!${NC}"
        else
            echo -e "${YELLOW}⚠️  Some issues detected${NC}"
            echo ""
            echo "Recommendations:"
            cat /tmp/auth-status.json | jq -r '.recommendations[]' | while read -r line; do
                echo "  • $line"
            done
            echo ""
            echo "For detailed troubleshooting:"
            echo "  • Check logs: docker logs <container>"
            echo "  • See: docs/PRODUCTION_LOGIN_TROUBLESHOOTING.md"
        fi
    fi
fi

# Cleanup
rm -f /tmp/health.json /tmp/auth-status.json

echo ""
echo "Diagnostics complete!"
