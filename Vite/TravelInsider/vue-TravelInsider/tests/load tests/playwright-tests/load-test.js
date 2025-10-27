import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 5,          // number of virtual users
  duration: '30s', // how long to run the test
};

export default function () {
  const res = http.get('https://dev.travelinsider.co');
  
  check(res, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage loaded quickly': (r) => r.timings.duration < 2000, // < 2s
  });

  sleep(1);
}
