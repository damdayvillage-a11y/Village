import { test, expect } from '@playwright/test';

/**
 * Homepage Tests
 * Tests for Smart Carbon-Free Village homepage
 */
test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Smart Carbon-Free Village/);
  });
  
  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toContainText('Welcome to');
    
    const heroSubtitle = page.locator('p').first();
    await expect(heroSubtitle).toContainText('Damday Village');
  });
  
  test('should display statistics section', async ({ page }) => {
    await page.goto('/');
    
    // Wait for stats to load
    await page.waitForTimeout(2000);
    
    // Check if stats are visible
    const statsSection = page.locator('text=Live Village Statistics');
    await expect(statsSection).toBeVisible({ timeout: 10000 });
  });
  
  test('should have CTA buttons', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('text=Explore Digital Twin')).toBeVisible();
    await expect(page.locator('text=360° Village Tour')).toBeVisible();
    await expect(page.locator('text=Browse Homestays')).toBeVisible();
  });
  
  test('should be mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if content adapts to mobile
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toBeVisible();
  });
  
  test('should take screenshots', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForTimeout(3000);
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'tests/screenshots/homepage-full.png',
      fullPage: true
    });
    
    // Take viewport screenshot
    await page.screenshot({ 
      path: 'tests/screenshots/homepage-viewport.png'
    });
  });
  
  test('should display featured homestays', async ({ page }) => {
    await page.goto('/');
    
    // Wait for featured section
    await page.waitForSelector('text=Featured Homestays', { timeout: 10000 });
    
    const featuredSection = page.locator('text=Featured Homestays');
    await expect(featuredSection).toBeVisible();
  });
  
  test('should display featured products', async ({ page }) => {
    await page.goto('/');
    
    // Wait for marketplace section
    await page.waitForSelector('text=Local Marketplace', { timeout: 10000 });
    
    const marketplaceSection = page.locator('text=Local Marketplace');
    await expect(marketplaceSection).toBeVisible();
  });
  
  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper SEO
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });
});

test.describe('Homepage Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds (generous for CI)
    expect(loadTime).toBeLessThan(5000);
  });
});

test.describe('Homepage Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Should have h1
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    // Should have proper structure
    const h1Count = await h1.count();
    expect(h1Count).toBeGreaterThan(0);
  });
  
  test('should have alt text for images', async ({ page }) => {
    await page.goto('/');
    
    // Wait for images to load
    await page.waitForTimeout(2000);
    
    const images = page.locator('img');
    const count = await images.count();
    
    if (count > 0) {
      // Check first few images for alt text
      for (let i = 0; i < Math.min(count, 3); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        // Alt can be empty string for decorative images
        expect(alt).not.toBeNull();
      }
    }
  });
});
