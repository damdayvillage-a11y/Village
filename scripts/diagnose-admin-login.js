#!/usr/bin/env node

/**
 * Admin Login Diagnostic Script
 * 
 * Runs comprehensive checks to diagnose admin panel 500 errors
 * Usage: node scripts/diagnose-admin-login.js [domain]
 * 
 * Example: node scripts/diagnose-admin-login.js https://damdayvillage.com
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
      cyan: (s) => s,
    };
  }
})();

const domain = process.argv[2] || process.env.NEXTAUTH_URL || 'http://localhost:3000';

console.log(chalk.blue.bold('\n🔍 Admin Login Diagnostic Tool\n'));
console.log(chalk.cyan(`Testing domain: ${domain}\n`));

async function checkEndpoint(url, description) {
  try {
    const https = url.startsWith('https') ? require('https') : require('http');
    
    return new Promise((resolve) => {
      const req = https.get(url, { timeout: 10000 }, (res) => {
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
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function runDiagnostics() {
  const results = [];
  
  // Test 1: Health Check
  console.log(chalk.blue('1. Testing API Health...'));
  const healthCheck = await checkEndpoint(`${domain}/api/health`, 'Health Check');
  
  if (healthCheck.success && healthCheck.status === 200) {
    console.log(chalk.green('   ✅ API is responding'));
    if (healthCheck.data && healthCheck.data.services) {
      const dbStatus = healthCheck.data.services.database?.status;
      if (dbStatus === 'healthy') {
        console.log(chalk.green('   ✅ Database is connected'));
      } else if (dbStatus === 'skip') {
        console.log(chalk.yellow('   ⚠️  Database check skipped (build mode)'));
      } else {
        console.log(chalk.red('   ❌ Database is not healthy'));
        results.push({ issue: 'Database connection failed', severity: 'critical' });
      }
    }
  } else {
    console.log(chalk.red('   ❌ API health check failed'));
    console.log(chalk.yellow(`      Error: ${healthCheck.error || healthCheck.status}`));
    results.push({ issue: 'API not responding', severity: 'critical' });
  }
  
  // Test 2: Environment Configuration
  console.log(chalk.blue('\n2. Checking Environment Configuration...'));
  const envCheck = await checkEndpoint(`${domain}/api/admin/check-env`, 'Environment Check');
  
  if (envCheck.success && envCheck.data) {
    if (envCheck.data.configured) {
      console.log(chalk.green('   ✅ Environment variables are properly configured'));
    } else {
      console.log(chalk.red('   ❌ Environment configuration issues detected'));
      if (envCheck.data.errors) {
        envCheck.data.errors.forEach(err => {
          console.log(chalk.red(`      • ${err}`));
          results.push({ issue: err, severity: 'critical' });
        });
      }
    }
    
    if (envCheck.data.warnings && envCheck.data.warnings.length > 0) {
      console.log(chalk.yellow('   ⚠️  Warnings:'));
      envCheck.data.warnings.forEach(warn => {
        console.log(chalk.yellow(`      • ${warn}`));
      });
    }
  } else {
    console.log(chalk.yellow('   ⚠️  Could not verify environment configuration'));
  }
  
  // Test 3: Admin User Setup
  console.log(chalk.blue('\n3. Verifying Admin User...'));
  const adminCheck = await checkEndpoint(`${domain}/api/admin/verify-setup`, 'Admin Verification');
  
  if (adminCheck.success && adminCheck.data) {
    if (adminCheck.data.adminExists && adminCheck.data.configured) {
      console.log(chalk.green('   ✅ Admin user is properly configured'));
      console.log(chalk.cyan(`      Email: ${adminCheck.data.email}`));
    } else if (adminCheck.data.adminExists && !adminCheck.data.configured) {
      console.log(chalk.yellow('   ⚠️  Admin user exists but has issues'));
      if (adminCheck.data.issues) {
        adminCheck.data.issues.forEach(issue => {
          console.log(chalk.yellow(`      • ${issue}`));
          results.push({ issue: `Admin user: ${issue}`, severity: 'warning' });
        });
      }
    } else {
      console.log(chalk.red('   ❌ Admin user not found'));
      console.log(chalk.cyan('      Run: npm run db:seed'));
      console.log(chalk.cyan(`      Or visit: ${domain}/api/admin/init`));
      results.push({ issue: 'Admin user does not exist', severity: 'critical' });
    }
  } else {
    console.log(chalk.yellow('   ⚠️  Could not verify admin user'));
    if (adminCheck.error) {
      console.log(chalk.yellow(`      Error: ${adminCheck.error}`));
    }
  }
  
  // Test 4: Authentication Service
  console.log(chalk.blue('\n4. Testing Authentication Service...'));
  const authCheck = await checkEndpoint(`${domain}/api/auth/status`, 'Auth Status');
  
  if (authCheck.success) {
    console.log(chalk.green('   ✅ NextAuth service is responding'));
  } else {
    console.log(chalk.red('   ❌ Authentication service error'));
    results.push({ issue: 'NextAuth not responding', severity: 'critical' });
  }
  
  // Summary
  console.log(chalk.blue.bold('\n' + '='.repeat(60)));
  console.log(chalk.blue.bold('DIAGNOSTIC SUMMARY\n'));
  
  const criticalIssues = results.filter(r => r.severity === 'critical');
  const warnings = results.filter(r => r.severity === 'warning');
  
  if (criticalIssues.length === 0 && warnings.length === 0) {
    console.log(chalk.green('✅ All checks passed!'));
    console.log(chalk.cyan('\nYou should be able to login at:'));
    console.log(chalk.cyan(`   ${domain}/admin-panel/login`));
    console.log(chalk.cyan('\nDefault credentials:'));
    console.log(chalk.cyan('   Email: admin@damdayvillage.org'));
    console.log(chalk.cyan('   Password: Admin@123'));
    console.log(chalk.yellow('\n⚠️  Change password after first login!'));
  } else {
    if (criticalIssues.length > 0) {
      console.log(chalk.red.bold(`\n❌ ${criticalIssues.length} CRITICAL ISSUE(S) FOUND:\n`));
      criticalIssues.forEach((issue, i) => {
        console.log(chalk.red(`   ${i + 1}. ${issue.issue}`));
      });
    }
    
    if (warnings.length > 0) {
      console.log(chalk.yellow.bold(`\n⚠️  ${warnings.length} WARNING(S):\n`));
      warnings.forEach((issue, i) => {
        console.log(chalk.yellow(`   ${i + 1}. ${issue.issue}`));
      });
    }
    
    console.log(chalk.blue.bold('\n📝 RECOMMENDED ACTIONS:\n'));
    
    if (results.some(r => r.issue.includes('Database'))) {
      console.log(chalk.cyan('1. Fix database connection:'));
      console.log(chalk.cyan('   - Verify DATABASE_URL is correct'));
      console.log(chalk.cyan('   - Check PostgreSQL is running'));
      console.log(chalk.cyan('   - Test connection with: psql <DATABASE_URL>'));
    }
    
    if (results.some(r => r.issue.includes('Environment'))) {
      console.log(chalk.cyan('2. Fix environment variables:'));
      console.log(chalk.cyan('   - Replace all $$cap_*$$ placeholders'));
      console.log(chalk.cyan('   - Generate NEXTAUTH_SECRET: openssl rand -base64 32'));
      console.log(chalk.cyan('   - Set NEXTAUTH_URL to actual domain'));
      console.log(chalk.cyan('   - Run: npm run validate:env'));
    }
    
    if (results.some(r => r.issue.includes('Admin user'))) {
      console.log(chalk.cyan('3. Create admin user:'));
      console.log(chalk.cyan(`   - Visit: ${domain}/api/admin/init`));
      console.log(chalk.cyan('   - Or run: npm run db:seed'));
      console.log(chalk.cyan('   - Or run: curl -X POST ' + domain + '/api/admin/init'));
    }
    
    console.log(chalk.blue('\n📚 More help:'));
    console.log(chalk.cyan('   - Status page: ' + domain + '/admin-panel/status'));
    console.log(chalk.cyan('   - Documentation: ADMIN_500_FIX_GUIDE.md'));
    console.log(chalk.cyan('   - Setup guide: ADMIN_PANEL_SETUP.md'));
  }
  
  console.log(chalk.blue('\n' + '='.repeat(60) + '\n'));
  
  process.exit(criticalIssues.length > 0 ? 1 : 0);
}

// Run diagnostics
runDiagnostics().catch(error => {
  console.error(chalk.red('\n❌ Diagnostic tool error:'), error.message);
  process.exit(1);
});
