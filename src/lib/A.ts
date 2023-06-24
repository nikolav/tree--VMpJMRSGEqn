export default class A {
  x: number;
  y: string;
  constructor(num = 0) {
    this.x = num;
    this.y = `${Date.now()}`;
  }
}
