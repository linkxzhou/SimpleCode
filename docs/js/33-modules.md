---
language: js
chapter: 33
title: "JavaScript 模块"
level: intermediate
minutes: 10
goals:
  - "知道 import 在单文件脚本里加载不到邻居"
  - "用函数返回一份私有状态"
  - "把两份这样的对象当成两个模块"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-20"
---

QuickJS 这里把编辑器内容当成一个脚本，而不是一组文件。export 和 import 的写法留在阅读里。能跑的是同一文件里的模块函数。

### import 留在阅读里

下面两行如果执行，运行时会说加载不到 math.js。这个练习场没有第二份文件，所以标成不运行。

```js norun title="加载邻居"
import { add } from "./math.js";
console.log(add(1, 2));
```

这段只供阅读。

### 函数交回公开的面

createStore 把 items 关在里面，只交回 add 和 size。add 推进 tea 后返回新长度 1。

```js run expect="1" title="小店"
function createStore() {
  const items = [];
  return {
    add(name) {
      items.push(name);
      return items.length;
    },
  };
}
const store = createStore();
console.log(store.add("tea"));
```

新长度是 1。

### 两份对象互不看见

调用两次 createStore 得到两个店。往第一份加 tea，第二份的 size 仍是 0。这就是两个模块实例。

```js run expect="0" title="两家店"
function createStore() {
  const items = [];
  return {
    add(name) { items.push(name); },
    size() { return items.length; },
  };
}
const east = createStore();
const west = createStore();
east.add("tea");
console.log(west.size());
```

西店的数量是 0。

### 练习：公开一个 total

让模块记下数字并交出 total。加 4 再加 5，total 应是 9。

```js run expect="9" title="合计"
function createLedger() {
  let sum = 0;
  return {
    add(n) { sum += n; },
    total() { return sum; },
  };
}
const ledger = createLedger();
ledger.add(4);
ledger.add(5);
console.log(ledger.total());
```

合计是 9。

### MDN 的模块页

MDN 的 JavaScript 模块指南可以接着看真实的 export，许可是 CC-BY-SA：<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide> 。
