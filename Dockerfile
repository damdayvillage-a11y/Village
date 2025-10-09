# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Set Node.js memory limit and optimization flags for build
ENV NODE_OPTIONS="--max-old-space-size=4096 --max-semi-space-size=1024"
ENV UV_THREADPOOL_SIZE=64

# Set build-time environment variables early
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
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

# Copy package files
COPY package*.json ./

# Configure npm for CapRover environment
RUN echo "🔧 Configuring npm for CapRover..." && \
    npm config set strict-ssl false && \
    npm config set registry https://registry.npmjs.org/ && \
    npm config set fund false && \
    npm config set update-notifier false && \
    npm config set audit false && \
    npm config set loglevel warn && \
    echo "✅ NPM configured successfully"

# Install dependencies with simple logging (no pipes or loops to avoid hangs)
RUN echo "📦 Installing dependencies..." && \
    echo "Start time: $(date)" && \
    npm ci --include=dev --no-audit --no-fund --loglevel=warn && \
    echo "Dependencies installed at: $(date)" && \
    echo "node_modules size: $(du -sh node_modules)"

# Copy source code
COPY . .

# Generate Prisma client
RUN echo "🔧 Generating Prisma client..." && \
    echo "⏰ Timestamp: $(date '+%Y-%m-%d %H:%M:%S')" && \
    npx prisma generate && \
    echo "✅ Prisma client generated successfully!"

# Build the application (no timeout to avoid hangs)
RUN echo "🏗️ Building application..." && \
    echo "Build start time: $(date)" && \
    echo "Memory before build: $(free -h)" && \
    echo "Running: npm run build:production" && \
    npm run build:production && \
    echo "Build completed at: $(date)" && \
    echo "Verifying build output..." && \
    ls -la .next/ && \
    echo "Build verification complete"

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