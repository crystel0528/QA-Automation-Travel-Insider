import { test, expect } from '@playwright/test';

test('Validate Travel Insider link loads successfully', async ({ page }) => {
  const start = Date.now();

  // ✅ 1. Corrected missing URL
  await page.goto('https://dev.travelinsider.co', { waitUntil: 'domcontentloaded' });

  // ✅ 2. Check that homepage content is visible via data-testid
  const mainContent = page.locator('[data-testid="homepage"]');
  await expect(mainContent).toBeVisible({ timeout: 50000 });

  // ✅ 3. Verify the sign-in button exists
  const signInButton = page.locator('[data-testid="sign-in-button"]');
  await expect(signInButton).toBeVisible({ timeout: 50000 });

  // ✅ 4. Measure total load time
  const loadTime = Date.now() - start;
  console.log('Travel Insider loaded in', loadTime, 'ms');

  // ✅ 5. Assert load time threshold
  expect(loadTime).toBeLessThan(80000);

  // ✅ 6. Check page title
  await expect(page).toHaveTitle(/TRAVEL INSIDER/i);

  // ✅ 7. Capture screenshot (optional)
  await page.screenshot({ path: 'homepage.png', fullPage: true });
});
