#!/usr/bin/env node

/**
 * CapRover Deployment Diagnostic Script
 * 
 * Comprehensive diagnostic tool for troubleshooting CapRover deployment issues,
 * especially the common "500 Internal Server Error" on admin panel login.
 * 
 * Usage: node scripts/caprover-diagnostic.js [domain]
 * Example: node scripts/caprover-diagnostic.js https://village.captain.yourdomain.com
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
      cyan: (s) => s,
      magenta: (s) => s,
      bold: (s) => s,
      underline: (s) => s,
    };
  }
})();

const domain = process.argv[2] || process.env.NEXTAUTH_URL || 'http://localhost:3000';

console.log(chalk.blue.bold('\n╔═══════════════════════════════════════════════════════════╗'));
console.log(chalk.blue.bold('║   CapRover 500 Error Diagnostic Tool                     ║'));
console.log(chalk.blue.bold('╚═══════════════════════════════════════════════════════════╝\n'));
console.log(chalk.cyan(`Testing domain: ${chalk.bold(domain)}\n`));

/**
 * Check if a value contains unreplaced placeholders
 */
function hasPlaceholders(value) {
  if (!value) return false;
  
  const placeholderPatterns = [
    /\$\$cap_[^$]+\$\$/,     // CapRover placeholders
    /\$\{[^}]+\}/,           // Template literals
    /your-[a-z-]+/i,         // Patterns like your-domain
    /change-me/i,
    /example\./i,
    /placeholder/i,
  ];
  
  return placeholderPatterns.some(pattern => pattern.test(value));
}

/**
 * Check environment variables locally
 */
