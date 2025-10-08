# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Set Node.js memory limit and optimization flags for build
ENV NODE_OPTIONS="--max-old-space-size=4096 --max-semi-space-size=1024"
ENV UV_THREADPOOL_SIZE=64

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm config set strict-ssl false && \
    npm config set registry https://registry.npmjs.org/ && \
    npm ci --include=dev

# Copy source code
COPY . .

# Set build-time environment variables
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV NEXTAUTH_SECRET="dummy-secret-for-build"
ENV NEXTAUTH_URL="http://localhost:3000"
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV CI=true
ENV DISABLE_ESLINT_PLUGIN=true

# Use enhanced Docker build script with PWA optimizations
RUN npm config set strict-ssl false && \
    npm config set registry https://registry.npmjs.org/ && \
    echo "Using Docker-optimized build script..." && \
    chmod +x scripts/docker-build.sh && \
    NODE_TLS_REJECT_UNAUTHORIZED=0 sh scripts/docker-build.sh

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

USER nextjs

EXPOSE 80

ENV PORT=80
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]