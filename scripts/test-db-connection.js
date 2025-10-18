#!/usr/bin/env node

/**
 * Database Connection Test Script
 * 
 * Tests the database connection with provided credentials
 * Validates that CapRover internal service names (srv-captain--*) work correctly
 */

const chalk = (() => {
  try {
    return require('chalk');
  } catch {
    return {
      green: (s) => s,
      red: (s) => s,
      yellow: (s) => s,
      blue: (s) => s,
      bold: (s) => s,
    };
  }
})();

async function testDatabaseConnection() {
  console.log(chalk.blue('\n🔍 Testing Database Connection\n'));

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.log(chalk.red('❌ DATABASE_URL is not set'));
    console.log(chalk.yellow('   Set it using: export DATABASE_URL=postgresql://user:pass@host:5432/db'));
    process.exit(1);
  }

  const dbUrl = process.env.DATABASE_URL;
  
  // Mask password for display
  const maskedUrl = dbUrl.replace(/:([^@]+)@/, ':****@');
  console.log(chalk.blue(`Database URL: ${maskedUrl}\n`));

  // Check for CapRover internal service name (this is valid!)
  if (dbUrl.includes('srv-captain--')) {
    console.log(chalk.green('✅ Detected CapRover internal service name (srv-captain--*)'));
    console.log(chalk.blue('   This is the CORRECT format for CapRover PostgreSQL service\n'));
  }

  // Check for unreplaced placeholders (these are invalid)
  if (dbUrl.includes('$$cap_')) {
    console.log(chalk.red('❌ DATABASE_URL contains unreplaced CapRover placeholders ($$cap_*$$)'));
    console.log(chalk.yellow('   Replace placeholders with actual values in CapRover dashboard\n'));
    process.exit(1);
  }

  // Validate URL format
  if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
    console.log(chalk.yellow('⚠️  DATABASE_URL may have invalid format'));
    console.log(chalk.yellow('   Expected format: postgresql://user:password@host:5432/database\n'));
  }

  // Parse connection details
  try {
    const url = new URL(dbUrl);
    console.log(chalk.blue('Connection Details:'));
    console.log(chalk.blue(`  Protocol: ${url.protocol.replace(':', '')}`));
    console.log(chalk.blue(`  User: ${url.username || 'not specified'}`));
    console.log(chalk.blue(`  Host: ${url.hostname}`));
    console.log(chalk.blue(`  Port: ${url.port || '5432'}`));
    console.log(chalk.blue(`  Database: ${url.pathname.substring(1)}\n`));
  } catch (error) {
    console.log(chalk.yellow('⚠️  Could not parse DATABASE_URL\n'));
  }

  // Try to connect to database
  console.log(chalk.blue('Attempting to connect to database...\n'));

  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient({
      log: ['error'],
    });

    // Test connection with timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000)
    );

    const connectPromise = prisma.$queryRaw`SELECT 1 as test`;

    await Promise.race([connectPromise, timeoutPromise]);

    console.log(chalk.green('✅ Database connection successful!'));
    
    // Try to get database version
    try {
      const versionResult = await prisma.$queryRaw`SELECT version()`;
      if (versionResult && versionResult[0]) {
        const version = versionResult[0].version;
        const shortVersion = version.split(',')[0];
        console.log(chalk.green(`✅ PostgreSQL Version: ${shortVersion}`));
      }
    } catch (versionError) {
      // Version check is optional
    }

    // Check if database schema exists
    try {
      const tableCheck = await prisma.$queryRaw`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      const tableCount = parseInt(tableCheck[0].count);
      console.log(chalk.green(`✅ Database has ${tableCount} tables`));
      
      if (tableCount === 0) {
        console.log(chalk.yellow('\n⚠️  Database is empty. You may need to run migrations:'));
        console.log(chalk.yellow('   npx prisma migrate deploy'));
        console.log(chalk.yellow('   npm run db:seed\n'));
      } else {
        console.log(chalk.green('✅ Database schema exists\n'));
      }
    } catch (schemaError) {
      console.log(chalk.yellow('⚠️  Could not check database schema\n'));
    }

    await prisma.$disconnect();
    
    console.log(chalk.green('\n🎉 Database connection test passed!\n'));
    process.exit(0);

  } catch (error) {
    console.log(chalk.red('❌ Database connection failed\n'));
    console.log(chalk.red('Error:', error.message));
    
    // Provide helpful error messages
    if (error.message.includes('ECONNREFUSED') || error.message.includes("Can't reach database server")) {
      console.log(chalk.yellow('\n💡 Troubleshooting:'));
      console.log(chalk.yellow('   1. Check if PostgreSQL is running'));
      console.log(chalk.yellow('   2. Verify the host and port are correct'));
      console.log(chalk.yellow('   3. Check firewall/network settings'));
    } else if (error.message.includes('ENOTFOUND')) {
      console.log(chalk.yellow('\n💡 Troubleshooting:'));
      console.log(chalk.yellow('   1. Check if the hostname is correct'));
      console.log(chalk.yellow('   2. Verify DNS resolution works'));
      console.log(chalk.yellow('   3. For CapRover, ensure service name is correct (srv-captain--postgres)'));
    } else if (error.message.includes('authentication failed') || error.message.includes('password')) {
      console.log(chalk.yellow('\n💡 Troubleshooting:'));
      console.log(chalk.yellow('   1. Verify username and password are correct'));
      console.log(chalk.yellow('   2. Check if user has access to the database'));
      console.log(chalk.yellow('   3. Special characters in password may need URL encoding'));
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.log(chalk.yellow('\n💡 Troubleshooting:'));
      console.log(chalk.yellow('   1. Create the database first'));
      console.log(chalk.yellow('   2. Verify the database name is correct'));
    } else if (error.message.includes('timeout')) {
      console.log(chalk.yellow('\n💡 Troubleshooting:'));
      console.log(chalk.yellow('   1. Database server may be overloaded'));
      console.log(chalk.yellow('   2. Network connection may be slow'));
      console.log(chalk.yellow('   3. Check if there are firewall timeouts'));
    }
    
    console.log('');
    process.exit(1);
  }
}

// Run the test
testDatabaseConnection().catch((error) => {
  console.error(chalk.red('Unexpected error:'), error);
  process.exit(1);
});