function checkLocalEnvironment() {
  console.log(chalk.blue.bold('📋 PHASE 1: LOCAL ENVIRONMENT CHECKS\n'));
  
  const issues = [];
  const warnings = [];
  
  // Check NODE_ENV
  const nodeEnv = process.env.NODE_ENV || 'development';
  console.log(chalk.cyan(`Environment: ${chalk.bold(nodeEnv)}`));
  
  if (nodeEnv !== 'production') {
    warnings.push('NODE_ENV is not set to production');
  }
  
  // Check NEXTAUTH_URL
  console.log(chalk.blue('\n1️⃣  NEXTAUTH_URL'));
  if (!process.env.NEXTAUTH_URL) {
    console.log(chalk.red('   ❌ NOT SET'));
    issues.push({
      severity: 'CRITICAL',
      issue: 'NEXTAUTH_URL is not set',
      fix: 'Set NEXTAUTH_URL to your actual domain in CapRover App Configs',
      command: 'NEXTAUTH_URL=https://your-domain.com'
    });
  } else {
    const authUrl = process.env.NEXTAUTH_URL;
    const maskedUrl = authUrl.length > 50 ? authUrl.substring(0, 50) + '...' : authUrl;
    
    if (hasPlaceholders(authUrl)) {
      console.log(chalk.red(`   ❌ CONTAINS PLACEHOLDERS: ${maskedUrl}`));
      issues.push({
        severity: 'CRITICAL',
        issue: 'NEXTAUTH_URL contains unreplaced $$cap_*$$ placeholders',
        fix: 'Replace with actual domain in CapRover dashboard',
        command: 'NEXTAUTH_URL=https://your-domain.com'
      });
    } else {
      console.log(chalk.green(`   ✅ ${maskedUrl}`));
      
      if (nodeEnv === 'production' && authUrl.startsWith('http://')) {
        console.log(chalk.yellow('   ⚠️  Using HTTP in production (HTTPS recommended)'));
        warnings.push('NEXTAUTH_URL uses HTTP instead of HTTPS in production');
      }
    }
  }
  
  // Check NEXTAUTH_SECRET
  console.log(chalk.blue('\n2️⃣  NEXTAUTH_SECRET'));
  if (!process.env.NEXTAUTH_SECRET) {
    console.log(chalk.red('   ❌ NOT SET'));
    issues.push({
      severity: 'CRITICAL',
      issue: 'NEXTAUTH_SECRET is not set',
      fix: 'Generate and set NEXTAUTH_SECRET',
      command: 'openssl rand -base64 32'
    });
  } else {
    const secret = process.env.NEXTAUTH_SECRET;
    const secretLength = secret.length;
    
    // Check for dummy values
    const dummyValues = [
      'dummy-secret-for-build',
      'dummy-secret-for-build-only-not-secure',
      'your-nextauth-secret-key',
      'change-me',
      'secret',
    ];
    
    if (dummyValues.some(dummy => secret.includes(dummy))) {
      console.log(chalk.red(`   ❌ USING DUMMY VALUE (${secretLength} chars)`));
      issues.push({
        severity: 'CRITICAL',
        issue: 'NEXTAUTH_SECRET is using a dummy/placeholder value',
        fix: 'Generate a secure secret and replace the dummy value',
        command: 'openssl rand -base64 32'
      });
    } else if (secretLength < 32) {
      console.log(chalk.red(`   ❌ TOO SHORT (${secretLength} chars, need 32+)`));
      issues.push({
        severity: 'CRITICAL',
        issue: `NEXTAUTH_SECRET is too short (${secretLength} characters)`,
        fix: 'Generate a longer secret (minimum 32 characters)',
        command: 'openssl rand -base64 32'
      });
    } else {
      console.log(chalk.green(`   ✅ Valid (${secretLength} characters)`));
    }
  }
  
  // Check DATABASE_URL
  console.log(chalk.blue('\n3️⃣  DATABASE_URL'));
  if (!process.env.DATABASE_URL) {
    console.log(chalk.red('   ❌ NOT SET'));
    issues.push({
      severity: 'CRITICAL',
      issue: 'DATABASE_URL is not set',
      fix: 'Configure DATABASE_URL with PostgreSQL connection string',
      command: 'DATABASE_URL=postgresql://user:pass@srv-captain--postgres:5432/db'
    });
  } else {
    const dbUrl = process.env.DATABASE_URL;
    const maskedDbUrl = dbUrl.replace(/:([^@]+)@/, ':****@');
    
    if (dbUrl.includes('dummy:dummy')) {
      if (nodeEnv === 'production') {
        console.log(chalk.red('   ❌ USING DUMMY DATABASE IN PRODUCTION'));
        issues.push({
          severity: 'CRITICAL',
          issue: 'DATABASE_URL is using dummy credentials in production',
          fix: 'Configure real PostgreSQL connection in CapRover',
          command: 'DATABASE_URL=postgresql://user:pass@srv-captain--postgres:5432/db'
        });
      } else {
        console.log(chalk.yellow('   ⚠️  Using dummy database (OK for dev/build)'));
      }
    } else if (hasPlaceholders(dbUrl)) {
      console.log(chalk.red(`   ❌ CONTAINS PLACEHOLDERS: ${maskedDbUrl}`));
      issues.push({
        severity: 'CRITICAL',
        issue: 'DATABASE_URL contains unreplaced $$cap_*$$ placeholders',
        fix: 'Replace with actual PostgreSQL connection string',
        command: 'DATABASE_URL=postgresql://user:pass@srv-captain--postgres:5432/db'
      });
    } else {
      console.log(chalk.green(`   ✅ ${maskedDbUrl}`));
      
      // Check for CapRover internal service name (this is good!)
      if (dbUrl.includes('srv-captain--')) {
        console.log(chalk.cyan('   ℹ️  Using CapRover internal service (correct!)'));
      }
      
      // Validate format
      if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
        console.log(chalk.yellow('   ⚠️  URL format may be invalid (should start with postgresql://)'));
        warnings.push('DATABASE_URL may have invalid format');
      }
    }
  }
  
  return { issues, warnings };
}

/**
 * Test remote endpoints
 */
