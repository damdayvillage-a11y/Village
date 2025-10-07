#!/bin/bash
set -e

# Health check script for deployment verification
URL=${1:-"http://localhost:80"}
MAX_ATTEMPTS=${2:-30}
WAIT_TIME=${3:-5}

echo "🏥 Starting health check for $URL"
echo "📊 Max attempts: $MAX_ATTEMPTS, Wait time: ${WAIT_TIME}s"

attempt=1
while [ $attempt -le $MAX_ATTEMPTS ]; do
  echo "🔍 Attempt $attempt/$MAX_ATTEMPTS..."
  
  # Check if the health endpoint is responding
  if curl -f --silent --max-time 10 "$URL/api/health" > /dev/null 2>&1; then
    echo "✅ Health check passed!"
    
    # Additional checks
    echo "🔍 Running additional verification checks..."
    
    # Check main page
    if curl -f --silent --max-time 10 "$URL/" > /dev/null 2>&1; then
      echo "✅ Main page is accessible"
    else
      echo "⚠️  Main page check failed"
    fi
    
    # Get health details
    health_response=$(curl -s "$URL/api/health" || echo "Failed to get health details")
    echo "📋 Health status: $health_response"
    
    echo "🎉 Deployment verification completed successfully!"
    exit 0
  else
    echo "❌ Health check failed (attempt $attempt/$MAX_ATTEMPTS)"
    
    if [ $attempt -eq $MAX_ATTEMPTS ]; then
      echo "💥 Health check failed after $MAX_ATTEMPTS attempts"
      echo "🔍 Trying to get error details..."
      curl -v "$URL/api/health" || echo "Failed to get error details"
      exit 1
    fi
    
    echo "⏳ Waiting ${WAIT_TIME}s before next attempt..."
    sleep $WAIT_TIME
  fi
  
  attempt=$((attempt + 1))
done

echo "💥 Health check timed out"
exit 1