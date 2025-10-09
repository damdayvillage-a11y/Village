#!/usr/bin/env node

/**
 * Verify Admin Setup Script
 * 
 * This script checks if the admin user exists and can be used for login.
 * Run with: node scripts/verify-admin.js
 */

const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const db = new PrismaClient();

async function verifyAdmin() {
  console.log('🔍 Verifying admin setup...\n');

  try {
    // Check if admin user exists
    const adminUser = await db.user.findUnique({
      where: { email: 'admin@damdayvillage.org' }
    });

    if (!adminUser) {
      console.log('❌ Admin user not found!');
      console.log('💡 Run: npm run db:seed');
      return false;
    }

    console.log('✅ Admin user found:');
    console.log(`   - Name: ${adminUser.name}`);
    console.log(`   - Email: ${adminUser.email}`);
    console.log(`   - Role: ${adminUser.role}`);
    console.log(`   - Verified: ${adminUser.verified ? '✅' : '❌'}`);
    console.log(`   - Active: ${adminUser.active ? '✅' : '❌'}`);

    // Check if password is set
    if (!adminUser.password) {
      console.log('❌ Admin password not set!');
      console.log('💡 Run: npm run db:seed');
      return false;
    }

    console.log('✅ Admin password is set');

    // Test password verification
    const testPassword = 'Admin@123';
    const isValidPassword = await argon2.verify(adminUser.password, testPassword);

    if (isValidPassword) {
      console.log('✅ Default password verification successful');
    } else {
      console.log('⚠️  Default password has been changed (this is good for production!)');
    }

    // Check host user too
    const hostUser = await db.user.findUnique({
      where: { email: 'host@damdayvillage.org' }
    });

    if (hostUser && hostUser.password) {
      console.log('✅ Host user is also set up');
    }

    console.log('\n🎉 Admin setup verification complete!');
    console.log('\n🔑 You can now log in with:');
    console.log('   Email: admin@damdayvillage.org');
    console.log('   Password: Admin@123 (unless changed)');
    console.log('\n🌐 Admin panel: http://localhost:3000/admin-panel');

    return true;

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    
    if (error.message.includes('connect')) {
      console.log('\n💡 Database connection failed. Make sure:');
      console.log('   1. Database is running');
      console.log('   2. DATABASE_URL is set in .env');
      console.log('   3. Database schema is migrated');
    }

    return false;
  } finally {
    await db.$disconnect();
  }
}

// Run the verification
verifyAdmin()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });