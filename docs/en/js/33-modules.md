---
language: js
chapter: 33
title: "JavaScript Modules"
level: intermediate
minutes: 10
goals:
  - "See that import cannot load a neighbor from a single script"
  - "Return private state from a function"
  - "Treat two such objects as two modules"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-20"
---

QuickJS treats the editor buffer as one script, not as a set of files. The export and import forms stay in the reading-only block. What can run is a module function in that same file.

### import stays unread

If the next lines ran, the runtime would say it could not load math.js. This playground has no second file, so the block is marked not to run.

```js norun title="Load a neighbor"
import { add } from "./math.js";
console.log(add(1, 2));
```

This block is for reading only.

### A function hands back the public face

createStore keeps items inside and hands back only add and size. add pushes tea and returns the new length, 1.

```js run expect="1" title="Store"
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

The new length is 1.

### Two objects do not see each other

Calling createStore twice yields two stores. Adding tea to the first leaves the second size at 0. Those are two module instances.

```js run expect="0" title="Two stores"
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

The west store has size 0.

### Exercise: expose a total

Let the module remember numbers and expose total. Add 4 and then 5, and total should be 9.

```js run expect="9" title="Total"
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

The total is 9.

### The MDN modules page

The MDN JavaScript modules guide is the place to read a real export. Its license is CC-BY-SA: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide>.
