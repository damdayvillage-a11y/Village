#!/bin/bash
# Test SSH connectivity to DigitalOcean server
# This script is for manual testing of SSH connectivity
# The actual deployment workflow will use GitHub Actions secrets

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
DO_HOST=${DO_HOST:-"142.93.208.86"}
DO_USER=${DO_USER:-"deployer"}

echo -e "${BLUE}🔍 Testing SSH Connectivity to DigitalOcean Server${NC}"
echo "=================================================="
echo ""
echo "Server: $DO_HOST"
echo "User: $DO_USER"
echo ""

# Test 1: Basic SSH connection
echo -e "${BLUE}Test 1: Basic SSH Connection${NC}"
echo "-------------------------------"
if ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no $DO_USER@$DO_HOST "whoami" 2>/dev/null; then
    echo -e "${GREEN}✅ SSH connection successful${NC}"
else
    echo -e "${RED}❌ SSH connection failed${NC}"
    echo "Possible issues:"
    echo "  - SSH key not configured"
    echo "  - Server not reachable"
    echo "  - Firewall blocking connection"
    exit 1
fi
echo ""

# Test 2: Docker access
echo -e "${BLUE}Test 2: Docker Access${NC}"
echo "-------------------------------"
if ssh -o StrictHostKeyChecking=no $DO_USER@$DO_HOST "docker ps" 2>/dev/null; then
    echo -e "${GREEN}✅ Docker access confirmed${NC}"
else
    echo -e "${RED}❌ Docker access failed${NC}"
    echo "Possible issues:"
    echo "  - Docker not installed"
    echo "  - User not in docker group"
    echo "  - Docker daemon not running"
    exit 1
fi
echo ""

# Test 3: Sudo privileges
echo -e "${BLUE}Test 3: Sudo Privileges (Docker Compose)${NC}"
echo "-------------------------------"
if ssh -o StrictHostKeyChecking=no $DO_USER@$DO_HOST "sudo docker --version" 2>/dev/null; then
    echo -e "${GREEN}✅ Sudo access to docker confirmed${NC}"
else
    echo -e "${YELLOW}⚠️  Sudo access might be restricted${NC}"
fi
echo ""

# Test 4: Check deployment directory
echo -e "${BLUE}Test 4: Deployment Directory${NC}"
echo "-------------------------------"
if ssh -o StrictHostKeyChecking=no $DO_USER@$DO_HOST "ls -la /home/deployer/apps/village" 2>/dev/null; then
    echo -e "${GREEN}✅ Deployment directory exists${NC}"
else
    echo -e "${YELLOW}⚠️  Deployment directory does not exist (will be created during deployment)${NC}"
fi
echo ""

# Test 5: Git availability
echo -e "${BLUE}Test 5: Git Availability${NC}"
echo "-------------------------------"
if ssh -o StrictHostKeyChecking=no $DO_USER@$DO_HOST "git --version" 2>/dev/null; then
    echo -e "${GREEN}✅ Git is installed${NC}"
else
    echo -e "${RED}❌ Git is not installed${NC}"
    echo "Install with: sudo apt-get install -y git"
    exit 1
fi
echo ""

# Test 6: Docker Compose availability
echo -e "${BLUE}Test 6: Docker Compose Availability${NC}"
echo "-------------------------------"
if ssh -o StrictHostKeyChecking=no $DO_USER@$DO_HOST "docker compose version" 2>/dev/null; then
    echo -e "${GREEN}✅ Docker Compose is installed${NC}"
else
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    echo "Modern docker includes compose plugin"
    exit 1
fi
echo ""

# Test 7: Network connectivity to GitHub
echo -e "${BLUE}Test 7: Network Connectivity to GitHub${NC}"
echo "-------------------------------"
if ssh -o StrictHostKeyChecking=no $DO_USER@$DO_HOST "curl -s -I https://github.com | head -1" 2>/dev/null; then
    echo -e "${GREEN}✅ GitHub is reachable${NC}"
else
    echo -e "${RED}❌ Cannot reach GitHub${NC}"
    exit 1
fi
echo ""

# Summary
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 All connectivity tests passed!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Server is ready for deployment. You can now:"
echo "  1. Push to main branch to trigger automatic deployment"
echo "  2. Manually trigger deployment via GitHub Actions UI"
echo ""
echo "To monitor deployment:"
echo "  ssh $DO_USER@$DO_HOST 'sudo docker logs -f village-app'"
