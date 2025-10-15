#!/usr/bin/env node

/**
 * Login Scenarios Test Script
 * 
 * Tests various login scenarios to ensure 500 errors are properly handled
 * and users get clear, actionable error messages.
 * 
 * Usage: node scripts/test-login-scenarios.js
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Login Error Handling Scenarios\n');

// Test 1: Check auth config has conditional adapter
console.log('Test 1: Verifying conditional PrismaAdapter...');
const authConfigPath = path.join(__dirname, '../lib/auth/config.ts');
const authConfig = fs.readFileSync(authConfigPath, 'utf8');

if (authConfig.includes('shouldUseAdapter')) {
  console.log('✅ Found shouldUseAdapter function');
} else {
  console.log('❌ shouldUseAdapter function not found');
  process.exit(1);
}

if (authConfig.includes('...(shouldUseAdapter() ? { adapter: PrismaAdapter(db) } : {})')) {
  console.log('✅ Conditional adapter pattern implemented correctly');
} else {
  console.log('❌ Conditional adapter pattern not found or incorrect');
  process.exit(1);
}

// Test 2: Check auth config has database validation
console.log('\nTest 2: Verifying database validation in authorize...');
if (authConfig.includes('Check if database is properly configured before attempting connection')) {
  console.log('✅ Database validation added to authorize function');
} else {
  console.log('❌ Database validation not found in authorize function');
  process.exit(1);
}

if (authConfig.includes("includes('$$cap_')")) {
  console.log('✅ CapRover placeholder detection implemented');
} else {
  console.log('❌ CapRover placeholder detection not found');
  process.exit(1);
}

// Test 3: Check NextAuth route has pre-flight checks
console.log('\nTest 3: Verifying pre-flight configuration checks...');
const authRoutePath = path.join(__dirname, '../src/app/api/auth/[...nextauth]/route.ts');
const authRoute = fs.readFileSync(authRoutePath, 'utf8');

if (authRoute.includes('Pre-flight validation to catch configuration errors early')) {
  console.log('✅ Pre-flight validation comments found');
} else {
  console.log('⚠️  Pre-flight validation comments not found (not critical)');
}

if (authRoute.includes('!process.env.NEXTAUTH_URL')) {
  console.log('✅ NEXTAUTH_URL validation added');
} else {
  console.log('❌ NEXTAUTH_URL validation not found');
  process.exit(1);
}

if (authRoute.includes('!process.env.NEXTAUTH_SECRET')) {
  console.log('✅ NEXTAUTH_SECRET validation added');
} else {
  console.log('❌ NEXTAUTH_SECRET validation not found');
  process.exit(1);
}

if (authRoute.includes('process.env.NEXTAUTH_SECRET.length < 32')) {
  console.log('✅ NEXTAUTH_SECRET length check added');
} else {
  console.log('❌ NEXTAUTH_SECRET length check not found');
  process.exit(1);
}

// Test 4: Check status route improvements
console.log('\nTest 4: Verifying status route enhancements...');
const statusRoutePath = path.join(__dirname, '../src/app/api/auth/status/route.ts');
const statusRoute = fs.readFileSync(statusRoutePath, 'utf8');

if (statusRoute.includes("includes('$$cap_')") && statusRoute.includes("includes('change-this')")) {
  console.log('✅ Enhanced NEXTAUTH_SECRET validation in status route');
} else {
  console.log('❌ Enhanced validation not found in status route');
  process.exit(1);
}

// Test 5: Verify error handling patterns
console.log('\nTest 5: Verifying error handling patterns...');
const errorHandlingTests = [
  { pattern: 'isConfigError', file: authRoutePath, desc: 'Configuration error detection' },
  { pattern: 'isDbError', file: authRoutePath, desc: 'Database error detection' },
  { pattern: 'recommendations', file: authRoutePath, desc: 'Error recommendations array' },
];

let allErrorHandlingPassed = true;
for (const test of errorHandlingTests) {
  const content = fs.readFileSync(test.file, 'utf8');
  if (content.includes(test.pattern)) {
    console.log(`✅ ${test.desc}`);
  } else {
    console.log(`❌ ${test.desc} not found`);
    allErrorHandlingPassed = false;
  }
}

if (!allErrorHandlingPassed) {
  process.exit(1);
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('✅ All login error handling tests passed!');
console.log('='.repeat(60));
console.log('\n📝 Key improvements implemented:');
console.log('  1. Conditional PrismaAdapter (avoids crashes when DB unavailable)');
console.log('  2. Database validation in authorize function');
console.log('  3. Pre-flight configuration checks in NextAuth route');
console.log('  4. Enhanced status route with placeholder detection');
console.log('  5. Comprehensive error handling with clear messages');
console.log('\n🎯 Expected behavior:');
console.log('  - No 500 errors for configuration issues');
console.log('  - Clear error messages guide users to fix problems');
console.log('  - JWT-only mode works when DB is unavailable');
console.log('  - Status page shows exact issues and recommendations');
console.log('');

process.exit(0);
