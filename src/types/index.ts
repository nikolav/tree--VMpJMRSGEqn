export type TPrimitive = string | number | symbol;
export type OrNull<T> = T | null;
export type OrNoValue<T> = OrNull<T | undefined>;
export type TNodeClasses = Record<string, OrNoValue<boolean>>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface INodeValueCalculated<TNodeValue = any> {
  (val: TNodeValue): TNodeValue;
}
export interface INodeClassesCalculated {
  (c: TNodeClasses): TNodeClasses;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ICallback<TArgs = any, TRes = any> {
  (...args: TArgs[]): TRes;
}
// eslint-disable-next-line functional/no-mixed-type
export interface IJSONNode {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: TPrimitive]: any;
  children?: IJSONNode[];
}
