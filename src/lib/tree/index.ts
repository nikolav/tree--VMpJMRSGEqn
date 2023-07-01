import {
  ICallback,
  IJSONNode,
  INodeClassesCalculated,
  INodeValueCalculated,
  OrNoValue,
  OrNull,
  TNodeClasses,
  TPrimitive,
} from '../../types';
// #0
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ICache<T = any> {
  [key: number]: ICacheEntry<T>;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ICacheEntry<TNodeValue = any> {
  children: node[];
  parent: OrNull<node>;
  root: OrNull<tree>;
  value: OrNoValue<TNodeValue>;
  id: OrNoValue<TPrimitive>;
  classes: Record<TPrimitive, OrNoValue<boolean>>;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface TNodeInitDefaults<TNodeValue = any> {
  id: OrNull<TPrimitive>;
  root: OrNull<tree>;
  value: OrNull<TNodeValue>;
}
type TNodeIdCache = Record<number, Record<TPrimitive, node>>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TNodeInitConfig<TNodeValue = any> = Partial<TNodeInitDefaults<TNodeValue>>;
interface ITraverseTreeCallback {
  (node: IJSONNode, index: number, coll: node[]): void;
}

// #1
const fn_ = Function.prototype;
const has_ = fn_.call.bind(Object.prototype.hasOwnProperty);
const push_ = fn_.call.bind(Array.prototype.push);
const forEach_ = fn_.call.bind(Array.prototype.forEach);
// #2
let ID = 1;
const idGen = () => ID++;

// #3
const nodeInitDefaults_: TNodeInitDefaults = {
  id: null,
  root: null,
  value: null,
};

const cache_: ICache = {};
const idcache_: TNodeIdCache = {};

// @node
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class node<TNodeValue = any> {
  __: number;
  constructor(config = <TNodeInitConfig<TNodeValue>>{}) {
    const conf = { ...nodeInitDefaults_, ...config };
    const id = idGen();
    this.__ = id;
    cache_[id] = <ICacheEntry<TNodeValue>>{
      children: [],
      parent: null,
      root: conf.root,
      value: conf.value,
      id: null,
      classes: {},
    };
    if (null != conf.id) this.id(conf.id);
  }

  // @after
  after = (ref$: node, node$: node) => {
    if (this.has(ref$)) this.place(ref$.i() + 1, node$);
    return this;
  };

  // @append
  append = (node$: node) => {
    return this.place(-1, node$);
  };

  // @before
  before = (ref$: node, node$: node) => {
    if (this.has(ref$)) this.place(ref$.i(), node$);
    return this;
  };

  // @eq
  eq = (i: number) => {
    const ls = lschildren_(this);
    return (0 <= i ? ls[i] : ls[this.len() + i]) || null;
  };

  // @find
  // get first descendant that passes .callback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  find = (callback: ICallback, onBreak = false, thisContext?: any) => {
    //
    const match = { node: null };
    this.walk(find_, onBreak, { match, callback, thisContext });

    return match.node;
  };

  // @first
  first = () => {
    return this.eq(0);
  };

  // @id
  id = (id_?: OrNoValue<TPrimitive>) => {
    if (null != id_) {
      const oldid_ = getid_(this);
      const idcache__ = getidcache_(this.root());

      // if id is already taken by different node
      if (has_(idcache__, id_) && this !== idcache__[id_]) {
        // remove id from node that holds it
        cc(idcache__[id_]).id = null;
      }

      // remove old entry from idcache__
      // if provided another id for this node
      if (this === idcache__[oldid_]) {
        delete idcache__[oldid_];
      }

      cc(this).id = id_;
      idcache__[id_] = this;

      return this;
    }

    return getid_(this);
  };

  // @classes
  //  .classes
  //  .hasClass
  //  .addClass
  //  .removeClass
  //  .toggleClass
  //  .byClass
  classes = (cls?: OrNoValue<TNodeClasses | INodeClassesCalculated>) => {
    const c = cc(this);
    const { classes } = c;
    //
    if (null == cls) return { ...classes };
    c.classes = {
      ...classes,
      ...('function' === typeof cls
        ? (<INodeClassesCalculated>cls)(classes)
        : cls),
    };
    //
    return this;
  };
  hasClass = (c: string) => {
    return true === this.classes()[c];
  };
  addClass = (c: string) => {
    return this.classes({ [c]: true });
  };
  removeClass = (c: string) => {
    return this.classes({ [c]: false });
  };
  toggleClass = (c: string) => {
    return this.classes((classes$) => ({ [c]: !classes$[c] }));
  };
  byClass = (cls: string, collect: node[] = []) => {
    return this.query(byClass_, collect, { cls });
  };
  // /@classes

  // @contains
  contains = (node$: node) => {
    while ((node$ = node$.parent())) if (this === node$) return true;
    return false;
  };

  // @contained
  contained = (pt$: node) => {
    let node$: node = this;
    while ((node$ = node$.parent())) {
      if (pt$ === node$) return true;
    }
    return false;
  };

  // @depth
  depth = () => {
    let i = 0;
    let node$: node = this;

    if (this.isplaced()) for (; (node$ = node$.parent()); i++);

    return i;
  };

  // @destroy
  destroy = () => {
    'root parent children value id'
      .split(' ')
      .forEach((m) => (cc(this)[m] = null));

    delete cache_[this.__];
    delete this.__;
  };

  // @eachSibling
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eachSibling = (callback: ICallback, onBreak = false, context?: any) => {
    loop_(this.level(false), callback, onBreak, context);
    //
    return this;
  };

  // @has
  has = (node$: node) => {
    const p = node$.parent();
    return p === this ? -1 !== lschildren_(p).indexOf(node$) : false;
  };

  // @head
  head = () => {
    const pt$ = this.parent();
    return pt$ ? pt$.eq(0) : this;
  };

  // @i
  i = () => {
    const ptnode$: node = this.parent();
    return ptnode$ ? lschildren_(ptnode$).indexOf(this) : -1;
  };

  // @isHead
  isHead = () => {
    return this === this.head();
  };

  // @isTail
  isTail = () => {
    return this === this.tail();
  };

  // @isplaced
  isplaced = () => {
    let node$: node = this;
    const d = this.root();

    while ((node$ = node$.parent())) if (d === node$) return true;

    return false;
  };

  // @last
  last = () => {
    return this.eq(-1);
  };

  // @len
  len = () => {
    return lschildren_(this).length;
  };

  // @level
  level = (andSelf = true) => {
    const pt$ = this.parent();
    const lvl = pt$ ? pt$.ls() : [this];
    return andSelf ? lvl : lvl.filter((sibling) => sibling !== this);
  };

  // @ls
  ls = () => {
    return [...lschildren_(this)];
  };

  // @lsa
  lsa = (list: node[] = []) => {
    if (this.len()) lschildren_(this).forEach(collector_, list);
    return list;
  };

  // @next
  next = () => {
    let next_: OrNull<node> = null;

    try {
      next_ = this.parent().eq(1 + this.i());
    } catch (err) {
      // ignore
    }

    return next_;
  };

  // @parent
  parent = () => {
    return cc(this).parent;
  };

  // @path
  path = (andSelf = true) => {
    let node$: node = this;
    const p = andSelf ? [node$] : [];
    while ((node$ = node$.parent())) p.push(node$);
    return p.reverse();
  };

  // @place
  place = (i: number, node$: node) => {
    const ls = lschildren_(this);
    const R = this.root();
    const l = ls.length;

    if (i < 0) i = i + 1 + l;

    if (i <= l) {
      if (node$.isplaced()) node$.parent().rm(node$);

      if (R !== node$.root()) cc(node$).root = R;

      ls.splice(i, 0, node$);
      setParentNode_(node$, this);
    }

    return this;
  };

  // @prepend
  prepend = (node$: node) => {
    return this.place(0, node$);
  };

  // @prev
  prev = () => {
    let prev_: OrNull<node> = null;
    const i = this.i();

    if (0 < i) {
      try {
        prev_ = this.parent().eq(i - 1);
      } catch (err) {
        // ignore
      }
    }

    return prev_;
  };

  // @query
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query = (callback: ICallback, list: node[] = [], context?: any) => {
    this.traverse(query_, { callback, list, context });
    return list;
  };

  // @rm
  rm = (node$: node) => {
    if (this.has(node$)) {
      lschildren_(this).splice(node$.i(), 1);
      setParentNode_(node$, null);
    }
    return this;
  };

  // @root
  root = () => {
    return cc(this).root;
  };

  // @tail
  tail = () => {
    const pt$ = this.parent();
    return pt$ ? pt$.eq(-1) : this;
  };

  // @toString
  toString = () => {
    return `${this.value()}`;
  };

  // @traverse
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  traverse = (callback: ICallback, context?: any) => {
    lschildren_(this).forEach(traverser_, { callback, context });
    return this;
  };

  // #value
  // pass function to calculate based on current
  value = (val?: OrNoValue<TNodeValue | INodeValueCalculated<TNodeValue>>) => {
    //
    if (undefined === val) {
      return cc(this).value;
    }
    cc(this).value =
      'function' !== typeof val
        ? val
        : (<INodeValueCalculated<TNodeValue>>val)(cc(this).value);
    //
    return this;
  };

  // @walk
  // traverse down, exit @onBreak
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  walk = (callback: ICallback, onBreak = false, thisContext?: any) => {
    const node$ = this;
    walk_(node$, { callback, thisContext, onBreak });
    return node$;
  };
}

// @tree
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default class tree<TNodeValue = any> extends node<TNodeValue> {
  static Node = node;
  // @init
  constructor(value = null) {
    super({ value });
    cc(this).root = this;

    // private cache for each tree{} instance
    idcache_[this.__] = {};
  }

  // @byid
  byid = (id: TPrimitive) => {
    return getidcache_(this)[id] || null;
  };

  // @json
  json = (jsonObject: IJSONNode, middleware = null) => {
    const fromRoot: IJSONNode = { children: [jsonObject] };
    const context = {
      root: this,
      node: this,
      prev: [],
      middleware,
    };
    //
    traverseTree_(fromRoot, load_, context);
    //
    return this;
  };

  // @node
  node = (config: TNodeInitConfig<TNodeValue> = { id: null, value: null }) => {
    return new node<TNodeValue>({ ...config, root: this });
  };
}

// @helpers
function cc(node$: node) {
  return cache_[node$.__];
}
function collector_(node$: node) {
  push_(this, node$);
  node$.len() && node$.lsa(this);
}
function traverser_(node$: node, index: number) {
  const { callback, context } = this;
  callback.call(context, node$, index);
  node$.traverse(callback, context);
}
function query_(node$: node, index: number) {
  const { callback, context, list } = this;
  if (true === callback.call(context, node$, index)) push_(list, node$);
}
function lschildren_(node$: node) {
  return cc(node$).children;
}
function setParentNode_(node$: node, pnode$: node) {
  cc(node$).parent = pnode$;
}
function getid_(node$: node) {
  return cc(node$).id;
}
function getidcache_(tree$: tree) {
  return idcache_[tree$.__];
}
function loop_(
  list: node[],
  callback: ICallback,
  onBreak = false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  for (
    let i = 0, len = list.length;
    i < len && onBreak !== callback.call(context, list[i], i, list);
    i++
  );
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function walk_(node$: node, context: any) {
  let nextNode: node;
  const { callback, onBreak, thisContext } = context;
  //
  if (onBreak !== callback.call(thisContext, node$)) {
    nextNode = 0 < node$.len() ? node$.eq(0) : node$.next();
    if (nextNode) walk_(nextNode, context);
  }
}
function find_(node$: node) {
  const { match, callback, thisContext } = this;
  if (true === callback.call(thisContext, node$)) {
    match.node = node$;
    return false;
  }
  return true;
}
// //
function traverseTree_(
  node: IJSONNode,
  callback: ITraverseTreeCallback,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: any
) {
  if (!isEmpty_(node))
    forEach_(node.children, traverserTree_, { callback, context });
  //
  return node;
}
function traverserTree_(node: IJSONNode, index: number, coll: node[]) {
  this.callback.call(this.context, node, index, coll);
  traverseTree_(node, this.callback, this.context);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isEmpty_(node: any) {
  return !node?.children?.length;
}
// eslint-disable-next-line functional/functional-parameters
function omit_(object: IJSONNode, ...fields: TPrimitive[]) {
  return Object.keys(object).reduce((accum, key) => {
    if (!fields.includes(key)) accum[key] = object[key];
    //
    return accum;
  }, {});
}
function load_(json: IJSONNode, index: number, list: node[]) {
  const { node, root, prev, middleware } = this;
  const ll = list.length;
  const isTail_ = index === ll - 1;
  //
  const newNode = root.node({ value: omit_(json, 'children') });
  node.append(newNode);
  //
  middleware && middleware.call(node, newNode, json);
  //
  if (!isEmpty_(json)) {
    if (1 < ll && !isTail_) prev.push(node);
    this.node = newNode;
    return;
  }
  //
  if (isTail_) {
    this.node = prev.pop();
  }
}
function byClass_(node$: node) {
  return node$.hasClass(this.cls);
}
