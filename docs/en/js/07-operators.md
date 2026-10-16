---
language: js
chapter: 7
title: "JavaScript Operators"
level: beginner
minutes: 8
goals:
  - "Use addition, subtraction, and the remainder"
  - "Concatenate strings with plus"
  - "Expect plus to coerce a number into text"
sources:
  - lxiy-js
updated: "2026-10-16"
---

Numeric operators calculate with numbers. When either operand of `+` is a string, that operator concatenates.

### What remains after division

The percent operator returns the leftover of integer division. Twenty-one divided by ten leaves a leftover of one.

```js run expect="1" title="Remainder"
console.log(21 % 10);
```

The leftover prints as `1`.

### Plus on two numbers

Plus adds when both operands are numbers.

```js run expect="21" title="Add the numbers"
console.log(20 + 1);
```

The sum prints as `21`.

### Plus beside text

The number is coerced to text and then attached. No space is inserted between the parts.

```js run expect="房号18" title="Concatenate"
console.log("房号" + 18);
```

The attached text is `房号18`.
