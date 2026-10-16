---
language: js
chapter: 12
title: "JavaScript while Loop"
level: beginner
minutes: 8
goals:
  - "Repeat with while until the test fails"
  - "Guarantee one pass with do while"
  - "Keep the tested value moving"
sources:
  - lxiy-js
updated: "2026-10-16"
---

`while` inspects its condition before every pass. If the condition never changes and `break` is absent, control never comes back.

### Already false

A condition that starts false means the body is skipped entirely.

```js run expect="0" title="Never entered"
let n = 0;
while (n > 0) {
  n -= 1;
}
console.log(n);
```

The number stays `0`.

### Drive the counter down

The body must update whatever the condition reads, or the loop cannot end.

```js run expect="0" title="Countdown"
let left = 2;
while (left > 0) {
  left -= 1;
}
console.log(left);
```

Two subtractions leave `0`.

### The body runs before the test

`do` places the condition after the body, so one pass happens before any test.

```js run expect="1" title="Once before the test"
let n = 0;
do {
  n += 1;
} while (n < 1);
console.log(n);
```

That pass leaves `1`.
