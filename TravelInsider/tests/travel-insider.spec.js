const { test, expect } = require('@playwright/test');

test('homepage loads and has correct title', async ({ page }) => {
  await page.goto('https://dev.travelinsider.co/');
  await expect(page).toHaveTitle(/Travel Insider/i);
});
