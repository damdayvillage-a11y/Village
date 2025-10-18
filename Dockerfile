# Optimized build stage with separate dependency layer
# Dependencies stage
FROM node:20-alpine AS deps

WORKDIR /app

# Install build dependencies for native modules (argon2, etc.)
RUN apk add --no-cache python3 make g++ linux-headers

# Configure npm early
RUN npm config set strict-ssl false && \
    npm config set registry https://registry.npmjs.org/ && \
    npm config set fund false && \
    npm config set update-notifier false && \
    npm config set audit false && \
    npm config set loglevel warn

# Copy only package files for dependency installation
COPY package*.json ./

# Install dependencies and clean up in one layer
RUN echo "📦 Installing dependencies..." && \
    npm ci --include=dev --no-audit --no-fund && \
    echo "🧹 Cleaning npm cache..." && \
    npm cache clean --force && \
    rm -rf /root/.npm /tmp/* && \
    echo "✅ Dependencies installed: $(du -sh node_modules)"

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install minimal runtime dependencies
RUN apk add --no-cache python3

# Accept build arguments
ARG DATABASE_URL
ARG SKIP_DB_DURING_BUILD
ARG BUILD_MEMORY_LIMIT=1024

# Set Node.js memory limit and optimization flags
ENV NODE_OPTIONS="--max-old-space-size=${BUILD_MEMORY_LIMIT} --max-semi-space-size=256"
ENV UV_THREADPOOL_SIZE=64

# Set build-time environment variables
ENV DATABASE_URL=${DATABASE_URL:-"postgresql://dummy:dummy@localhost:5432/dummy"}
ENV NEXTAUTH_SECRET="dummy-secret-for-build"
ENV NEXTAUTH_URL="http://localhost:3000"
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV CI=true
ENV DISABLE_ESLINT_PLUGIN=true
ENV GENERATE_SOURCEMAP=false
ENV DISABLE_ESLINT=true
ENV TYPESCRIPT_NO_TYPE_CHECK=true
ENV CAPROVER_BUILD=true
ENV SKIP_DB_DURING_BUILD=${SKIP_DB_DURING_BUILD:-"true"}

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./

# Copy only essential files for Prisma
COPY prisma ./prisma

# Generate Prisma client and clean up
RUN echo "🔧 Generating Prisma client..." && \
    node /app/node_modules/prisma/build/index.js generate && \
    rm -rf /tmp/* && \
    echo "✅ Prisma client generated"

# Copy configuration files
COPY next.config.js tsconfig.json postcss.config.js tailwind.config.js ./
COPY jest.config.js jest.setup.js ./

# Copy source code in stages
COPY lib ./lib
COPY middleware.ts ./middleware.ts
COPY types ./types
COPY public ./public
COPY src ./src
COPY scripts ./scripts

# Build with aggressive cleanup
RUN echo "🏗️ Building application..." && \
    echo "Build start: $(date)" && \
    echo "Disk before: $(df -h / | tail -1)" && \
    npm run build:production && \
    echo "Build complete: $(date)" && \
    echo "🧹 Aggressive cleanup..." && \
    rm -rf .next/cache node_modules/.cache /tmp/* /root/.npm && \
    npm cache clean --force && \
    echo "Disk after: $(df -h / | tail -1)" && \
    echo "✅ Complete"

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma schema and generated client for runtime
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Copy bcryptjs and argon2 for password hashing (used for auth and startup script)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/bcryptjs ./node_modules/bcryptjs
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/argon2 ./node_modules/argon2
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@phc ./node_modules/@phc
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/node-addon-api ./node_modules/node-addon-api
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/node-gyp-build ./node_modules/node-gyp-build

# Create scripts directory and copy startup validation scripts
RUN mkdir -p scripts
COPY --from=builder --chown=nextjs:nodejs /app/scripts/start.js ./scripts/
COPY --from=builder --chown=nextjs:nodejs /app/scripts/startup-check.js ./scripts/

# Verify scripts were copied
RUN echo "Verifying startup scripts:" && \
    ls -la scripts/ && \
    echo "Scripts verification complete"

USER nextjs

EXPOSE 80

ENV PORT=80
ENV HOSTNAME="0.0.0.0"

# Use start.js which runs validation before starting server
CMD ["node", "scripts/start.js"]