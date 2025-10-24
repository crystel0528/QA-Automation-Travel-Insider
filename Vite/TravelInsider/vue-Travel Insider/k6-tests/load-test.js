import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 50,          // number of virtual users
  duration: '30s',  // duration of the test
};

export default function () {
  const res = http.get('https://dev.travelinsider.co'); // replace with your actual URL if different
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}
