// import { asyncABC } from './lib/async';

(async () => {
  console.log({ res: await Promise.resolve({ status: 'ok' }) });
})();
