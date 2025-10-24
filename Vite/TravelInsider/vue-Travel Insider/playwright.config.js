// --- Core Imports ---
import fs from 'fs';
import path from 'path';
import process from 'node:process';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import { defineConfig, devices } from '@playwright/test';

// --- Load Environment Variables ---
dotenv.config();

// --- Helper: Get Screen Resolution (Windows only) ---
function getScreenResolution() {
  try {
    const output = execSync(
      'powershell -command "& {Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Size | Out-String}"'
    ).toString();
    const [width, height] = output
      .trim()
      .split(/\D+/)
      .filter(Boolean)
      .map(Number);
    return { width, height };
  } catch (err) {
    console.warn('⚠️  Could not detect screen size, using fallback 1920x1080');
    return { width: 1920, height: 1080 };
  }
}

const { width: screenWidth, height: screenHeight } = getScreenResolution();

// --- Browser Window Settings ---
const browserWidth = 1366;
const browserHeight = 768;
const posX = Math.floor((screenWidth - browserWidth) / 2);
const posY = Math.floor((screenHeight - browserHeight) / 2);

// --- Environment Variables ---
const isFullscreen = process.env.FULLSCREEN === 'true';
const isHeadless = process.env.HEADLESS === 'true';
const baseURL = process.env.BASE_URL || 'https://dev.travelinsider.co';

// --- Display Environment Info ---
console.log('\n🧩 Environment Settings:');
console.log(`   Base URL: ${baseURL}`);
console.log(`   Fullscreen: ${isFullscreen}`);
console.log(`   Headless: ${isHeadless}`);
console.log(`   Screen: ${screenWidth}x${screenHeight}\n`);

// --- Helper Function: Track Page Load ---
export async function trackPageLoad(page, url) {
  const logDir = './logs';
  const logFile = path.join(logDir, 'performance-latest.log');

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const start = Date.now();
  const response = await page.goto(url, { waitUntil: 'load', timeout: 80000 });
  const end = Date.now();

  const loadTime = (end - start).toFixed(2);
  const status = response?.status?.() ?? 'N/A';
  const message = `📊 [${new Date().toISOString()}] ${url} → ${loadTime} ms (status: ${status})`;

  console.log(message);
  fs.appendFileSync(logFile, message + '\n');

  return { loadTime, status };
}

// --- ✅ Main Playwright Configuration ---
export default defineConfig({
  testDir: './e2e/functional-tests',
  globalSetup: './global-setup.js',

  // Timeouts
  timeout: 60 * 1000,
  expect: { timeout: 10000 },

  // Reporters
  reporter: [
    ['list'],
    ['html'],
    ['./customReporter.js'], // ✅ use path instead of imported class
  ],

//  Slow  Motion
use: {
  baseURL,
  headless: isHeadless,
  trace: 'on-first-retry',
  screenshot: 'on',
  video: 'on',
  navigationTimeout: 60000,
  actionTimeout: 60000,
  viewport: { width: 1366, height: 768 },
  launchOptions: {
    slowMo: 1000, // 👈 add this line (500ms delay between actions)
    args: ['--start-maximized'],
  },
},




  // Default test behavior
  use: {
    baseURL,
    headless: isHeadless,
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'on',

    // Timeout settings
    navigationTimeout: 60000,
    actionTimeout: 60000,

    // Browser window behavior
    viewport: { width: browserWidth, height: browserHeight },
    launchOptions: {
      args: isFullscreen
        ? ['--start-maximized']
        : [
            `--window-size=${browserWidth},${browserHeight}`,
            `--window-position=${posX},${posY}`,
          ],
    },
  },

  // Cross-browser projects
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
