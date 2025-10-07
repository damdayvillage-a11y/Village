const { chromium } = require('playwright');

async function takeScreenshots() {
  const url = process.env.APP_URL || process.argv[2] || 'http://localhost:3000';
  
  console.log('📸 Starting screenshot capture for:', url);
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Set viewport size
    await page.setViewportSize({ width: 1280, height: 720 });
    
    console.log('🌐 Testing main application page...');
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for content to load
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // Take full page screenshot of main app
    await page.screenshot({ 
      path: 'deployment-main-page.png', 
      fullPage: true,
      animations: 'disabled'
    });
    console.log('✅ Main page screenshot saved: deployment-main-page.png');
    
    // Take viewport screenshot
    await page.screenshot({ 
      path: 'deployment-main-viewport.png',
      animations: 'disabled'
    });
    console.log('✅ Main viewport screenshot saved: deployment-main-viewport.png');
    
    console.log('🏥 Testing health endpoint...');
    await page.goto(`${url}/health`, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Take screenshot of health endpoint
    await page.screenshot({ 
      path: 'deployment-health-page.png', 
      fullPage: true,
      animations: 'disabled'
    });
    console.log('✅ Health endpoint screenshot saved: deployment-health-page.png');
    
    // Test page title and basic content
    const title = await page.title();
    console.log('📄 Page title:', title);
    
    // Go back to main page for content testing
    await page.goto(url, { waitUntil: 'networkidle' });
    
    // Check for expected content
    const hasVillageText = await page.getByText('Village Application').isVisible().catch(() => false);
    const hasSuccessText = await page.getByText('running successfully').isVisible().catch(() => false);
    
    console.log('✅ Content validation:');
    console.log('   - Village Application text:', hasVillageText ? 'Found' : 'Not found');
    console.log('   - Success message:', hasSuccessText ? 'Found' : 'Not found');
    
    // Generate a summary screenshot with timestamp
    await page.evaluate(() => {
      // Add a timestamp overlay
      const timestamp = document.createElement('div');
      timestamp.textContent = `Screenshot taken: ${new Date().toISOString()}`;
      timestamp.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-family: monospace;
        font-size: 12px;
        z-index: 10000;
      `;
      document.body.appendChild(timestamp);
    });
    
    await page.screenshot({ 
      path: 'deployment-summary.png', 
      fullPage: true,
      animations: 'disabled'
    });
    console.log('✅ Summary screenshot saved: deployment-summary.png');
    
    console.log('🎉 All screenshots completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during screenshot capture:', error.message);
    
    // Take an error screenshot if possible
    try {
      await page.screenshot({ 
        path: 'deployment-error.png', 
        fullPage: true 
      });
      console.log('📸 Error screenshot saved: deployment-error.png');
    } catch (screenshotError) {
      console.error('Could not take error screenshot:', screenshotError.message);
    }
    
    throw error;
  } finally {
    await browser.close();
  }
}

// Run if called directly
if (require.main === module) {
  takeScreenshots()
    .then(() => {
      console.log('✨ Screenshot process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Screenshot process failed:', error);
      process.exit(1);
    });
}

module.exports = { takeScreenshots };