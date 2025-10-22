#!/usr/bin/env node

/**
 * Migration script to create village_leaders table
 * This script can be run independently without Prisma CLI
 * Usage: node scripts/migrate-village-leaders.js
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  console.error('Please set DATABASE_URL in your .env file');
  process.exit(1);
}

async function runMigration() {
  console.log('🚀 Starting village_leaders table migration...\n');
  
  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  try {
    // Test connection
    console.log('📡 Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful\n');

    // Read the SQL migration file
    const sqlPath = path.join(__dirname, 'create-village-leaders-table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('📝 Executing migration SQL...');
    
    // Execute the migration
    await pool.query(sql);
    
    console.log('✅ Migration completed successfully!\n');

    // Verify the table exists
    console.log('🔍 Verifying table creation...');
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'village_leaders'
    `);

    if (result.rows.length > 0) {
      console.log('✅ Table "village_leaders" exists\n');
      
      // Count records
      const countResult = await pool.query('SELECT COUNT(*) as count FROM village_leaders');
      const count = countResult.rows[0].count;
      console.log(`📊 Total records in village_leaders: ${count}\n`);
      
      // Display sample data
      if (count > 0) {
        console.log('👥 Sample leaders:');
        const leaders = await pool.query('SELECT name, position, priority FROM village_leaders ORDER BY priority LIMIT 5');
        leaders.rows.forEach(leader => {
          console.log(`  - ${leader.name} (${leader.position}) [Priority: ${leader.priority}]`);
        });
        console.log('');
      }
    } else {
      console.error('❌ Table "village_leaders" was not created');
      process.exit(1);
    }

    console.log('🎉 Migration completed successfully!');
    console.log('📋 Next steps:');
    console.log('  1. Run: npm run db:generate (to regenerate Prisma client)');
    console.log('  2. Restart your application server');
    console.log('  3. Visit /admin-panel/leadership to manage leaders');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migration
runMigration().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
