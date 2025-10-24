import { test, expect } from '@playwright/test';
//import { trackPageLoad } from '../playwright.config.js';

test('TC-001: Verify main page loads successfully', async ({ page }) => {
  // Step 1: Navigate to homepage
  await page.goto('https://dev.travelinsider.co', { waitUntil: 'domcontentloaded' });

  // Step 2: Verify main content is visible
  const mainContent = page.locator('[data-testid="homepage"]');
  await expect(mainContent).toBeVisible({ timeout: 50000 });

  // Step 3: Verify sign-in button is visible
  const signInButton = page.locator('[data-testid="sign-in-button"]');
  await expect(signInButton).toBeVisible({ timeout: 50000 });

  // Step 4: Check page load time
  const loadTime = Date.now() - start;
  console.log('Travel Your Way', loadTime, 'ms');
  expect(loadTime).toBeLessThan(80000);

  // Step 5: Check page title
  await expect(page).toHaveTitle(/TRAVEL INSIDER/i);

  // Step 6: Capture screenshot
  await page.screenshot({ path: 'homepage.png', fullPage: true });

 test('TC-001: Verify main page loads successfully', async ({ page }) => {
  // Step 1: Navigate to homepage
  await page.goto('https://dev.travelinsider.co', { waitUntil: 'domcontentloaded' });

  // Step 2: Verify main content is visible
  const mainContent = page.locator('[data-testid="homepage"]');
  await expect(mainContent).toBeVisible({ timeout: 50000 });

  // Step 3: Verify sign-in button is visible
  const signInButton = page.locator('[data-testid="sign-in-button"]');
  await expect(signInButton).toBeVisible({ timeout: 50000 });

});