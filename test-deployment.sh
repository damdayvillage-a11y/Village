#!/bin/bash

# Test script for Village application deployment
# Usage: ./test-deployment.sh [URL]
# Example: ./test-deployment.sh https://village.yourdomain.com

URL=${1:-"http://localhost:3000"}

echo "🏘️ Testing Village Application Deployment"
echo "========================================="
echo "Target URL: $URL"
echo "Timestamp: $(date)"
echo ""

# Function to test URL connectivity
test_connectivity() {
    local url=$1
    local timeout=${2:-10}
    
    echo "🔗 Testing connectivity to $url..."
    if timeout $timeout curl -s --fail "$url" > /dev/null 2>&1; then
        echo "✅ URL is reachable"
        return 0
    else
        echo "❌ URL is not reachable"
        return 1
    fi
}

# Test basic connectivity first
if ! test_connectivity "$URL"; then
    echo "❌ Cannot reach the application. Deployment may have failed."
    exit 1
fi

# Test health check endpoint
echo ""
echo "🏥 Testing health check endpoint..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$URL/health")

if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo "✅ Health check: PASSED"
    HEALTH_DATA=$(curl -s "$URL/health")
    echo "   Response: $HEALTH_DATA"
    
    # Parse and validate health data
    if echo "$HEALTH_DATA" | grep -q '"status":"healthy"'; then
        echo "✅ Health status: HEALTHY"
    else
        echo "⚠️  Health status: Unknown or unhealthy"
    fi
else
    echo "❌ Health check: FAILED (HTTP $HEALTH_RESPONSE)"
fi

echo ""

# Test main application endpoint
echo "🌐 Testing main application endpoint..."
MAIN_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$URL/")

if [ "$MAIN_RESPONSE" = "200" ]; then
    echo "✅ Main application: PASSED"
    
    # Check for expected content
    CONTENT=$(curl -s "$URL/")
    CONTENT_CHECK=$(echo "$CONTENT" | grep -c "Village Application")
    if [ "$CONTENT_CHECK" -gt 0 ]; then
        echo "✅ Content check: PASSED (Village Application found)"
        
        # Check for specific elements
        if echo "$CONTENT" | grep -q "Application is running successfully"; then
            echo "✅ Status message: Found success indicator"
        fi
        
        if echo "$CONTENT" | grep -q "Build Time:"; then
            BUILD_TIME=$(echo "$CONTENT" | grep -o "Build Time: [^<]*" | head -1)
            echo "✅ Build info: $BUILD_TIME"
        fi
    else
        echo "⚠️  Content check: WARNING (Village Application not found in response)"
    fi
else
    echo "❌ Main application: FAILED (HTTP $MAIN_RESPONSE)"
fi

echo ""

# Test response time and performance
echo "⚡ Testing performance metrics..."
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$URL/health")
DNS_TIME=$(curl -s -o /dev/null -w "%{time_namelookup}" "$URL/health")
CONNECT_TIME=$(curl -s -o /dev/null -w "%{time_connect}" "$URL/health")

echo "⏱️  Response time: ${RESPONSE_TIME}s"
echo "🌐 DNS lookup: ${DNS_TIME}s"
echo "🔗 Connection time: ${CONNECT_TIME}s"

if (( $(echo "$RESPONSE_TIME < 2.0" | bc -l) )); then
    echo "✅ Response time: EXCELLENT (< 2s)"
elif (( $(echo "$RESPONSE_TIME < 5.0" | bc -l) )); then
    echo "⚠️  Response time: ACCEPTABLE (2-5s)"
else
    echo "❌ Response time: SLOW (> 5s)"
fi

echo ""

# Test additional endpoints and features
echo "🧪 Testing additional features..."

# Test 404 handling
NOT_FOUND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$URL/nonexistent-page")
if [ "$NOT_FOUND_RESPONSE" = "404" ]; then
    echo "✅ 404 handling: WORKING"
else
    echo "⚠️  404 handling: Unexpected response ($NOT_FOUND_RESPONSE)"
fi

# Test different HTTP methods if health endpoint supports them
echo "🔍 Testing HTTP methods..."
HEAD_RESPONSE=$(curl -s -I -o /dev/null -w "%{http_code}" "$URL/health")
if [ "$HEAD_RESPONSE" = "200" ]; then
    echo "✅ HEAD method: SUPPORTED"
else
    echo "ℹ️  HEAD method: Not supported or different behavior ($HEAD_RESPONSE)"
fi

echo ""
echo "📊 DEPLOYMENT TEST SUMMARY"
echo "=========================="
if [ "$HEALTH_RESPONSE" = "200" ] && [ "$MAIN_RESPONSE" = "200" ]; then
    echo "🎉 Overall Status: SUCCESS - Deployment is working correctly!"
    
    # Generate deployment report
    echo ""
    echo "📋 Deployment Report:"
    echo "   • Application URL: $URL"
    echo "   • Health Check: ✅ WORKING"
    echo "   • Main Application: ✅ WORKING"
    echo "   • Response Time: ${RESPONSE_TIME}s"
    echo "   • Test Completed: $(date)"
else
    echo "❌ Overall Status: FAILED - Issues detected in deployment"
    exit 1
fi

echo ""
echo "💡 Usage Tips:"
echo "   • For CapRover deployment: Use your app's domain URL"
echo "   • For local testing: Use http://localhost:3000"
echo "   • Check CapRover logs if tests fail"
echo "   • Screenshots can be taken using browser automation tools"