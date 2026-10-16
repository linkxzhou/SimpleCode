---
language: js
chapter: 5
title: "JavaScript Data Types"
level: beginner
minutes: 8
goals:
  - "Identify a value with typeof"
  - "Distinguish null from undefined"
  - "Remember that typeof null yields object"
sources:
  - lxiy-js
updated: "2026-10-16"
---

Values carry types, while variables do not stay fixed to one type. `typeof` answers with a string name.

### Three typeof results

Numbers, strings, and booleans each report a different name.

```js run expect="number string boolean" title="Three kinds"
console.log(typeof 3, typeof "茶", typeof true);
```

The names logged are `number string boolean`.

### null is not undefined

Both can mean that nothing useful is present, yet strict equality says they differ. `undefined` means no value was supplied. `null` means an empty value was supplied on purpose.

```js run expect="false" title="They are not equal"
console.log(null === undefined);
```

The comparison logs `false`.

### The old typeof result for null

`typeof null` answers `object` because of a long-standing language quirk. To test for null, compare with `=== null`.

```js run expect="object" title="Historical answer"
console.log(typeof null);
```

The type string is `object`.
