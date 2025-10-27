import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 10,          // 10 virtual users
  duration: '30s',  // run the test for 30 seconds
};

const BASE_URL = 'https://dev.travelinsider.co'; // ✅ Your actual Travel Insider dev link

export default function () {
  // Step 1: Visit homepage
  let res = http.get(`${BASE_URL}/`);
  check(res, {
    'Homepage is accessible': (r) => r.status === 200,
  });

  sleep(1);

  /*

  // Step 2: Try accessing the login API or page
  // 👉 Adjust the endpoint if your app uses a specific route like /api/login or /login
  const loginUrl = `${BASE_URL}/api/auth/login`;

  const payload = JSON.stringify({
    email: 'testuser@example.com', // change to a test account
    password: 'password123',       // change to your test password
  });

  const headers = { 'Content-Type': 'application/json' };
  res = http.post(loginUrl, payload, { headers });

  check(res, {
    'Login request succeeded': (r) => r.status === 200 || r.status === 201,
    'Response time < 1s': (r) => r.timings.duration < 1000,
  });

  sleep(1);

  */
}
