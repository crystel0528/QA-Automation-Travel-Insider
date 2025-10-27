// global-setup.js
import { chromium, firefox, webkit } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';

// ✅ Load environment variables
dotenv.config();

export default async function globalSetup() {
  const baseURL = process.env.BASE_URL || 'https://dev.travelinsider.co';
  const browsers = [
    { name: 'Chromium', launcher: chromium },
    { name: 'Firefox', launcher: firefox },
    { name: 'WebKit', launcher: webkit },
  ];

  // ✅ Ensure screenshot directory exists
  const screenshotDir = './screenshots';
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir);
  }

  console.log('\n🧪 Test Run:', new Date().toLocaleString());
  console.log('🌍 Base URL:', baseURL);
  console.log('=======================================\n');

  // ✅ Loop through browsers and test load performance
  for (const { name, launcher } of browsers) {
    const browser = await launcher.launch({ headless: false });
    const page = await browser.newPage();

    const start = Date.now();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    try {
      console.log(`🚀 Launching ${name} browser...`);
      await page.goto(baseURL, { waitUntil: 'domcontentloaded', timeout: 100000 });

      // Wait for homepage to be visible
      await page.waitForSelector('[data-testid="homepage"]', { timeout: 60000 });
      const elapsed = (Date.now() - start) / 1000;
      console.log(`✅ ${name} → Homepage loaded successfully in ${elapsed.toFixed(2)}s`);

      // Screenshot success
      const successPath = `${screenshotDir}/${name}-success-${timestamp}.png`;
      await page.screenshot({ path: successPath, fullPage: true });
      console.log(`📸 Screenshot saved at: ${successPath}`);
    } catch (error) {
      const failPath = `${screenshotDir}/${name}-failed-${timestamp}.png`;

      if (page) {
        try {
          await page.screenshot({ path: failPath, fullPage: true });
          console.log(`📸 Screenshot saved at: ${failPath}`);
        } catch (screenshotError) {
          console.warn('⚠️ Could not capture failure screenshot:', screenshotError.message);
        }
      } else {
        console.warn('⚠️ No page context available for screenshot.');
      }

      const total = (Date.now() - start) / 1000;
      console.log(`🚨 ${name} → FAILED after ${total.toFixed(2)}s`);
      console.log(`   Reason: ${error.message}\n`);
    } finally {
      await browser.close();
    }
  }
}
