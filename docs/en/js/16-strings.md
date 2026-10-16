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

`length` counts UTF-16 code units.

### Two units

`Hi` reports a length of 2.

```js run expect="2" title="Two characters"
console.log("Hi".length);
```

The reported length is `2`.

### Start included, end excluded

`slice` keeps the start index and drops the end index.

```js run expect="r" title="First character"
console.log("redtea".slice(0, 1));
```

The kept character is `r`.

### The first match only

`replace` changes the first match and leaves any later match alone. A global regular expression, covered elsewhere, is what changes every match.

```js run expect="greentea" title="Swap one character"
console.log("redtea".replace("red", "green"));
```

The swapped word is `greentea`.
