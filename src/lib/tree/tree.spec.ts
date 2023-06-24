import test from 'ava';

import tree from '.';

test('tree', (t) => {
  const a = new tree();
  const n1 = a.node();
  t.is(a instanceof tree && n1 instanceof tree.Node, true);
});
