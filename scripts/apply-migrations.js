#!/usr/bin/env node

/**
 * Apply Database Migrations Script
 * 
 * This script applies pending database migrations.
 * It's a Node.js wrapper around `prisma migrate deploy` with better error handling.
 * 
 * Usage:
 *   node scripts/apply-migrations.js
 *   npm run db:migrate:deploy
 */

const { execSync } = require('child_process');

const chalk = (() => {
  try {
    return require('chalk');
  } catch {
    return {
      green: (s) => s,
      red: (s) => s,
      yellow: (s) => s,
      blue: (s) => s,
    };
  }
})();

console.log(chalk.blue('📊 Applying database migrations...\n'));

// Check DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error(chalk.red('❌ DATABASE_URL is not set'));
  console.error('Please set the DATABASE_URL environment variable');
  process.exit(1);
}

// Check for dummy values
if (process.env.DATABASE_URL.includes('dummy:dummy') || 
    process.env.DATABASE_URL.includes('$$cap_')) {
  console.error(chalk.red('❌ DATABASE_URL contains placeholder values'));
  console.error('Please replace dummy values with actual database credentials');
  process.exit(1);
}

console.log(chalk.green('✅ DATABASE_URL is configured\n'));

try {
  // Apply migrations
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: process.env,
  });
  
  console.log(chalk.green('\n✅ Migrations applied successfully!\n'));
  
  console.log('Next steps:');
  console.log('  1. Generate Prisma client: npm run db:generate');
  console.log('  2. Seed database: npm run db:seed');
  console.log('  3. Verify admin: npm run admin:verify\n');
  
  process.exit(0);
} catch (error) {
  console.error(chalk.red('\n❌ Migration failed!\n'));
  
  console.error('Troubleshooting:');
  console.error('  1. Check DATABASE_URL is correct');
  console.error('  2. Ensure database server is running');
  console.error('  3. Verify database user has CREATE TABLE permissions');
  console.error('  4. Check application logs for detailed error\n');
  
  console.error('For more help, see:');
  console.error('  - PRODUCTION_DATABASE_FIX.md');
  console.error('  - CAPROVER_DATABASE_SETUP.md');
  console.error('  - TROUBLESHOOTING.md\n');
  
  process.exit(1);
}
