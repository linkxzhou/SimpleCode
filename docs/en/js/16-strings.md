---
language: js
chapter: 16
title: "JavaScript Strings"
level: beginner
minutes: 8
goals:
  - "Read a string length"
  - "Copy a slice of a string"
  - "Replace the first literal match"
sources:
  - lxiy-js
updated: "2026-10-16"
---

`length` counts UTF-16 code units. Each everyday Chinese character occupies one unit.

### Two units

The string of two hanzi therefore reports a length of two.

```js run expect="2" title="Two characters"
console.log("你好".length);
```

The reported length is `2`.

### Start included, end excluded

`slice` keeps the start index and drops the end index.

```js run expect="红" title="First character"
console.log("红茶".slice(0, 1));
```

The kept character is `红`.

### The first match only

`replace` changes the first match and leaves any later match alone. A global regular expression, covered elsewhere, is what changes every match.

```js run expect="绿茶" title="Swap one character"
console.log("红茶".replace("红", "绿"));
```

The swapped word is `绿茶`.
