---
language: js
chapter: 29
title: "TypeScript Type Assertions"
level: beginner
minutes: 8
goals:
  - "Tell the compiler a concrete type with as"
  - "Remember that an assertion is not checked at runtime"
  - "Prefer narrowing over an assertion"
sources:
  - lxiy-js
updated: "2026-10-16"
---

An assertion affects only the checks that happen before transpilation. At runtime, nothing extra is tested because of `as`.

### Assert that the value is a string

When the value is already a string, `as string` lets the annotation pass.

```ts run expect="1" title="One character"
const value: unknown = "tea";
console.log((value as string).length);
```

The length logs `1`.

### as does not convert

`as number` does not turn text into a number. Convert with `Number` first, then annotate.

```ts run expect="13" title="Convert first"
const text = "12";
const n = Number(text) as number;
console.log(n + 1);
```

One more than that number logs `13`.

### Narrowing is the safer habit

After a `typeof` test, the branch already has a narrower type, so another assertion is unnecessary.

```ts run expect="1" title="After the test"
function len(value: unknown): number {
  if (typeof value === "string") return value.length;
  return 0;
}
console.log(len("tea"));
```

The length of the string logs `1`.