async function checkRemoteEndpoints() {
  console.log(chalk.blue.bold('\n\n🌐 PHASE 2: REMOTE ENDPOINT CHECKS\n'));
  
  const endpoints = [
    { url: `${domain}/api/health`, name: 'Health Check', required: true },
    { url: `${domain}/api/auth/status`, name: 'Auth Status', required: true },
    { url: `${domain}/api/admin/check-env`, name: 'Environment Config', required: true },
    { url: `${domain}/api/admin/verify-setup`, name: 'Admin Verification', required: true },
    { url: `${domain}/admin-panel/status`, name: 'Status Page', required: false },
  ];
  
  const results = [];
  
  for (const endpoint of endpoints) {
    process.stdout.write(chalk.cyan(`Checking ${endpoint.name}... `));
    
    try {
      const https = endpoint.url.startsWith('https') ? require('https') : require('http');
      
      const result = await new Promise((resolve) => {
        const req = https.get(endpoint.url, { timeout: 10000 }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              const json = JSON.parse(data);
              resolve({ success: true, status: res.statusCode, data: json });
            } catch {
              resolve({ success: true, status: res.statusCode, data: data });
            }
          });
        });
        
        req.on('error', (error) => {
          resolve({ success: false, error: error.message });
        });
        
        req.on('timeout', () => {
          req.destroy();
          resolve({ success: false, error: 'Request timeout' });
        });
      });
      
      if (result.success && result.status === 200) {
        console.log(chalk.green('✅ OK'));
        results.push({ endpoint: endpoint.name, status: 'OK', data: result.data });
      } else if (result.success) {
        console.log(chalk.yellow(`⚠️  Status ${result.status}`));
        results.push({ endpoint: endpoint.name, status: 'WARNING', code: result.status });
      } else {
        console.log(chalk.red(`❌ ${result.error}`));
        results.push({ endpoint: endpoint.name, status: 'FAILED', error: result.error });
      }
    } catch (error) {
      console.log(chalk.red(`❌ ${error.message}`));
      results.push({ endpoint: endpoint.name, status: 'FAILED', error: error.message });
    }
  }
  
  return results;
}

/**
 * Test database connection (if running locally)
 */
async function checkDatabaseConnection() {
  console.log(chalk.blue.bold('\n\n💾 PHASE 3: DATABASE CONNECTION CHECK\n'));
  
  if (!process.env.DATABASE_URL) {
    console.log(chalk.yellow('⚠️  DATABASE_URL not set - skipping database check'));
    return { skipped: true };
  }
  
  if (process.env.DATABASE_URL.includes('dummy:dummy')) {
    console.log(chalk.yellow('⚠️  Using dummy database - skipping connection test'));
    return { skipped: true };
  }
  
  if (hasPlaceholders(process.env.DATABASE_URL)) {
    console.log(chalk.red('❌ DATABASE_URL contains placeholders - cannot test connection'));
    return { skipped: true, error: 'Contains placeholders' };
  }
  
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient({ log: ['error'] });
    
    console.log(chalk.cyan('Testing database connection...'));
    
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000)
    );
    
    const queryPromise = prisma.$queryRaw`SELECT 1 as test`;
    
    await Promise.race([queryPromise, timeoutPromise]);
    console.log(chalk.green('✅ Database connected successfully\n'));
    
    // Check for admin user
    console.log(chalk.cyan('Checking for admin user...'));
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@damdayvillage.org' },
      select: { id: true, email: true, role: true, active: true, verified: true }
    });
    
    if (adminUser) {
      console.log(chalk.green('✅ Admin user exists'));
      console.log(chalk.cyan(`   Email: ${adminUser.email}`));
      console.log(chalk.cyan(`   Role: ${adminUser.role}`));
      console.log(chalk.cyan(`   Active: ${adminUser.active ? '✅' : '❌'}`));
      console.log(chalk.cyan(`   Verified: ${adminUser.verified ? '✅' : '❌'}`));
    } else {
      console.log(chalk.red('❌ Admin user not found'));
      console.log(chalk.yellow('   Create admin user:'));
      console.log(chalk.yellow('   • Visit: ' + domain + '/api/admin/init'));
      console.log(chalk.yellow('   • Or run: npm run db:seed'));
    }
    
    await prisma.$disconnect();
    
    return { 
      connected: true, 
      adminExists: !!adminUser,
      adminUser: adminUser ? {
        email: adminUser.email,
        role: adminUser.role,
        active: adminUser.active,
        verified: adminUser.verified
      } : null
    };
  } catch (error) {
    console.log(chalk.red('❌ Database connection failed'));
    console.log(chalk.yellow(`   Error: ${error.message}`));
    
    return { connected: false, error: error.message };
  }
}

/**
 * Generate comprehensive report
 */
