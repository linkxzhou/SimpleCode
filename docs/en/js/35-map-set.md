---
language: js
chapter: 35
title: "JavaScript Map, Set, and WeakMap"
level: intermediate
minutes: 10
goals:
  - "Look up a price by name with Map"
  - "Drop duplicates with Set"
  - "Use an object as a WeakMap key"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-20"
---

Map keys can be any value, and Set keeps one copy. WeakMap keys must be objects. You can read the value you stored, and you cannot list the keys.

### Read a price by name

After two set calls, get("bun") returns 6. The keys are strings, and they do not follow the rules of object fields.

```js run expect="6" title="Bun price"
const prices = new Map();
prices.set("tea", 4);
prices.set("bun", 6);
console.log(prices.get("bun"));
```

The bun price is 6.

### Duplicate tea is stored once

The Set constructor receives two tea values and one cup. size counts distinct values, so it is 2.

```js run expect="2" title="Drop duplicates"
const bag = new Set(["tea", "tea", "cup"]);
console.log(bag.size);
```

There are 2 distinct values.

### An object is the WeakMap key

box is an empty object. weak.set maps it to tea, and the same object gets that value back. A different object would not.

```js run expect="tea" title="Weak map"
const box = {};
const weak = new WeakMap();
weak.set(box, "tea");
console.log(weak.get(box));
```

The value read back is tea.

### Exercise: does the Set contain bun

Put tea and bun into a Set and ask has for bun. If it is present, print yes.

```js run expect="yes" title="Has bun"
const bag = new Set(["tea", "bun"]);
console.log(bag.has("bun") ? "yes" : "no");
```

The answer is yes.

### The MDN collection pages

Map, Set, and WeakMap details live on MDN under CC-BY-SA. The samples in this chapter were written separately: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide>.
