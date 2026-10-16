---
language: js
chapter: 28
title: "TypeScript Union Types"
level: beginner
minutes: 8
goals:
  - "Name several possibilities with a vertical bar"
  - "Narrow the type before using the value"
  - "Limit a value with a literal union"
sources:
  - lxiy-js
updated: "2026-10-16"
---

A union type means the value is one of the listed alternatives. Narrow it before you apply an operation that only one alternative supports.

### String or number

`typeof` decides which return text to build.

```ts run expect="num3" title="The number arm"
function show(value: string | number): string {
  if (typeof value === "number") return "num" + value;
  return value;
}
console.log(show(3));
```

Passing 3 logs `num3`.

### The other arm

A string argument takes the remaining return.

```ts run expect="texttea" title="The text arm"
function show(value: string | number): string {
  if (typeof value === "number") return "num";
  return "text" + value;
}
console.log(show("tea"));
```

Passing the string logs `texttea`.

### A union of string literals

Only the listed strings are allowed.

```ts run expect="small" title="Literal size"
type Size = "small" | "big";
const size: Size = "small";
console.log(size);
```

The chosen literal logs `small`.
