// import { asyncABC } from './lib/async';
import { A } from './lib';

(async () => {
  const a = new A();
  console.log({ a, res: await Promise.resolve({ status: 'ok' }) });
})();
