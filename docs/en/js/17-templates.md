---
language: js
chapter: 17
title: "JavaScript Template Strings"
level: beginner
minutes: 8
goals:
  - "Insert a variable between backticks"
  - "Evaluate arithmetic inside a template"
  - "Expect two output lines when a newline is kept"
sources:
  - lxiy-js
updated: "2026-10-16"
---

Backtick strings evaluate expressions written inside `${}`. Ordinary quotation marks do not perform that substitution.

### Drop a name into the text

The braces contain an expression. Its result is converted to text and spliced in.

```js run expect="你好，林" title="Insert the name"
const name = "林";
console.log(`你好，${name}`);
```

The spliced greeting is `你好，林`.

### Arithmetic inside the braces

A plus expression is legal between the braces.

```js run expect="合计5" title="Add inside"
console.log(`合计${2 + 3}`);
```

The filled template logs `合计5`.

### Double quotes stay literal

Inside double quotes, the characters `${name}` are not looked up as a variable.

```js run expect="false" title="Quotes are not a template"
const name = "林";
console.log("${name}" === name);
```

Comparing them with the variable logs `false`.
