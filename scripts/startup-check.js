#!/usr/bin/env node

/**
 * Startup Configuration Check
 * 
 * This script runs before the application starts to validate that
 * essential configuration is in place and provides helpful error messages.
 */

// Color support (graceful degradation if chalk is not available)
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

/**
 * Check if a value contains unreplaced placeholders
 */
function hasPlaceholders(value) {
  if (!value) return false;
  
  const placeholderPatterns = [
    /\$\$cap_[^$]+\$\$/,     // CapRover placeholders like $$cap_appname$$
    /\$\{[^}]+\}/,           // Template literals like ${VARIABLE}
    /your-[a-z-]+/i,         // Patterns like your-domain, your-secret
    /change-me/i,            // Common placeholder text
    /example\./i,            // example.com patterns
    /placeholder/i,          // Placeholder text
    /replace-this/i,         // Replace-this patterns
  ];
  
  return placeholderPatterns.some(pattern => pattern.test(value));
}

function checkStartupConfiguration() {
  console.log(chalk.blue('\n🚀 Running startup configuration check...\n'));

  let criticalErrors = [];
  let warnings = [];

  // Check NODE_ENV
  const nodeEnv = process.env.NODE_ENV || 'development';
  console.log(chalk.blue(`Environment: ${nodeEnv}`));

  // Check NEXTAUTH_URL
  if (!process.env.NEXTAUTH_URL) {
    criticalErrors.push('NEXTAUTH_URL is not set');
    console.log(chalk.red('❌ NEXTAUTH_URL: NOT SET'));
    console.log(chalk.yellow('   This is required for authentication to work.'));
    console.log(chalk.yellow('   Example: NEXTAUTH_URL=https://damdayvillage.com'));
  } else {
    const authUrl = process.env.NEXTAUTH_URL;
    
    // Check for unreplaced placeholders
    if (hasPlaceholders(authUrl)) {
      criticalErrors.push('NEXTAUTH_URL contains unreplaced placeholders');
      console.log(chalk.red(`❌ NEXTAUTH_URL: Contains placeholders: ${authUrl}`));
      console.log(chalk.yellow('   Detected unreplaced placeholder pattern (e.g., $$cap_*$$).'));
      console.log(chalk.yellow('   Please replace with actual domain: https://damdayvillage.com'));
    } else {
      console.log(chalk.green(`✅ NEXTAUTH_URL: ${authUrl}`));
      
      // Warn if using http in production
      if (nodeEnv === 'production' && authUrl.startsWith('http://')) {
        warnings.push('NEXTAUTH_URL uses HTTP in production (should use HTTPS)');
        console.log(chalk.yellow('   ⚠️  Warning: Using HTTP in production (HTTPS recommended)'));
      }
    }
  }

  // Check NEXTAUTH_SECRET
  if (!process.env.NEXTAUTH_SECRET) {
    criticalErrors.push('NEXTAUTH_SECRET is not set');
    console.log(chalk.red('❌ NEXTAUTH_SECRET: NOT SET'));
    console.log(chalk.yellow('   This is required for JWT token signing.'));
    console.log(chalk.yellow('   Generate one with: openssl rand -base64 32'));
  } else {
    const secret = process.env.NEXTAUTH_SECRET;
    
    // Check for dummy values
    const dummyValues = [
      'dummy-secret-for-build',
      'dummy-secret-for-build-only-not-secure',
      'your-nextauth-secret-key',
      'change-me',
      'secret',
    ];
    
    if (dummyValues.includes(secret)) {
      criticalErrors.push('NEXTAUTH_SECRET is using a dummy/example value');
      console.log(chalk.red(`❌ NEXTAUTH_SECRET: Using dummy value "${secret}"`));
      console.log(chalk.yellow('   This is NOT SECURE! Generate a secure secret:'));
      console.log(chalk.yellow('   openssl rand -base64 32'));
    } else if (secret.length < 32) {
      if (nodeEnv === 'production') {
        criticalErrors.push('NEXTAUTH_SECRET is too short for production');
        console.log(chalk.red(`❌ NEXTAUTH_SECRET: Too short (${secret.length} chars)`));
        console.log(chalk.yellow('   Must be at least 32 characters in production'));
      } else {
        warnings.push('NEXTAUTH_SECRET is shorter than recommended');
        console.log(chalk.yellow(`⚠️  NEXTAUTH_SECRET: Short (${secret.length} chars, 32+ recommended)`));
      }
    } else {
      console.log(chalk.green(`✅ NEXTAUTH_SECRET: Set (${secret.length} chars)`));
    }
  }

  // Check DATABASE_URL
  if (!process.env.DATABASE_URL) {
    criticalErrors.push('DATABASE_URL is not set');
    console.log(chalk.red('❌ DATABASE_URL: NOT SET'));
    console.log(chalk.yellow('   This is required for database connectivity.'));
    console.log(chalk.yellow('   Example: DATABASE_URL=postgresql://user:pass@host:5432/db'));
  } else {
    const dbUrl = process.env.DATABASE_URL;
    
    // Check for unreplaced placeholders
    if (hasPlaceholders(dbUrl) && !dbUrl.includes('dummy:dummy')) {
      criticalErrors.push('DATABASE_URL contains unreplaced placeholders');
      const maskedUrl = dbUrl.replace(/:([^@]+)@/, ':****@');
      console.log(chalk.red(`❌ DATABASE_URL: Contains placeholders: ${maskedUrl}`));
      console.log(chalk.yellow('   Detected unreplaced placeholder pattern (e.g., $$cap_*$$).'));
      console.log(chalk.yellow('   Please replace with actual database credentials.'));
    }
    // Check for dummy database
    else if (dbUrl.includes('dummy:dummy')) {
      if (nodeEnv === 'production') {
        criticalErrors.push('DATABASE_URL is using dummy credentials in production');
        console.log(chalk.red('❌ DATABASE_URL: Using DUMMY credentials'));
        console.log(chalk.yellow('   You must configure a real database in production!'));
      } else {
        warnings.push('DATABASE_URL is using dummy credentials (OK for development)');
        console.log(chalk.yellow('⚠️  DATABASE_URL: Using dummy credentials (OK for dev/build)'));
      }
    } else {
      // Validate format
      if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
        warnings.push('DATABASE_URL may have invalid format');
        console.log(chalk.yellow('⚠️  DATABASE_URL: May have invalid format (should start with postgresql://)'));
      } else {
        // Mask password in output
        const maskedUrl = dbUrl.replace(/:([^@]+)@/, ':****@');
        console.log(chalk.green(`✅ DATABASE_URL: ${maskedUrl}`));
        
        // Warn if using localhost in production
        if (nodeEnv === 'production' && dbUrl.includes('localhost')) {
          warnings.push('DATABASE_URL points to localhost in production');
          console.log(chalk.yellow('   ⚠️  Warning: Using localhost in production'));
        }
      }
    }
  }

  // Test database connectivity (optional, non-blocking)
  if (process.env.DATABASE_URL && 
      !process.env.DATABASE_URL.includes('dummy:dummy') &&
      !hasPlaceholders(process.env.DATABASE_URL)) {
    console.log(chalk.blue('\nTesting database connectivity and admin setup...'));
    
    // Import and test connection (with timeout)
    const testConnection = async () => {
      try {
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Connection timeout')), 5000)
        );
        
        const connectPromise = prisma.$queryRaw`SELECT 1`;
        
        await Promise.race([connectPromise, timeoutPromise]);
        
        console.log(chalk.green('✅ Database connection successful!'));
        
        // Check if admin user exists (non-blocking warning)
        try {
          const adminUser = await prisma.user.findUnique({
            where: { email: 'admin@damdayvillage.org' }
          });
          
          if (!adminUser) {
            console.log(chalk.yellow('⚠️  Admin user not found in database'));
            console.log(chalk.yellow('   To create admin user:'));
            console.log(chalk.yellow('   • Visit: https://your-domain.com/api/admin/init (easiest)'));
            console.log(chalk.yellow('   • Or run: npm run db:seed'));
            console.log(chalk.yellow('   Default credentials: admin@damdayvillage.org / Admin@123'));
            console.log(chalk.yellow('   📖 See: https://your-domain.com/help/admin-500 for full guide'));
            warnings.push('Admin user not found - visit /api/admin/init or run db:seed');
          } else {
            console.log(chalk.green('✅ Admin user exists'));
            console.log(chalk.blue(`   Email: ${adminUser.email}`));
            console.log(chalk.blue(`   Role: ${adminUser.role}`));
          }
        } catch (adminCheckError) {
          console.log(chalk.yellow('⚠️  Could not verify admin user (database may need migration)'));
          console.log(chalk.yellow('   Run: npx prisma migrate deploy'));
        }
        
        await prisma.$disconnect();
        return true;
      } catch (error) {
        const errorMsg = error.message || 'Unknown error';
        console.log(chalk.yellow(`⚠️  Database connection test failed: ${errorMsg}`));
        console.log(chalk.yellow('   App will start but database operations may fail.'));
        console.log(chalk.yellow('   Please verify DATABASE_URL and ensure PostgreSQL is running.'));
        return false;
      }
    };
    
    // Run test asynchronously (don't block startup)
    testConnection().catch(() => {});
  }

  // Print summary
  console.log(chalk.blue('\n' + '='.repeat(60) + '\n'));

  if (criticalErrors.length > 0) {
    console.log(chalk.red('❌ CRITICAL ERRORS FOUND:\n'));
    criticalErrors.forEach(error => {
      console.log(chalk.red(`   • ${error}`));
    });
    console.log(chalk.yellow('\n📚 For help, see:'));
    console.log(chalk.yellow('   • Visit /help/admin-500 in your browser for instant diagnostics'));
    console.log(chalk.yellow('   • Check /admin-panel/status for system health'));
    console.log(chalk.yellow('   • CAPROVER_ADMIN_PANEL_FIX.md - Complete fix guide'));
    console.log(chalk.yellow('   • QUICK_FIX_ADMIN_500.md - Quick reference\n'));
    
    if (nodeEnv === 'production') {
      console.log(chalk.red('🛑 Cannot start in production mode with these errors.\n'));
      console.log(chalk.yellow('💡 Quick fixes:'));
      console.log(chalk.yellow('   1. Replace all $$cap_*$$ placeholders with actual values'));
      console.log(chalk.yellow('   2. Generate NEXTAUTH_SECRET: openssl rand -base64 32'));
      console.log(chalk.yellow('   3. Set NEXTAUTH_URL to your actual domain (e.g., https://damdayvillage.com)'));
      console.log(chalk.yellow('   4. Configure DATABASE_URL with real PostgreSQL credentials'));
      console.log(chalk.yellow('\n🔗 After fixing and deploying, visit these URLs:'));
      console.log(chalk.yellow('   • https://your-domain.com/help/admin-500 - Fix guide'));
      console.log(chalk.yellow('   • https://your-domain.com/api/admin/init - Create admin user\n'));
      process.exit(1);
    } else {
      console.log(chalk.yellow('⚠️  Starting anyway (development mode)...\n'));
    }
  } else if (warnings.length > 0) {
    console.log(chalk.yellow('⚠️  WARNINGS:\n'));
    warnings.forEach(warning => {
      console.log(chalk.yellow(`   • ${warning}`));
    });
    console.log(chalk.green('\n✅ Starting application...\n'));
  } else {
    console.log(chalk.green('✅ All configuration checks passed!\n'));
    console.log(chalk.green('🚀 Starting application...\n'));
  }
}

// Run the check
checkStartupConfiguration();
