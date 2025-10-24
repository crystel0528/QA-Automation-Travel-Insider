import { test, expect } from '@playwright/test';
import { username, password } from '@myhelper/credentials';

test('example', async ({ page }) => {
  await page.getByLabel('User Name').fill(karl.salinas@onedigital.dev);
  await page.getByLabel('Password').fill(P@ssword123);
});