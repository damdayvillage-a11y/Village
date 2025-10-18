import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Check if we should skip database initialization during build
const shouldSkipDatabase =
  process.env.SKIP_DB_DURING_BUILD === 'true' ||
  !process.env.DATABASE_URL ||
  process.env.DATABASE_URL === 'postgresql://dummy:dummy@localhost:5432/dummy';

// Use a dummy URL during build if DATABASE_URL is not set
const databaseUrl = shouldSkipDatabase
  ? 'postgresql://dummy:dummy@localhost:5432/dummy'
  : process.env.DATABASE_URL;

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
