---
language: js
chapter: 2
title: "JavaScript Statements"
level: beginner
minutes: 8
goals:
  - "Place one statement on its own line"
  - "Group statements with braces"
  - "Remember that a bare expression can be a statement"
sources:
  - lxiy-js
updated: "2026-10-16"
---

Execution follows the written order. Braces collect statements into a single block.

### Top to bottom

Four is stored first. The following line adds one, and the log happens after that update.

```js run expect="5" title="Add one"
let n = 4;
n = n + 1;
console.log(n);
```

The updated number is `5`.

### Braces limit a binding

A `let` created inside braces cannot be read once the brace closes. The log sits inside, while the name still exists.

```js run expect="hangzhou" title="Inside the block"
{
  let city = "hangzhou";
  console.log(city);
}
```

The city logged from inside is `hangzhou`.

### A lone semicolon does nothing

An isolated semicolon is an empty statement. The log that comes next produces the visible text.

```js run expect="has" title="Skip the empty statement"
;
console.log("has");
```

That log writes `has`.
