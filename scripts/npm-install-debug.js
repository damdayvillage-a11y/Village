#!/usr/bin/env node

/**
 * NPM Install Debug Helper for CapRover
 * Monitors npm install process and provides detailed logging
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function log(message) {
  const timestamp = new Date().toISOString().substring(11, 19);
  console.log(`[${timestamp}] ${message}`);
}

function checkSystemResources() {
  log('🖥️ System Information:');
  console.log(`   Node.js: ${process.version}`);
  console.log(`   Platform: ${process.platform} ${process.arch}`);
  console.log(`   Memory: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB used`);
  console.log(`   CWD: ${process.cwd()}`);
}

function checkPackageFiles() {
  log('📦 Package Files Check:');
  
  if (fs.existsSync('package.json')) {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const depCount = Object.keys(pkg.dependencies || {}).length;
    const devDepCount = Object.keys(pkg.devDependencies || {}).length;
    console.log(`   ✅ package.json: ${depCount} deps, ${devDepCount} devDeps`);
  } else {
    console.log('   ❌ package.json not found!');
    process.exit(1);
  }
  
  if (fs.existsSync('package-lock.json')) {
    const lockSize = fs.statSync('package-lock.json').size;
    console.log(`   ✅ package-lock.json: ${Math.round(lockSize / 1024)}KB`);
  } else {
    console.log('   ⚠️ package-lock.json not found - will be generated');
  }
}

function runNpmInstall() {
  return new Promise((resolve, reject) => {
    log('🚀 Starting npm ci with enhanced monitoring...');
    
    const startTime = Date.now();
    let lastOutput = Date.now();
    let lineCount = 0;
    
    // Enhanced npm command with debugging flags
    const npmArgs = [
      'ci',
      '--include=dev',
      '--no-audit',
      '--no-fund',
      '--loglevel=info',
      '--timing'
    ];
    
    log(`Running: npm ${npmArgs.join(' ')}`);
    
    const npmProcess = spawn('npm', npmArgs, {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        NODE_OPTIONS: '--max-old-space-size=4096',
        NPM_CONFIG_PROGRESS: 'true',
        NPM_CONFIG_LOGLEVEL: 'info'
      }
    });
    
    // Monitor stdout
    npmProcess.stdout.on('data', (data) => {
      const lines = data.toString().split('\n').filter(line => line.trim());
      lines.forEach(line => {
        lineCount++;
        lastOutput = Date.now();
        const timestamp = new Date().toISOString().substring(11, 19);
        console.log(`[${timestamp}] NPM: ${line}`);
        
        // Detect specific npm phases
        if (line.includes('added')) {
          log(`📦 PROGRESS: ${line}`);
        } else if (line.includes('deprecated')) {
          log(`⚠️ DEPRECATED: ${line}`);
        } else if (line.includes('WARN')) {
          log(`⚠️ WARNING: ${line}`);
        } else if (line.includes('ERR!')) {
          log(`❌ ERROR: ${line}`);
        }
      });
    });
    
    // Monitor stderr
    npmProcess.stderr.on('data', (data) => {
      const lines = data.toString().split('\n').filter(line => line.trim());
      lines.forEach(line => {
        lastOutput = Date.now();
        const timestamp = new Date().toISOString().substring(11, 19);
        console.log(`[${timestamp}] NPM-ERR: ${line}`);
      });
    });
    
    // Heartbeat monitor to detect hangs
    const heartbeatInterval = setInterval(() => {
      const elapsed = Date.now() - lastOutput;
      const totalElapsed = Math.round((Date.now() - startTime) / 1000);
      
      if (elapsed > 30000) { // 30 seconds without output
        log(`⏰ HEARTBEAT: No output for ${Math.round(elapsed/1000)}s (total: ${totalElapsed}s, lines: ${lineCount})`);
        
        if (elapsed > 300000) { // 5 minutes without output - likely hung
          log('❌ HANG DETECTED: No output for 5 minutes, terminating process');
          npmProcess.kill('SIGTERM');
          clearInterval(heartbeatInterval);
          reject(new Error('npm install appears to have hung'));
          return;
        }
      }
    }, 15000); // Check every 15 seconds
    
    npmProcess.on('close', (code) => {
      clearInterval(heartbeatInterval);
      const duration = Math.round((Date.now() - startTime) / 1000);
      
      if (code === 0) {
        log(`✅ npm ci completed successfully in ${duration}s (${lineCount} lines)`);
        resolve();
      } else {
        log(`❌ npm ci failed with exit code ${code} after ${duration}s`);
        reject(new Error(`npm ci failed with exit code ${code}`));
      }
    });
    
    npmProcess.on('error', (error) => {
      clearInterval(heartbeatInterval);
      log(`❌ npm process error: ${error.message}`);
      reject(error);
    });
  });
}

async function main() {
  try {
    log('🎯 NPM Install Debug Helper for CapRover');
    log('=' .repeat(50));
    
    checkSystemResources();
    checkPackageFiles();
    
    await runNpmInstall();
    
    log('🎉 Installation completed successfully!');
    
    // Verify installation
    if (fs.existsSync('node_modules')) {
      const nodeModulesSize = fs.readdirSync('node_modules').length;
      log(`📊 Installation verification: ${nodeModulesSize} top-level packages`);
    } else {
      log('❌ node_modules directory not found after installation!');
      process.exit(1);
    }
    
  } catch (error) {
    log(`❌ Installation failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  log('🛑 Process interrupted by user');
  process.exit(130);
});

process.on('SIGTERM', () => {
  log('🛑 Process terminated');
  process.exit(143);
});

if (require.main === module) {
  main();
}