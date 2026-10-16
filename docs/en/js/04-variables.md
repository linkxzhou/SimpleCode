---
language: js
chapter: 4
title: "JavaScript Variables"
level: beginner
minutes: 8
goals:
  - "Declare a reassignable name with let"
  - "Expect undefined when nothing has been assigned"
  - "Do not leave an unused name in one declaration"
sources:
  - lxiy-js
updated: "2026-10-16"
---

`let` introduces a name whose value may change. Assign something before you read it.

### Name first, value second

The opening line creates `item` without a value. The next line stores a string in that name.

```js run expect="茶" title="Assign a string"
let item;
item = "茶";
console.log(item);
```

Printing `item` shows `茶`.

### Reading too early

A bare declaration still creates the binding. Until an assignment, the value you read is `undefined`.

```js run expect="undefined" title="Nothing stored yet"
let item;
console.log(item);
```

The log reports `undefined`.

### Replace the stored value

The same `let` binding can receive a different number. Here the name begins at 1 and is afterward set to 2.

```js run expect="2" title="Change it to 2"
let n = 1;
n = 2;
console.log(n);
```

The name then prints `2`.
