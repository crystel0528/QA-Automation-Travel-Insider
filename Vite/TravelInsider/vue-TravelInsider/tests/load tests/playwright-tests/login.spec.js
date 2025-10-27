import { test, expect } from '@playwright/test';

test('Login page loads successfully', async ({ page }) => {
  await page.goto('https://dev.travelinsider.co');
  await expect(page).toHaveTitle(/Travel Insider/i);
});
