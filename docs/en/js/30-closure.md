---
language: js
chapter: 30
title: "JavaScript Closures"
level: intermediate
minutes: 10
goals:
  - "Let an inner function remember an outer counter"
  - "Use a parameter so loop callbacks do not share one variable"
  - "Return two functions that see the same binding"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-20"
---

A closure is an inner function that keeps an outer binding. There is no page here, so the samples only print numbers that QuickJS can check.

### Each call adds one

counter leaves n in the outer function. The returned function adds 1 to n and hands it back. Starting at 10, two calls yield 11 and 12, and their sum is 23.

```js run expect="23" title="Two increments"
function counter(start) {
  let n = start;
  return function () {
    n += 1;
    return n;
  };
}
const next = counter(10);
console.log(next() + next());
```

The two calls add up to 23.

### let gives each lap its own i

let inside for creates a fresh binding on every lap. The three functions remember 0, 1, and 2. Index 0 plus index 2 is 2.

```js run expect="2" title="Three laps"
function makeReaders() {
  const fns = [];
  for (let i = 0; i < 3; i += 1) {
    fns.push(function () { return i; });
  }
  return fns;
}
const fns = makeReaders();
console.log(fns[0]() + fns[2]());
```

0 plus 2 is 2.

### Two functions share one array

makeBox returns push and size. They see the same items array. After pushing tea, size is 1.

```js run expect="1" title="Box"
function makeBox() {
  const items = [];
  return {
    push(name) { items.push(name); },
    size() { return items.length; },
  };
}
const box = makeBox();
box.push("tea");
console.log(box.size());
```

The box holds 1 name.

### Exercise: add three times from zero

Make a closure that starts at 0, call it three times, and add the three return values. 1+2+3 should be 6.

```js run expect="6" title="Sum of three calls"
function ticker() {
  let n = 0;
  return function () {
    n += 1;
    return n;
  };
}
const tick = ticker();
console.log(tick() + tick() + tick());
```

The three calls sum to 6.

### You Don't Know JS is only a link

You Don't Know JS is CC-BY-NC-ND, so it cannot be adapted. Open it yourself when you want that book: <https://github.com/getify/You-Dont-Know-JS>.
