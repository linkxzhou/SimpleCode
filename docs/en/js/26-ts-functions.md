---
language: js
chapter: 26
title: "TypeScript Functions"
level: beginner
minutes: 8
goals:
  - "Annotate an arrow function's parameters"
  - "Mark a parameter optional"
  - "Store a function under a function type"
sources:
  - lxiy-js
updated: "2026-10-16"
---

Function types are written on parameters and on the return value. The call itself is still a JavaScript call.

### A typed arrow parameter

A colon introduces the parameter type. A return type may also be written outside the parentheses.

```ts run expect="8" title="Double"
const twice = (n: number): number => n * 2;
console.log(twice(4));
```

`twice` of four logs `8`.

### A question mark means optional

The question mark after the parameter name means the caller may omit it.

```ts run expect="你好" title="Omit the argument"
function greet(name?: string): string {
  return name ? "你好，" + name : "你好";
}
console.log(greet());
```

Omitting the argument logs `你好`.

### A variable with a function type

A variable can be declared with a function shape, then assigned a function that matches that shape.

```ts run expect="房号18" title="Function variable"
let read: (n: number) => string;
read = (n) => "房号" + n;
console.log(read(18));
```

Calling that function logs `房号18`.
