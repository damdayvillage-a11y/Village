#!/bin/bash

# Test script for Village application deployment
# Usage: ./test-deployment.sh [URL]
# Example: ./test-deployment.sh https://village.yourdomain.com

URL=${1:-"http://localhost:3000"}

echo "🏘️ Testing Village Application Deployment"
echo "========================================="
echo "Target URL: $URL"
echo ""

# Test health check endpoint
echo "Testing health check endpoint..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$URL/health")

if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo "✅ Health check: PASSED"
    HEALTH_DATA=$(curl -s "$URL/health")
    echo "   Response: $HEALTH_DATA"
else
    echo "❌ Health check: FAILED (HTTP $HEALTH_RESPONSE)"
fi

echo ""

# Test main application endpoint
echo "Testing main application endpoint..."
MAIN_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$URL/")

if [ "$MAIN_RESPONSE" = "200" ]; then
    echo "✅ Main application: PASSED"
    
    # Check for expected content
    CONTENT_CHECK=$(curl -s "$URL/" | grep -c "Village Application")
    if [ "$CONTENT_CHECK" -gt 0 ]; then
        echo "✅ Content check: PASSED (Village Application found)"
    else
        echo "⚠️  Content check: WARNING (Village Application not found in response)"
    fi
else
    echo "❌ Main application: FAILED (HTTP $MAIN_RESPONSE)"
fi

echo ""

# Test response time
echo "Testing response time..."
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$URL/health")
echo "⏱️  Response time: ${RESPONSE_TIME}s"

if (( $(echo "$RESPONSE_TIME < 2.0" | bc -l) )); then
    echo "✅ Response time: GOOD (< 2s)"
elif (( $(echo "$RESPONSE_TIME < 5.0" | bc -l) )); then
    echo "⚠️  Response time: ACCEPTABLE (2-5s)"
else
    echo "❌ Response time: SLOW (> 5s)"
fi

echo ""
echo "🏁 Test completed!"
echo ""
echo "💡 Tips:"
echo "   - For CapRover deployment: Use your app's domain URL"
echo "   - For local testing: Use http://localhost:3000"
echo "   - Check CapRover logs if tests fail"