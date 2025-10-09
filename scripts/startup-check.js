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
    console.log(chalk.green(`✅ NEXTAUTH_URL: ${process.env.NEXTAUTH_URL}`));
    
    // Warn if using http in production
    if (nodeEnv === 'production' && process.env.NEXTAUTH_URL.startsWith('http://')) {
      warnings.push('NEXTAUTH_URL uses HTTP in production (should use HTTPS)');
      console.log(chalk.yellow('   ⚠️  Warning: Using HTTP in production (HTTPS recommended)'));
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
    
    // Check for dummy database
    if (dbUrl.includes('dummy:dummy')) {
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

  // Print summary
  console.log(chalk.blue('\n' + '='.repeat(60) + '\n'));

  if (criticalErrors.length > 0) {
    console.log(chalk.red.bold('❌ CRITICAL ERRORS FOUND:\n'));
    criticalErrors.forEach(error => {
      console.log(chalk.red(`   • ${error}`));
    });
    console.log(chalk.yellow('\n📚 For help, see: docs/PRODUCTION_SETUP_GUIDE.md\n'));
    
    if (nodeEnv === 'production') {
      console.log(chalk.red('🛑 Cannot start in production mode with these errors.\n'));
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
