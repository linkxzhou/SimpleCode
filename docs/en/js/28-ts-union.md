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

```ts run expect="数字3" title="The number arm"
function show(value: string | number): string {
  if (typeof value === "number") return "数字" + value;
  return value;
}
console.log(show(3));
```

Passing 3 logs `数字3`.

### The other arm

A string argument takes the remaining return.

```ts run expect="文本茶" title="The text arm"
function show(value: string | number): string {
  if (typeof value === "number") return "数字";
  return "文本" + value;
}
console.log(show("茶"));
```

Passing the string logs `文本茶`.

### A union of string literals

Only the listed strings are allowed.

```ts run expect="小" title="Literal size"
type Size = "小" | "大";
const size: Size = "小";
console.log(size);
```

The chosen literal logs `小`.
