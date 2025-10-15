import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Determine if we're in a build or runtime environment
const isBuildTime = process.env.SKIP_DB_DURING_BUILD === 'true' ||
                    process.env.DATABASE_URL === 'postgresql://dummy:dummy@localhost:5432/dummy' ||
                    process.env.CI === 'true' && !process.env.DATABASE_URL;

// Configure logging based on environment
const logConfig = process.env.NODE_ENV === 'production' 
  ? ['error', 'warn'] 
  : ['query', 'error', 'warn'];

// Enhanced Prisma client configuration with connection pooling and timeouts
export const prisma = 
  globalThis.prisma ??
  new PrismaClient({
    log: logConfig as any,
    errorFormat: 'minimal',
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// Export db as an alias to prisma to maintain compatibility
export const db = prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

// Connection helper with retry logic
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 3;

export async function ensureDatabaseConnection(): Promise<boolean> {
  // Skip connection check during build
  if (isBuildTime || !process.env.DATABASE_URL || 
      process.env.DATABASE_URL.includes('dummy:dummy') ||
      process.env.DATABASE_URL.includes('$$cap_')) {
    return false;
  }

  while (connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
    try {
      await prisma.$connect();
      console.log('✅ Database connection established');
      connectionAttempts = 0; // Reset on success
      return true;
    } catch (error) {
      connectionAttempts++;
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`Database connection attempt ${connectionAttempts} failed:`, errorMsg);
      
      if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
        console.error('❌ Failed to connect to database after maximum retries');
        return false;
      }
      
      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, connectionAttempts - 1), 5000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return false;
}

// Graceful disconnect
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log('Database disconnected');
  } catch (error) {
    console.error('Error disconnecting from database:', error);
  }
}

// Health check function
export async function checkDatabaseHealth() {
  // Skip database check during build time
  if (process.env.SKIP_DB_DURING_BUILD === 'true' ||
      !process.env.DATABASE_URL || 
      process.env.DATABASE_URL === 'postgresql://dummy:dummy@localhost:5432/dummy') {
    return { 
      status: 'skip', 
      message: 'Database check skipped during build',
      timestamp: new Date().toISOString() 
    };
  }

  // Check for unreplaced CapRover placeholders ($$cap_*$$)
  // Note: srv-captain-- is the valid CapRover internal service naming pattern, not a placeholder
  if (process.env.DATABASE_URL.includes('$$cap_')) {
    return {
      status: 'unhealthy',
      error: 'Invalid DATABASE_URL configuration',
      help: 'DATABASE_URL contains unreplaced CapRover placeholders ($$cap_*$$) that need to be replaced with actual database credentials in the CapRover dashboard.',
      timestamp: new Date().toISOString()
    };
  }

  try {
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - startTime;
    return { 
      status: 'healthy', 
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString() 
    };
  } catch (error) {
    console.error('Database health check failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Provide helpful error messages based on error type
    let helpfulMessage = 'Database connection failed.';
    
    // Check for CapRover placeholder patterns (not srv-captain-- which is valid)
    if (errorMessage.includes('$$cap_')) {
      helpfulMessage += ' The DATABASE_URL contains unreplaced CapRover placeholders ($$cap_*$$) that need to be replaced with actual database credentials in the CapRover dashboard.';
    } else if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes("Can't reach database server")) {
      helpfulMessage += ' The database server is not accessible. Please check if PostgreSQL is running and the host/port are correct.';
    } else if (errorMessage.includes('ENOTFOUND')) {
      helpfulMessage += ' The database hostname could not be resolved. Please check the DATABASE_URL.';
    } else if (errorMessage.includes('authentication failed')) {
      helpfulMessage += ' Database authentication failed. Please check the username and password in DATABASE_URL.';
    } else if (errorMessage.includes('timeout')) {
      helpfulMessage += ' Database connection timeout. The server may be overloaded or unreachable.';
    }
    
    return { 
      status: 'unhealthy', 
      error: errorMessage,
      help: helpfulMessage,
      timestamp: new Date().toISOString() 
    };
  }
}

// Initialize TimescaleDB extensions (to be run in migration)
export const TIMESCALE_INIT_SQL = `
-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- Convert sensor_readings table to hypertable
SELECT create_hypertable('sensor_readings', 'timestamp', if_not_exists => TRUE);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_sensor_readings_device_time 
ON sensor_readings (device_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_sensor_readings_timestamp 
ON sensor_readings (timestamp DESC);

-- Create continuous aggregates for hourly rollups
CREATE MATERIALIZED VIEW IF NOT EXISTS sensor_readings_hourly
WITH (timescaledb.continuous) AS
SELECT 
    device_id,
    time_bucket('1 hour', timestamp) AS hour,
    avg((metrics->>'value')::numeric) as avg_value,
    min((metrics->>'value')::numeric) as min_value,
    max((metrics->>'value')::numeric) as max_value,
    count(*) as sample_count
FROM sensor_readings 
GROUP BY device_id, hour;

-- Enable compression on old data (older than 7 days)
SELECT add_compression_policy('sensor_readings', INTERVAL '7 days');

-- Data retention policy (keep data for 5 years as per requirements)
SELECT add_retention_policy('sensor_readings', INTERVAL '5 years');
`;