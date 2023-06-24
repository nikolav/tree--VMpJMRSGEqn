import test from 'ava';

import A from './A';

test('A inits', (t) => {
  t.is(new A().x, 0);
});
