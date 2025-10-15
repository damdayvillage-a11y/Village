#!/usr/bin/env node

/**
 * Database Setup Check Script
 * 
 * Quickly checks if the database is properly set up:
 * - Database connection
 * - Tables exist
 * - Migrations applied
 * - Admin user exists
 * 
 * Usage: node scripts/check-database-setup.js
 */

const { PrismaClient } = require('@prisma/client');

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

const prisma = new PrismaClient();

async function checkDatabaseSetup() {
  console.log(chalk.blue('\n🔍 Checking database setup...\n'));

  const checks = {
    connection: false,
    tables: false,
    adminUser: false,
  };

  const errors = [];
  const warnings = [];
  const recommendations = [];

  // 1. Check database connection
  try {
    await prisma.$connect();
    checks.connection = true;
    console.log(chalk.green('✅ Database connection: OK'));
  } catch (error) {
    console.log(chalk.red('❌ Database connection: FAILED'));
    errors.push('Cannot connect to database');
    errors.push(`  Error: ${error.message}`);
    recommendations.push('Check DATABASE_URL and ensure database is running');
    recommendations.push('Run: npm run db:test');
  }

  // 2. Check if tables exist
  if (checks.connection) {
    try {
      // Try to query users table
      const userCount = await prisma.user.count();
      checks.tables = true;
      console.log(chalk.green(`✅ Database tables: OK (${userCount} users)`));
    } catch (error) {
      console.log(chalk.red('❌ Database tables: MISSING'));
      errors.push('Database tables do not exist');
      
      if (error.message.includes('does not exist')) {
        errors.push('  Tables have not been created');
        recommendations.push('Run migrations: npm run db:migrate:deploy');
        recommendations.push('OR use automated setup: npm run setup:production');
      }
    }
  }

  // 3. Check admin user
  if (checks.tables) {
    try {
      const adminUser = await prisma.user.findUnique({
        where: { email: 'admin@damdayvillage.org' },
      });

      if (adminUser) {
        checks.adminUser = true;
        console.log(chalk.green('✅ Admin user: OK'));
        
        // Check admin user configuration
        if (!adminUser.verified) {
          warnings.push('Admin user is not verified');
        }
        if (!adminUser.active) {
          warnings.push('Admin user is not active');
        }
        if (adminUser.role !== 'ADMIN') {
          warnings.push(`Admin user has wrong role: ${adminUser.role}`);
        }
        if (!adminUser.password) {
          errors.push('Admin user has no password set');
          recommendations.push('Re-seed database: npm run db:seed');
        }
      } else {
        console.log(chalk.red('❌ Admin user: NOT FOUND'));
        errors.push('Admin user does not exist');
        recommendations.push('Seed database: npm run db:seed');
        recommendations.push('OR visit: /api/admin/init');
      }
    } catch (error) {
      console.log(chalk.red('❌ Admin user check: FAILED'));
      errors.push(`Admin check error: ${error.message}`);
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(50));
  
  const allPassed = checks.connection && checks.tables && checks.adminUser;
  
  if (allPassed && warnings.length === 0) {
    console.log(chalk.green('\n✅ ALL CHECKS PASSED - Database is ready!\n'));
  } else if (allPassed && warnings.length > 0) {
    console.log(chalk.yellow('\n⚠️  WARNINGS DETECTED - Database is functional but has issues:\n'));
    warnings.forEach(w => console.log(chalk.yellow(`  • ${w}`)));
    console.log();
  } else {
    console.log(chalk.red('\n❌ SETUP INCOMPLETE - Action required:\n'));
    
    if (errors.length > 0) {
      console.log(chalk.red('Errors:'));
      errors.forEach(e => console.log(chalk.red(`  • ${e}`)));
      console.log();
    }
    
    if (recommendations.length > 0) {
      console.log(chalk.blue('Recommended actions:'));
      recommendations.forEach(r => console.log(chalk.blue(`  ${r}`)));
      console.log();
    }
  }

  console.log('For more help, see:');
  console.log('  • PRODUCTION_DATABASE_FIX.md - Fix "tables not found" errors');
  console.log('  • CAPROVER_DATABASE_SETUP.md - Database setup guide');
  console.log('  • TROUBLESHOOTING.md - General troubleshooting\n');

  await prisma.$disconnect();
  
  return allPassed ? 0 : 1;
}

checkDatabaseSetup()
  .then((exitCode) => {
    process.exit(exitCode);
  })
  .catch((error) => {
    console.error(chalk.red('\n💥 Unexpected error:'), error);
    process.exit(1);
  });
