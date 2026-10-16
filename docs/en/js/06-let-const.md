---
language: js
chapter: 6
title: "JavaScript let and const"
level: beginner
minutes: 8
goals:
  - "Bind a name you will not reassign with const"
  - "Update fields of a const object"
  - "Leave var out of new code"
sources:
  - lxiy-js
updated: "2026-10-16"
---

`const` forbids pointing the name at a different value. Properties inside the object may still be written.

### The binding stays fixed

Choose `let` when the name itself must later point elsewhere. This sample only reads the number it was given.

```js run expect="3" title="Fixed binding"
const n = 3;
console.log(n);
```

The fixed number is `3`.

### Fields stay writable

`const` protects the binding, not the object's interior. Writing `cup.ml` is allowed.

```js run expect="7" title="Update a field"
const cup = { ml: 8 };
cup.ml = 7;
console.log(cup.ml);
```

The field prints `7`.

### Why these lessons skip var

`var` is hoisted to the function top, so a read placed earlier can observe `undefined`. Fresh code should use `let` or `const`.

```js norun title="Read before declaring"
console.log(n);
var n = 1;
```

Run skips this block. It shows a read of `n` placed before the `var` line.
