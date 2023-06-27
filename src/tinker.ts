import { tree } from './lib';

(async () => {
  const t1 = new tree();
  const n1 = t1.node();
  const n2 = t1.node();
  const n21 = t1.node();
  const n211 = t1.node();
  n21.append(n211);
  n2.append(n21);
  t1.append(n1);
  t1.append(n2);
  console.log({ res: t1.len() });
  // const t1n1 = t1.node();
  // const t1n2 = t1.node();
  // const t1n1c1 = t1.node();
  // const t1n1c2 = t1.node();
  // t1n1.value('9A8Dpgb5cWb');
  // t1n1.addClass('.c1');
  // t1n2.value('jKLOu5UMS40');
  // t1n2.id('#t1n2');
  // t1n1c1.value('YSE2Zcg19o2');
  // t1n1c1.addClass('.c1');
  // t1n1c2.value('L76qlUNsqeo');
  // t1.append(t1n1);
  // t1.append(t1n2);
  // t1n1.append(t1n1c1);
  // t1n1.append(t1n1c2);
  // t1.json({
  //   root: '#0',
  //   children: [{ a: 1 }, { a: 2, children: [{ a: 21 }, { a: 22 }] }],
  // });
  // console.log({
  //   't1:ls': t1
  //     .first()
  //     .last()
  //     .ls()
  //     .map((node$) => node$.value()),
  // });
  // t1.value((v: string) => `${v}@${Date.now()}`);
  // // const t1n1 = t1.node({ value: 't1n1 --1' });
  // console.log({
  //   't1:val': t1.value(),
  //   't1:id': t1.id(),
  //   't1:classes': t1.classes(),
  // });
  // t1.id('#1.2');
  // t1.addClass('.c1');
  // console.log({
  //   't1:val': t1.value(),
  //   't1:id': t1.id(),
  //   't1:classes': t1.classes(),
  // });
  // t1.removeClass('.c1');
  // console.log({
  //   't1:val': t1.value(),
  //   't1:id': t1.id(),
  //   't1:classes': t1.classes(),
  // });
})();
