---
language: js
chapter: 39
title: "TypeScript Generics"
level: advanced
minutes: 11
goals:
  - "Write a generic function that hands a value back"
  - "Require length with extends"
  - "Put a type parameter on a box"
sources:
  - mdn-js
  - ts-handbook
  - lxiy-js
updated: "2026-10-20"
---

Generics are erased at transpile time. After Sucrase removes the types, QuickJS only sees an ordinary function. Each sample must still run after that erasure, and it prints a value, not a type.

### Hand a string back unchanged

The type parameter T on identity follows the argument. Passing tea, after the types are erased, simply returns the argument and prints tea.

```ts run expect="tea" title="Return as-is"
function identity<T>(value: T): T {
  return value;
}
console.log(identity<string>("tea"));
```

The value handed back is tea.

### Accept only values that have a length

longest requires T to have length. The two strings are compared by length, cupboard is longer than tea, so cupboard comes back. The comparison happens at runtime; the constraint matters only before transpile.

```ts run expect="cupboard" title="The longer one"
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}
console.log(longest("tea", "cupboard"));
```

The longer value is cupboard.

### A box remembers one kind of value

get on Box<T> hands back the stored value. Storing the number 4 and multiplying by 2 yields 8. The type parameter does not create a real container type at runtime.

```ts run expect="8" title="Number box"
class Box<T> {
  value: T;
  constructor(value: T) { this.value = value; }
  get(): T { return this.value; }
}
const box = new Box<number>(4);
console.log(box.get() * 2);
```

Reading and multiplying yields 8.

### Exercise: take the first item of an array

Write first<T> so it returns items[0]. Passing oak and elm should print oak.

```ts run expect="oak" title="First item"
function first<T>(items: T[]): T {
  return items[0];
}
console.log(first(["oak", "elm"]));
```

The first item is oak.

### The handbook generics chapter

The generics pages in the TypeScript handbook are CC-BY-4.0. Use them as a guide; the functions here were written separately: <https://www.typescriptlang.org/docs/handbook/intro.html>.
