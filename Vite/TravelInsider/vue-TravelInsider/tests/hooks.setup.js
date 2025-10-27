import { test as base } from '@playwright/test'
import { logAfterEachTest } from '../playwright.config.js'

// Extend the default test to include automatic logging
export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    await use(page)
    await logAfterEachTest({ page }, testInfo)
  },
})
export const expect = base.expect
