// k6-tests/global.load.js
import { check } from 'k6';
import http from 'k6/http';

export const BASE_URL = 'https://dev.travelinsider.co'; // change this to your env URL

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Example reusable function
export function verifyResponse(res) {
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 1s': (r) => r.timings.duration < 1000,
  });
}
