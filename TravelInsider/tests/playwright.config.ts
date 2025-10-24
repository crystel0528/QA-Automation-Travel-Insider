import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',       // folder where your test files are
  timeout: 30000,           // max time for each test (ms)
  retries: 0,               // retries on failure
  use: {
    headless: false,        // open browser in visible mode
    viewport: { width: 1280, height: 720 },
    video: 'on',            // record video of tests
    screenshot: 'only-on-failure',
    actionTimeout: 10000,   // max time for individual actions
  },
});
