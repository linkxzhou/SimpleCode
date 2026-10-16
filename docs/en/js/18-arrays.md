---
language: js
chapter: 18
title: "JavaScript Arrays"
level: beginner
minutes: 8
goals:
  - "Append an element with push"
  - "Build another array with map"
  - "Keep matching elements with filter"
sources:
  - lxiy-js
updated: "2026-10-16"
---

Array positions are ordered and begin at zero. `map` and `filter` allocate a new array instead of editing the original.

### push reports the new length

`push` edits the existing array and returns how many elements it now holds.

```js run expect="2" title="Length after push"
const nums = [1];
console.log(nums.push(2));
```

The returned count is `2`.

### A new array from map

`map` collects whatever the callback returns. `join` prints that collection so the line does not depend on an engine's array format.

```js run expect="2,4,6" title="Double each"
const nums = [1, 2, 3];
console.log(nums.map((n) => n * 2).join(","));
```

The doubled line is `2,4,6`.

### filter keeps the evens

The callback retains a number only when the remainder with 2 is zero.

```js run expect="2,4" title="Evens only"
console.log([1, 2, 3, 4].filter((n) => n % 2 === 0).join(","));
```

The retained numbers are `2,4`.
