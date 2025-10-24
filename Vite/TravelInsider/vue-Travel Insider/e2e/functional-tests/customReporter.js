import { Reporter } from '@playwright/test/reporter';

export default class CustomReporter {
  onTestEnd(test, result) {
    console.log(`
==========================
📄 Test: ${test.title}
⏱ Duration: ${result.duration}ms
📊 Status: ${result.status}
==========================
`);
  }
}
