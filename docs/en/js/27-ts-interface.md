---
language: js
chapter: 27
title: "TypeScript Interfaces"
level: beginner
minutes: 8
goals:
  - "Describe an object with interface"
  - "Remember that extra checks happen before transpilation"
  - "Read a field declared on the interface"
sources:
  - lxiy-js
updated: "2026-10-16"
---

An interface exists only for the type checker. After transpilation, field access is an ordinary dot.

### Require the listed fields

The object must include every field the interface lists.

```ts run expect="18" title="Unit price"
interface Item {
  name: string;
  price: number;
}
const item: Item = { name: "茶", price: 18 };
console.log(item.price);
```

The price field logs `18`.

### readonly still allows a read

`readonly` forbids a later assignment. Reading the field is unaffected.

```ts run expect="茶" title="Read the name"
interface Item {
  readonly name: string;
}
const item: Item = { name: "茶" };
console.log(item.name);
```

The name field logs `茶`.

### A field marked optional

A question mark means the field may be absent. When it is absent, the log shows `undefined`.

```ts run expect="undefined" title="No note"
interface Item {
  name: string;
  note?: string;
}
const item: Item = { name: "茶" };
console.log(item.note);
```

The absent note logs `undefined`.
