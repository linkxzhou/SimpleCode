---
language: js
chapter: 8
title: "JavaScript Comparison"
level: beginner
minutes: 8
goals:
  - "Distinguish == from ==="
  - "Notice that an empty string loosely equals 0"
  - "Prefer ==="
sources:
  - lxiy-js
updated: "2026-10-16"
---

The operator `==` converts operands before comparing them. The operator `===` refuses the match when the types differ.

### Equality that converts

Under `==`, an empty string and the number 0 count as the same.

```js run expect="true" title="Conversion happens"
console.log("" == 0);
```

That loose test logs `true`.

### Equality that does not convert

The identical pair fails `===` because one side is text and the other is a number.

```js run expect="false" title="No conversion"
console.log("" === 0);
```

That strict test logs `false`.

### Ordering numbers

A greater-than test can compare numbers directly. Because three exceeds one, the result is true.

```js run expect="true" title="Greater"
console.log(3 > 1);
```

The ordering test logs `true`.
