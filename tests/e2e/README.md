# E2E Tests

This directory contains end-to-end tests for the Smart Carbon-Free Village platform using Playwright.

## Setup

```bash
# Install Playwright browsers
npx playwright install

# Or install specific browsers
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

## Running Tests

```bash
# Run all tests
npx playwright test

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
npx playwright test --project="Mobile Chrome"

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests in UI mode (interactive)
npx playwright test --ui

# Run tests in debug mode
npx playwright test --debug

# Run specific test file
npx playwright test tests/e2e/homepage.spec.ts

# Run tests matching pattern
npx playwright test homepage
```

## Viewing Reports

```bash
# Show HTML report
npx playwright show-report

# Generate and open report
npx playwright test && npx playwright show-report
```

## Screenshots

Screenshots are automatically captured on test failures and saved to:
- `tests/screenshots/` - Manually captured screenshots
- `test-results/` - Automatic failure screenshots

## Writing Tests

See existing test files in `tests/e2e/` for examples.

### Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Welcome');
  });
});
```

### Taking Screenshots

```typescript
// Full page
await page.screenshot({ 
  path: 'tests/screenshots/filename.png',
  fullPage: true 
});

// Viewport only
await page.screenshot({ 
  path: 'tests/screenshots/filename.png'
});

// Specific element
await page.locator('.hero').screenshot({ 
  path: 'tests/screenshots/hero.png'
});
```

## CI/CD Integration

Tests run automatically in GitHub Actions on:
- Push to main/develop branches
- Pull requests

See `.github/workflows/playwright.yml` for configuration.

## Troubleshooting

### Tests timing out
- Increase timeout in playwright.config.ts
- Check if dev server is running
- Verify database is accessible

### Browser not found
```bash
npx playwright install
```

### Tests failing locally but passing in CI
- Check Node.js version matches CI
- Verify environment variables
- Check database state

## Documentation

For more details, see:
- [homereq.md](../../homereq.md) - Comprehensive testing guide
- [Playwright Docs](https://playwright.dev/)
