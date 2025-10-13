#!/bin/bash
# Simple healthcheck script for port 3000 deployment verification

set -e

URL=${1:-"http://localhost:3000"}
MAX_ATTEMPTS=${2:-30}
WAIT_TIME=${3:-2}

echo "🏥 Health check for $URL"
echo "📊 Max attempts: $MAX_ATTEMPTS, Wait time: ${WAIT_TIME}s"

attempt=1
while [ $attempt -le $MAX_ATTEMPTS ]; do
  echo "🔍 Attempt $attempt/$MAX_ATTEMPTS..."
  
  # Check if the endpoint is responding
  if curl -f -s -I "$URL" > /dev/null 2>&1; then
    echo "✅ Service is responding on $URL"
    
    # Additional check for health endpoint
    if curl -f -s "$URL/api/health" > /dev/null 2>&1; then
      echo "✅ Health endpoint is accessible"
      
      # Get health details
      health_response=$(curl -s "$URL/api/health" || echo "Failed to get health details")
      echo "📋 Health status: $health_response"
      
      echo "🎉 Deployment verification completed successfully!"
      exit 0
    else
      echo "⚠️  Health endpoint not yet ready..."
    fi
  else
    echo "❌ Service check failed (attempt $attempt/$MAX_ATTEMPTS)"
  fi
  
  if [ $attempt -eq $MAX_ATTEMPTS ]; then
    echo "💥 Health check failed after $MAX_ATTEMPTS attempts"
    echo "🔍 Final check details:"
    curl -v "$URL" || echo "Failed to connect to $URL"
    exit 1
  fi
  
  echo "⏳ Waiting ${WAIT_TIME}s before next attempt..."
  sleep $WAIT_TIME
  attempt=$((attempt + 1))
done

echo "💥 Health check timed out"
exit 1
