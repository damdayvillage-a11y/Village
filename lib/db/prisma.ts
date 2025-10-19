import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Check if we should skip database initialization during build
// Only use dummy database during actual build processes (CI or explicit skip flag)
const isBuildTime = 
  process.env.SKIP_DB_DURING_BUILD === 'true' ||
  (process.env.CI === 'true' && !process.env.DATABASE_URL);

// Determine database URL with proper fallback logic
const databaseUrl = (() => {
  // If DATABASE_URL is not set at all
  if (!process.env.DATABASE_URL) {
    // Only use dummy URL during build time
    if (isBuildTime) {
      return 'postgresql://dummy:dummy@localhost:5432/dummy';
    }
    // At runtime, require DATABASE_URL to be set
    console.error('❌ DATABASE_URL environment variable is not set!');
    console.error('   Please configure DATABASE_URL to connect to your PostgreSQL database.');
    console.error('   Example: DATABASE_URL="postgresql://user:password@host:5432/database"');
    // Return invalid URL to prevent connection attempts
    return 'postgresql://MISSING_DATABASE_URL@invalid:5432/configure_database_url';
  }
  
  // If DATABASE_URL is the dummy value, it's OK
  if (process.env.DATABASE_URL === 'postgresql://dummy:dummy@localhost:5432/dummy') {
    return process.env.DATABASE_URL;
  }
  
  // Otherwise use the provided DATABASE_URL
  return process.env.DATABASE_URL;
})();

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
