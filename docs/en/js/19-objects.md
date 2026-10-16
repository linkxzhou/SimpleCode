---
language: js
chapter: 19
title: "JavaScript Objects"
level: beginner
minutes: 8
goals:
  - "Read a field with a dot or with brackets"
  - "Merge objects by spreading them"
  - "Read a missing field with optional chaining"
sources:
  - lxiy-js
updated: "2026-10-16"
---

An object literal is written with braces. Each field name is a string.

### Dot and brackets agree

Both forms read the same stored value.

```js run expect="tea 18" title="Two fields"
const item = { name: "tea", price: 18 };
console.log(item.name, item["price"]);
```

The pair of fields logs `tea 18`.

### Later fields overwrite

Spreading a second object replaces any field that shares a name.

```js run expect="20" title="Later price wins"
const item = { ...{ price: 18 }, ...{ price: 20 } };
console.log(item.price);
```

The price that remains is `20`.

### A missing middle does not throw

When `shop` is absent, the `?.` operator produces `undefined` instead of throwing.

```js run expect="undefined" title="No shop field"
const item = {};
console.log(item.shop?.name);
```

The missing name logs `undefined`.
