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
    npm config set fund false && \
    npm config set update-notifier false && \
    npm ci --include=dev --silent --no-audit --no-fund

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
ENV GENERATE_SOURCEMAP=false
ENV DISABLE_ESLINT=true
ENV TYPESCRIPT_NO_TYPE_CHECK=false

# Generate Prisma client and build with enhanced monitoring
ENV CAPROVER_BUILD=true
RUN npm config set strict-ssl false && \
    npm config set registry https://registry.npmjs.org/ && \
    npm config set fund false && \
    npm config set update-notifier false && \
    npm config set audit false

# Generate Prisma client first
RUN echo "Generating Prisma client..." && \
    NODE_TLS_REJECT_UNAUTHORIZED=0 npx prisma generate

# Build with timeout and monitoring
RUN echo "Starting Next.js build with enhanced monitoring..." && \
    timeout 1200 sh -c '\
      npm run build:production 2>&1 | while IFS= read -r line; do \
        timestamp=$(date "+%H:%M:%S"); \
        echo "[$timestamp] BUILD: $line"; \
        case "$line" in \
          *"Checking validity of types"*) echo "[$timestamp] STATUS: Type checking started" ;; \
          *"Collecting page data"*) echo "[$timestamp] STATUS: Data collection started" ;; \
          *"Generating static pages"*) echo "[$timestamp] STATUS: Static generation started" ;; \
          *"Finalizing page optimization"*) echo "[$timestamp] STATUS: Final optimization started" ;; \
          "") echo "[$timestamp] HEARTBEAT: Still processing..." ;; \
        esac; \
      done' && \
    echo "Build completed successfully!" && \
    ls -la .next/ | head -5

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