---
language: js
chapter: 13
title: "JavaScript break and continue"
level: beginner
minutes: 8
goals:
  - "Exit a loop with break"
  - "Skip the rest of one pass with continue"
  - "Affect only the nearest loop"
sources:
  - lxiy-js
updated: "2026-10-16"
---

`break` abandons the current loop. `continue` abandons only the remainder of this pass and starts the next one.

### Exit when the count hits three

The open-ended `for` keeps adding until the number equals 3, then `break` leaves.

```js run expect="3" title="Exit at 3"
let n = 0;
for (;;) {
  n += 1;
  if (n === 3) break;
}
console.log(n);
```

The number at exit is `3`.

### Skip the even numbers

`continue` bypasses the addition for even values. The odds 1 and 3 sum to 4.

```js run expect="4" title="Skip evens"
let sum = 0;
for (let i = 1; i <= 4; i++) {
  if (i % 2 === 0) continue;
  sum += i;
}
console.log(sum);
```

The odd sum is `4`.

### Only this loop is affected

A single `for` is present, so `break` leaves that `for` and no other.

```js run expect="2" title="Exit at 2"
let seen = 0;
for (let i = 0; i < 5; i++) {
  seen = i;
  if (i === 2) break;
}
console.log(seen);
```

The last index stored is `2`.
