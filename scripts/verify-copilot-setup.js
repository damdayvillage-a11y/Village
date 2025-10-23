#!/usr/bin/env node

/**
 * GitHub Copilot Coding Agent Setup Verification Script
 * 
 * This script verifies that the Copilot MCP configuration is properly set up.
 * 
 * Usage: node scripts/verify-copilot-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('🤖 GitHub Copilot Coding Agent Setup Verification\n');
console.log('━'.repeat(60));

let hasErrors = false;
let hasWarnings = false;

// Check 1: MCP configuration file exists
console.log('\n📋 Checking MCP Configuration...');
const mcpConfigPath = path.join(process.cwd(), '.github', 'copilot', 'mcp-config.json');

if (!fs.existsSync(mcpConfigPath)) {
  console.error('❌ MCP configuration not found: .github/copilot/mcp-config.json');
  hasErrors = true;
} else {
  console.log('✅ MCP configuration file exists');
  
  // Check 2: Validate JSON
  try {
    const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
    console.log('✅ MCP configuration is valid JSON');
    
    // Check 3: Verify required sections
    const requiredSections = ['mcpServers', 'firewall', 'security', 'agent'];
    const missingSections = requiredSections.filter(section => !mcpConfig[section]);
    
    if (missingSections.length > 0) {
      console.error(`❌ Missing required sections: ${missingSections.join(', ')}`);
      hasErrors = true;
    } else {
      console.log('✅ All required sections present');
    }
    
    // Check 4: Verify MCP servers
    console.log('\n🖥️  Checking MCP Servers...');
    const expectedServers = [
      'codebase-structure',
      'prisma-schema',
      'api-endpoints',
      'documentation',
      'postgresql-database',
      'github-repository'
    ];
    const configuredServers = Object.keys(mcpConfig.mcpServers || {});
    const missingServers = expectedServers.filter(server => !configuredServers.includes(server));
    
    if (missingServers.length > 0) {
      console.error(`❌ Missing critical MCP servers: ${missingServers.join(', ')}`);
      hasErrors = true;
    } else {
      console.log(`✅ ${configuredServers.length} MCP servers configured`);
      console.log(`   Critical servers present: ${expectedServers.length}/${expectedServers.length}`);
    }
    
    // Check 5: Verify firewall configuration
    console.log('\n🔒 Checking Firewall Configuration...');
    const firewall = mcpConfig.firewall;
    
    if (!firewall || !firewall.enabled) {
      console.warn('⚠️  Firewall is not enabled (security risk)');
      hasWarnings = true;
    } else {
      console.log('✅ Firewall is enabled');
    }
    
    if (firewall && firewall.mode !== 'allowlist') {
      console.warn('⚠️  Firewall mode is not "allowlist" (less secure)');
      hasWarnings = true;
    } else {
      console.log('✅ Firewall mode is "allowlist"');
    }
    
    if (firewall && firewall.allowlist) {
      // Handle both array and object allowlist formats
      let allDomains = [];
      if (Array.isArray(firewall.allowlist)) {
        allDomains = firewall.allowlist;
      } else if (typeof firewall.allowlist === 'object') {
        // Flatten object allowlist (categorized format)
        allDomains = Object.values(firewall.allowlist).flat();
      }
      
      console.log(`✅ Allowlist contains ${allDomains.length} domains`);
      
      // Verify critical domains
      const criticalDomains = [
        'github.com',
        'api.github.com',
        'npmjs.org',
        'registry.npmjs.org',
        'docker.io'
      ];
      
      const missingCritical = criticalDomains.filter(domain => 
        !allDomains.includes(domain)
      );
      
      if (missingCritical.length > 0) {
        console.warn(`⚠️  Missing critical domains: ${missingCritical.join(', ')}`);
        hasWarnings = true;
      }
    } else if (firewall && firewall.domains) {
      // Handle new 'domains' field with categories
      let allDomains = [];
      if (typeof firewall.domains === 'object') {
        allDomains = Object.values(firewall.domains).flat();
      }
      
      console.log(`✅ Firewall domains contains ${allDomains.length} approved domains`);
      
      // Verify critical domains
      const criticalDomains = [
        'github.com',
        'api.github.com',
        'npmjs.org',
        'registry.npmjs.org',
        'docker.io'
      ];
      
      const missingCritical = criticalDomains.filter(domain => 
        !allDomains.includes(domain)
      );
      
      if (missingCritical.length > 0) {
        console.warn(`⚠️  Missing critical domains: ${missingCritical.join(', ')}`);
        hasWarnings = true;
      }
    }
    
    // Check 6: Verify security configuration
    console.log('\n🔐 Checking Security Configuration...');
    const security = mcpConfig.security;
    
    // Handle both old and new security structures
    let secretsConfigured = false;
    let requiredSecrets = [];
    
    if (security && security.secretManagement && security.secretManagement.enabled) {
      secretsConfigured = true;
      requiredSecrets = security.secretManagement.requiredSecrets || [];
    } else if (security && security.secrets && security.secrets.provider) {
      secretsConfigured = true;
      // Flatten required secrets from categorized structure
      if (security.secrets.required && typeof security.secrets.required === 'object') {
        requiredSecrets = Object.values(security.secrets.required).flat();
      }
    }
    
    if (!secretsConfigured) {
      console.warn('⚠️  Secret management not configured');
      hasWarnings = true;
    } else {
      console.log('✅ Secret management configured');
      
      if (requiredSecrets.length > 0) {
        console.log(`✅ ${requiredSecrets.length} required secrets defined:`);
        requiredSecrets.forEach(secret => {
          console.log(`   - ${secret}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Invalid JSON in MCP configuration:', error.message);
    hasErrors = true;
  }
}

// Check 7: Documentation files
console.log('\n📚 Checking Documentation...');
const docFiles = [
  'COPILOT_SETUP_GUIDE.md',
  'FIREWALL_CONFIG.md',
  'COPILOT_INSTRUCTIONS.md',
  'CONFIGURATION.md',
  'REQUIREMENTS.md',
  'MEMORY.md'
];

docFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Missing documentation: ${file}`);
    hasWarnings = true;
  }
});

const existingDocs = docFiles.filter(file => 
  fs.existsSync(path.join(process.cwd(), file))
);
console.log(`✅ ${existingDocs.length}/${docFiles.length} core documentation files present`);

// Check 8: Environment variables (informational)
console.log('\n🔑 Required Secrets (to be configured in GitHub)...');
const requiredSecrets = [
  'DATABASE_URL      - PostgreSQL connection string',
  'API_TOKEN         - API logs access token',
  'GITHUB_TOKEN      - Repository access (auto-provided)',
  'NEXTAUTH_SECRET   - Session encryption (recommended)'
];

console.log('ℹ️  Configure these secrets in:');
console.log('   GitHub → Settings → Secrets and variables → Actions\n');
requiredSecrets.forEach(secret => {
  console.log(`   ${secret}`);
});

// Summary
console.log('\n' + '━'.repeat(60));
console.log('\n📊 Verification Summary:\n');

if (hasErrors) {
  console.error('❌ FAILED: Configuration has critical errors');
  console.error('   Please fix the errors above before activating Copilot Agent\n');
  process.exit(1);
} else if (hasWarnings) {
  console.warn('⚠️  PASSED WITH WARNINGS: Configuration is functional but has warnings');
  console.warn('   Review warnings above for potential improvements\n');
  process.exit(0);
} else {
  console.log('✅ SUCCESS: All checks passed!');
  console.log('\n📖 Next Steps:');
  console.log('   1. Configure secrets in GitHub (see list above)');
  console.log('   2. Go to: Settings → Copilot → Coding Agent');
  console.log('   3. Enable: Model Context Protocol (MCP)');
  console.log('   4. Select: .github/copilot/mcp-config.json');
  console.log('   5. Test: @copilot verify environment setup');
  console.log('\n📚 Documentation: See COPILOT_SETUP_GUIDE.md for detailed instructions\n');
  process.exit(0);
}
