#!/bin/sh
set -e

echo "🚀 Starting Damday Village application..."

# Auto-run migrations if DATABASE_URL is set and migrations are not explicitly disabled
if [ -n "$DATABASE_URL" ] && [ "$SKIP_MIGRATIONS" != "true" ]; then
  echo "🔄 Running database migrations..."
  if [ -f "/app/node_modules/prisma/build/index.js" ]; then
    node /app/node_modules/prisma/build/index.js migrate deploy --schema=/app/prisma/schema.prisma || {
      echo "⚠️  Migration failed, but continuing (migrations may already be applied)"
    }
  else
    echo "⚠️  Prisma not found in production image, skipping migrations"
  fi
elif [ "$RUN_MIGRATIONS" = "true" ]; then
  # Backward compatibility: still honor RUN_MIGRATIONS flag
  echo "🔄 Running database migrations (RUN_MIGRATIONS=true)..."
  if [ -f "/app/node_modules/prisma/build/index.js" ]; then
    node /app/node_modules/prisma/build/index.js migrate deploy --schema=/app/prisma/schema.prisma || {
      echo "⚠️  Migration failed, but continuing (migrations may already be applied)"
    }
  else
    echo "⚠️  Prisma not found in production image, skipping migrations"
  fi
else
  echo "ℹ️  Skipping migrations (DATABASE_URL not set or SKIP_MIGRATIONS=true)"
fi

# Check if seeding is requested
if [ "$RUN_SEED" = "true" ]; then
  echo "🌱 Seeding database..."
  if [ -f "/app/scripts/seed.ts" ] && [ -f "/app/node_modules/.bin/tsx" ]; then
    /app/node_modules/.bin/tsx /app/scripts/seed.ts || {
      echo "⚠️  Seeding failed, but continuing (data may already exist)"
    }
  else
    echo "⚠️  tsx or seed.ts not found, skipping seeding"
    echo "    Run manually: docker exec -it <container> sh -c 'node /app/node_modules/.bin/tsx /app/scripts/seed.ts'"
  fi
fi

# Validate environment (non-blocking)
if [ "$SKIP_ENV_VALIDATION" != "true" ] && [ -f "/app/scripts/startup-check.js" ]; then
  echo "🔍 Validating startup configuration..."
  node /app/scripts/startup-check.js || {
    echo "⚠️  Startup validation had warnings, but continuing..."
  }
fi

echo "✅ Initialization complete, starting Next.js server..."
echo "🌐 Server will listen on ${HOSTNAME:-0.0.0.0}:${PORT:-80}"

# Start the Next.js server
exec node server.js
