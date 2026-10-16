---
language: js
chapter: 11
title: "JavaScript for Loop"
level: beginner
minutes: 8
goals:
  - "Total values with a three-part for"
  - "Visit elements with for...of"
  - "Do not rely on an index the loop does not give you"
sources:
  - lxiy-js
updated: "2026-10-16"
---

A `for` loop can count with an index. It can also walk the elements of an array directly.

### Three clauses

The initializer, the test, and the update are divided by semicolons. There is no built-in named `range`.

```js run expect="6" title="Sum through 3"
let sum = 0;
for (let i = 1; i <= 3; i++) {
  sum += i;
}
console.log(sum);
```

Adding one, two, and three logs `6`.

### The loop variable is the element

`for...of` binds each element in turn. The sample keeps overwriting `last` with that element.

```js run expect="茶" title="Final element"
const items = ["水", "茶"];
let last = "";
for (const name of items) {
  last = name;
}
console.log(last);
```

The final element saved is `茶`.

### Brackets when the position matters

Use the length and square brackets when the position matters. Slot 1 of this array contains the second string.

```js run expect="茶" title="Slot 1"
const items = ["水", "茶"];
console.log(items[1]);
```

That slot prints `茶`.
