type TPrimitive = string | number | symbol;
type OrNull<T> = T | null;
type OrNoValue<T> = OrNull<T | undefined>;
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface INodeValueCalculated<TNodeValue = any> {
  (val: TNodeValue): TNodeValue;
}

// #!
const fn_ = Function.prototype;
const has_ = fn_.call.bind(Object.prototype.hasOwnProperty);
let ID = 1;
const idGen = () => ID++;

// #
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

  // #id
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

  // #root
  root = () => {
    return cc(this).root;
  };

  // #value
  // pass function to calculate based on current
  value = (val?: OrNoValue<TNodeValue | INodeValueCalculated<TNodeValue>>) => {
    //
    if (undefined === val) {
      return cc(this).value;
    }
    cc(this).value =
      'function' != typeof val
        ? val
        : (<INodeValueCalculated<TNodeValue>>val)(cc(this).value);
    //
    return this;
  };
}

// @tree
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class tree<TNodeValue = any> extends node<TNodeValue> {
  constructor(value = null) {
    super({ value });
    cc(this).root = this;

    /** private cache for each tree{} instance */
    idcache_[this.__] = {};
  }

  // #node
  node = (config: TNodeInitConfig<TNodeValue> = { id: null, value: null }) => {
    return new node<TNodeValue>({ ...config, root: this });
  };
}

export default tree;

// @helpers
function cc(node$: node) {
  return cache_[node$.__];
}
// function collector_(node) {
//   push_(this, node);
//   node.len() && node.lsa(this);
// }
// function traverser_(node, index) {
//   this.callback.call(this.context, node, index);
//   node.traverse(this.callback, this.context);
// }
// function query_(node, index) {
//   if (true === this.callback.call(this.context, node, index))
//     push_(this.list, node);
// }
// function lschildren_(node$: node) {
//   return cc(node$).children;
// }
// function setParentNode_(node$: node, pnode$: node) {
//   cc(node$).parent = pnode$;
// }
function getid_(node$: node) {
  return cc(node$).id;
}
function getidcache_(tree$: tree) {
  return idcache_[tree$.__];
}
// function loop_(list, callback, context, onBreak = false) {
//   for (
//     let i = 0, len = list.length;
//     i < len && onBreak !== callback.call(context, list[i], i, list);
//     i++
//   );
// }
// function walk_(node, context) {
//   let nextNode;
//   const { callback, onBreak, thisContext } = context;
//   //
//   if (onBreak !== callback.call(thisContext, node)) {
//     nextNode = 0 < node.len() ? node.eq(0) : node.next();
//     if (nextNode) walk_(nextNode, context);
//   }
// }
// function find_(node) {
//   const { match, callback, thisContext } = this;
//   if (true === callback.call(thisContext, node)) {
//     match.node = node;
//     return false;
//   }
// }
// //
// function traverseTree_(node, callback, context = null) {
//   if (!isEmpty_(node))
//     forEach(node.children, traverserTree_, { callback, context });
//   //
//   return node;
// }
// function traverserTree_(node, index, coll) {
//   this.callback.call(this.context, node, index, coll);
//   traverseTree_(node, this.callback, this.context);
// }
// function isEmpty_(node) {
//   return !node?.children?.length;
// }
// function omit_(object, ...fields) {
//   return Object.keys(object).reduce((accum, key) => {
//     if (!fields.includes(key)) accum[key] = object[key];
//     //
//     return accum;
//   }, {});
// }
// function load_(json, index, list) {
//   const { node, root, prev, middleware } = this;
//   const ll = list.length;
//   const isTail_ = index === ll - 1;
//   //
//   const newNode = root.node({ value: omit_(json, "children") });
//   node.append(newNode);
//   //
//   middleware && middleware.call(node, newNode, json);
//   //
//   if (!isEmpty_(json)) {
//     if (1 < ll && !isTail_) prev.push(node);
//     this.node = newNode;
//     return;
//   }
//   //
//   if (isTail_) {
//     this.node = prev.pop();
//   }
// }
// function byClass_(node) {
//   return node.hasClass(this.cls);
// }
