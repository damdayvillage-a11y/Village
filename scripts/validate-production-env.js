#!/usr/bin/env node

/**
 * Production Environment Validation Script
 * Validates that all required environment variables are set for production deployment
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
    };
  }
})();

// Required environment variables for production
const REQUIRED_VARS = [
  'NODE_ENV',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'DATABASE_URL',
];

// Optional but recommended variables
const RECOMMENDED_VARS = [
  'SENTRY_DSN',
  'EMAIL_SERVER_HOST',
  'EMAIL_FROM',
];

// Variables that should NOT be set to dummy values
const NO_DUMMY_VALUES = [
  { var: 'DATABASE_URL', dummyValue: 'postgresql://dummy:dummy@localhost:5432/dummy' },
  { var: 'NEXTAUTH_SECRET', dummyValue: 'dummy-secret-for-build' },
  { var: 'NEXTAUTH_SECRET', dummyValue: 'dummy-secret-for-build-only-not-secure' },
  { var: 'NEXTAUTH_SECRET', dummyValue: 'your-nextauth-secret-key' },
];

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

function validateEnvironment() {
  console.log(chalk.blue('\n🔍 Validating production environment...\n'));
  
  let hasErrors = false;
  let hasWarnings = false;

  // Check NODE_ENV
  if (process.env.NODE_ENV !== 'production') {
    console.log(chalk.yellow('⚠️  Warning: NODE_ENV is not set to "production"'));
    console.log(chalk.yellow(`   Current value: ${process.env.NODE_ENV || 'not set'}\n`));
    hasWarnings = true;
  }

  // Check required variables
  console.log(chalk.blue('Required Variables:'));
  for (const varName of REQUIRED_VARS) {
    if (!process.env[varName]) {
      console.log(chalk.red(`❌ ${varName}: NOT SET`));
      hasErrors = true;
    } else {
      console.log(chalk.green(`✅ ${varName}: Set`));
    }
  }

  // Check for dummy values
  console.log(chalk.blue('\nChecking for dummy values:'));
  for (const { var: varName, dummyValue } of NO_DUMMY_VALUES) {
    if (process.env[varName] === dummyValue) {
      console.log(chalk.red(`❌ ${varName}: Contains dummy value "${dummyValue}"`));
      hasErrors = true;
    } else if (process.env[varName]) {
      console.log(chalk.green(`✅ ${varName}: Valid value set`));
    }
  }

  // Check NEXTAUTH_SECRET length
  if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
    console.log(chalk.red(`❌ NEXTAUTH_SECRET: Too short (${process.env.NEXTAUTH_SECRET.length} chars, minimum 32)`));
    hasErrors = true;
  }

  // Check recommended variables
  console.log(chalk.blue('\nRecommended Variables:'));
  for (const varName of RECOMMENDED_VARS) {
    if (!process.env[varName]) {
      console.log(chalk.yellow(`⚠️  ${varName}: Not set (optional but recommended)`));
      hasWarnings = true;
    } else {
      console.log(chalk.green(`✅ ${varName}: Set`));
    }
  }

  // Check database URL format
  if (process.env.DATABASE_URL) {
    const dbUrl = process.env.DATABASE_URL;
    
    // Check for unreplaced placeholders (but allow dummy:dummy for build)
    if (hasPlaceholders(dbUrl) && !dbUrl.includes('dummy:dummy')) {
      const maskedUrl = dbUrl.replace(/:([^@]+)@/, ':****@');
      console.log(chalk.red(`\n❌ DATABASE_URL: Contains unreplaced placeholders: ${maskedUrl}`));
      console.log(chalk.yellow('   Detected placeholder pattern (e.g., $$cap_*$$)'));
      console.log(chalk.yellow('   Must be replaced with actual database credentials'));
      hasErrors = true;
    } else if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
      console.log(chalk.red('\n❌ DATABASE_URL: Invalid format (should start with postgresql:// or postgres://)'));
      hasErrors = true;
    } else if (dbUrl.includes('localhost') && process.env.NODE_ENV === 'production') {
      console.log(chalk.yellow('\n⚠️  Warning: DATABASE_URL points to localhost in production'));
      hasWarnings = true;
    }
  }

  // Check NEXTAUTH_URL format
  if (process.env.NEXTAUTH_URL) {
    const authUrl = process.env.NEXTAUTH_URL;
    
    // Check for unreplaced placeholders
    if (hasPlaceholders(authUrl)) {
      console.log(chalk.red(`\n❌ NEXTAUTH_URL: Contains unreplaced placeholders: ${authUrl}`));
      console.log(chalk.yellow('   Detected placeholder pattern (e.g., $$cap_*$$, your-domain, etc.)'));
      console.log(chalk.yellow('   Must be replaced with actual domain like: https://damdayvillage.com'));
      hasErrors = true;
    } else if (process.env.NODE_ENV === 'production' && !authUrl.startsWith('https://')) {
      console.log(chalk.red('\n❌ NEXTAUTH_URL: Should use HTTPS in production'));
      hasErrors = true;
    } else if (authUrl.startsWith('http://localhost')) {
      console.log(chalk.yellow('\n⚠️  Warning: NEXTAUTH_URL points to localhost'));
      hasWarnings = true;
    }
  }

  // Summary
  console.log(chalk.blue('\n' + '='.repeat(60)));
  if (hasErrors) {
    console.log(chalk.red('\n❌ Validation FAILED - Please fix the errors above\n'));
    process.exit(1);
  } else if (hasWarnings) {
    console.log(chalk.yellow('\n⚠️  Validation passed with warnings\n'));
    process.exit(0);
  } else {
    console.log(chalk.green('\n✅ All validations passed - Ready for production!\n'));
    process.exit(0);
  }
}

// Run validation
validateEnvironment();
