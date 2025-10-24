import { test, expect } from '@playwright/test';

/**
 * Adds a visible mouse cursor overlay during test video recording.
 * This helps visualize where Playwright clicks and moves the mouse.
 */
async function enableMouseOverlay(page) {
  await page.addStyleTag({
    content: `
      .playwright-mouse {
        position: fixed;
        top: 0;
        left: 0;
        width: 20px;
        height: 20px;
        background: rgba(0, 150, 255, 0.7);
        border-radius: 50%;
        pointer-events: none;
        z-index: 999999;
        transition: transform 0.1s ease;
      }
      .playwright-click {
        animation: clickAnim 0.3s ease-out;
      }
      @keyframes clickAnim {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
      }
    `
  });

  await page.evaluate(() => {
    const cursor = document.createElement('div');
    cursor.classList.add('playwright-mouse');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', e => {
      cursor.style.transform = `translate(${e.pageX - 10}px, ${e.pageY - 10}px)`;
    });

    document.addEventListener('mousedown', () => {
      cursor.classList.add('playwright-click');
    });

    document.addEventListener('mouseup', () => {
      cursor.classList.remove('playwright-click');
    });
  });
}

/**
 * Opens the authentication modal on the homepage.
 */
async function openAuthModal(page) {
  await page.goto('https://dev.travelinsider.co', { waitUntil: 'domcontentloaded' });
  await enableMouseOverlay(page);

  const signInButton = page.locator('[data-testid="sign-in-button"]');
  await signInButton.waitFor({ state: 'visible', timeout: 90000 });
  await signInButton.click();
}

/**
 * Test Suite: Authentication Modal
 */
test.describe('Authentication Modal Tests', () => {

  test('TC001: Verify user can open and close the auth modal', async ({ page }) => {
    // Step 1: Open auth modal
    await openAuthModal(page);

    // Step 2: Wait for and click the close button
    const closeButton = page.locator('[data-testid="close-auth-modal"]');
    await closeButton.waitFor({ state: 'visible', timeout: 90000 });
    await closeButton.click();

    // ✅ Expected Result: Modal should close and homepage should be visible
    await expect(page.locator('[data-testid="homepage"]')).toBeVisible();
  });

  test('TC002: Verify user can mask or unmask the password field', async ({ page }) => {
    //await page.locator('[data-testid="sign-in-button"]').click();
    await openAuthModal(page);
    await page.locator('[data-testid="email-navigate-login-button"]').click();
    // Step 1: Enter password
    await page.locator('[data-testid="email-password-input"]').fill('MySecret123');
    // Step 2: Click toggle password visibility
    const toggleButton = page.locator('[data-testid="email-show-password-button"]');
    await toggleButton.click();
    await expect(page.locator('[data-testid="email-password-input"]')).toHaveAttribute('type', 'text');
    await toggleButton.click();
    await expect(page.locator('[data-testid="email-password-input"]')).toHaveAttribute('type', 'password');
  });

  test('TC003: Verify user can display the forgot password', async ({ page }) => {
    await openAuthModal(page);
    await page.locator('[data-testid="email-navigate-login-button"]').click();
    await page.locator('[data-testid="email-navigate-forgot-button"]').click();
    await expect(page.locator('[data-testid="forgot-send-reset-code"]')).toBeVisible();
  });

    test('TC004: Verify user can continue as guest', async ({ page }) => {
    await openAuthModal(page);
    await page.getByText('Continue as Guest').click();
    await expect(page).toHaveURL('https://dev.travelinsider.co');
  });

 test('TC008: Verify user can display the sign up modal for unregistered account', async ({ page }) => {
    await openAuthModal(page);
    //await page.locator('[data-testid="link-signup"]').click();
    await page.getByText('Sign Up').click();
    await expect(page.locator('[data-testid="continue-with-google-button"]')).toBeVisible();
  });

 test('TC009: Login with Email OTP (bypass)', async ({ page }) => {
  // Step 1: Open site
  await page.goto('https://dev.travelinsider.co');

  // Step 2: Open authentication modal if needed
  await openAuthModal(page);

  // Step 3: Wait for email input and fill it
  const emailInput = page.locator('[data-testid="email-input"]');
  await expect(emailInput).toBeVisible();
  await emailInput.fill('karl.salinas@onedigital.dev');

  // Step 4: Click "Submit verification" button
  const submitButton = page.locator('[data-testid="email-submit-verification-button"]');
  await expect(submitButton).toBeVisible();
  await submitButton.click();

  // Step 5: If OTP is bypassed, skip entering OTP and wait for homepage
  await page.waitForSelector('[data-testid="homepage"]', { timeout: 10000 });
  await expect(page.locator('[data-testid="homepage"]')).toBeVisible();

  console.log('Email OTP login successful (bypassed)');
});

test('TC011: Login with Mobile OTP (bypass)', async ({ page }) => {
  // Step 1: Open site
  await page.goto('https://dev.travelinsider.co');

  // Step 2: Open authentication modal if needed
  await openAuthModal(page);

  // Step 3: Wait for mobile input and fill it
  await page.waitForSelector('[data-testid="mobile-input"]', { state: 'visible', timeout: 10000 });
  const mobileInput = page.locator('[data-testid="mobile-input"]');
  await expect(mobileInput).toBeVisible();
  await mobileInput.fill('90000000'); // <- replace with your test phone number

  // Step 4: Click "Send verification" button
  const sendButton = page.locator('[data-testid="mobile-send-verification-button"]');
  await expect(sendButton).toBeVisible();
  await Promise.all([
    // if clicking triggers a client-side request that navigates/changes UI quickly, wait for the expected change
    page.waitForSelector('[data-testid="otp-input"]', { timeout: 10000 }).catch(() => null),
    sendButton.click(),
  ]);

  // Optional: if your staging uses a fixed OTP (e.g., "123456"), fill and submit it
  // const otpInput = page.locator('[data-testid="otp-input"]');
  // await expect(otpInput).toBeVisible();
  // await otpInput.fill('123456');
  // const verifyButton = page.locator('[data-testid="mobile-verify-otp-button"]');
  // await expect(verifyButton).toBeVisible();
  // await verifyButton.click();

  // Step 5: Wait for homepage / logged-in state
  await page.waitForSelector('[data-testid="homepage"]', { timeout: 10000 });
  await expect(page.locator('[data-testid="homepage"]')).toBeVisible();

  console.log('Mobile OTP login successful (bypassed)');
});







 










});