function generateReport(localCheck, remoteResults, dbCheck) {
  console.log(chalk.blue.bold('\n\n' + '═'.repeat(70)));
  console.log(chalk.blue.bold('                     DIAGNOSTIC REPORT'));
  console.log(chalk.blue.bold('═'.repeat(70) + '\n'));
  
  const criticalIssues = localCheck.issues.filter(i => i.severity === 'CRITICAL');
  const warnings = localCheck.warnings;
  
  // Summary
  if (criticalIssues.length === 0 && warnings.length === 0) {
    console.log(chalk.green.bold('✅ ALL CHECKS PASSED!\n'));
    console.log(chalk.cyan('Your CapRover deployment should be working correctly.'));
    console.log(chalk.cyan('\nYou can now:'));
    console.log(chalk.cyan(`  1. Visit: ${domain}/admin-panel/status`));
    console.log(chalk.cyan(`  2. Login: ${domain}/admin-panel/login`));
    console.log(chalk.cyan('     Email: admin@damdayvillage.org'));
    console.log(chalk.cyan('     Password: Admin@123 (change after first login!)'));
  } else {
    console.log(chalk.red.bold(`❌ ${criticalIssues.length} CRITICAL ISSUE(S) FOUND\n`));
    
    criticalIssues.forEach((issue, idx) => {
      console.log(chalk.red(`${idx + 1}. ${issue.issue}`));
      console.log(chalk.yellow(`   Fix: ${issue.fix}`));
      console.log(chalk.cyan(`   Command: ${issue.command}\n`));
    });
    
    if (warnings.length > 0) {
      console.log(chalk.yellow.bold(`⚠️  ${warnings.length} WARNING(S):\n`));
      warnings.forEach((warning, idx) => {
        console.log(chalk.yellow(`${idx + 1}. ${warning}`));
      });
    }
  }
  
  // Quick fix guide
  console.log(chalk.blue.bold('\n' + '─'.repeat(70)));
  console.log(chalk.blue.bold('QUICK FIX STEPS:\n'));
  
  console.log(chalk.cyan('1. Go to CapRover Dashboard → Your App → App Configs'));
  console.log(chalk.cyan('2. Find Environment Variables section'));
  console.log(chalk.cyan('3. Replace ALL variables containing $$cap_*$$'));
  console.log(chalk.cyan('4. Click Save & Update'));
  console.log(chalk.cyan('5. Wait for redeploy (2-3 minutes)'));
  console.log(chalk.cyan('6. Visit: ' + domain + '/api/admin/init'));
  console.log(chalk.cyan('7. Check: ' + domain + '/admin-panel/status'));
  
  // Documentation links
  console.log(chalk.blue.bold('\n' + '─'.repeat(70)));
  console.log(chalk.blue.bold('DOCUMENTATION:\n'));
  console.log(chalk.cyan('📖 English: CAPROVER_500_FIX_GUIDE.md'));
  console.log(chalk.cyan('📖 Hindi: CAPROVER_500_FIX_GUIDE_HINDI.md'));
  console.log(chalk.cyan('📖 General: CAPGUIDE.md'));
  console.log(chalk.cyan('📖 Troubleshooting: docs/PRODUCTION_LOGIN_TROUBLESHOOTING.md'));
  
  console.log(chalk.blue.bold('\n' + '═'.repeat(70) + '\n'));
  
  // Exit code
  return criticalIssues.length > 0 ? 1 : 0;
}

/**
 * Main diagnostic routine
 */
async function runDiagnostics() {
  try {
    // Phase 1: Local environment
    const localCheck = checkLocalEnvironment();
    
    // Phase 2: Remote endpoints
    const remoteResults = await checkRemoteEndpoints();
    
    // Phase 3: Database (if possible)
    const dbCheck = await checkDatabaseConnection();
    
    // Generate report
    const exitCode = generateReport(localCheck, remoteResults, dbCheck);
    
    process.exit(exitCode);
  } catch (error) {
    console.error(chalk.red('\n❌ Diagnostic tool error:'), error.message);
    console.error(chalk.yellow('\nPlease check:'));
    console.error(chalk.yellow('  1. Node.js is installed (node --version)'));
    console.error(chalk.yellow('  2. Dependencies are installed (npm install)'));
    console.error(chalk.yellow('  3. You are in the project root directory'));
    process.exit(1);
  }
}

// Run diagnostics
runDiagnostics();
