import { test, expect } from '@playwright/test';

// See here how to get started:
// https://playwright.dev/docs/intro
test('visits the app root url', async ({ page }) => {
  //await page.goto('https://dev.travelinsider.co');
  await page.goto('https://dev.travelinsider.co', { timeout: 3000 });

  //await page.pause(); // 🟡 This pauses and opens the browser

  // Example assertion
  await expect(page).toHaveTitle(/TRAVEL INSIDER/);
});
