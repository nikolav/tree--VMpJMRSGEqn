// import { asyncABC } from './lib/async';
import { tree } from './lib';

(async () => {
  const t1 = new tree<string>();
  t1.value('@t1');
  t1.value((v: string) => `${v}@${Date.now()}`);
  // const t1n1 = t1.node({ value: 't1n1 --1' });
  console.log({ 't1:val': t1.value() });
})();
