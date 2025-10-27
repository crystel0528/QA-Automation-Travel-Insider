import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 8,
  duration: '45s',
};

export default function () {
  // Example: hitting a booking or travel search page
  const res = http.get('https://dev.travelinsider.co/travel');

  check(res, {
    'travel page status is 200': (r) => r.status === 200,
    'travel page loaded < 3s': (r) => r.timings.duration < 3000,
  });

  sleep(1);
}
