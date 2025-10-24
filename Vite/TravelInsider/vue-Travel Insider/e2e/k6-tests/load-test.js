import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 5,          // 5 virtual users
  duration: '50s', // run for 10 seconds
};

export default function () {
  const res = http.get('https://dev.travelinsider.co');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
