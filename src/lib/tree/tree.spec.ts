import test from 'ava';

import tree from '.';

test('tree', (t) => {
  const a = new tree();
  t.is(a instanceof tree, true);
});
