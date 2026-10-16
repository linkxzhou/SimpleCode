---
language: js
chapter: 15
title: "JavaScript Scope"
level: beginner
minutes: 8
goals:
  - "Keep a parameter inside its function"
  - "Capture an outer variable in a closure"
  - "Hide an inner let from the code outside the block"
sources:
  - lxiy-js
updated: "2026-10-16"
---

A function can read names from the surrounding scope where it was created. An inner `let` does not escape that block.

### The parameter stays inside

`greet` can see `name` only while that function is running.

```js run expect="lin" title="Pass a name"
function greet(name) {
  return name;
}
console.log(greet("lin"));
```

The returned characters are `lin`.

### The inner function keeps the counter

The function returned from `counter` can still increment the outer `n`.

```js run expect="1 2" title="Two calls"
function counter() {
  let n = 0;
  return function () {
    n += 1;
    return n;
  };
}
const next = counter();
console.log(next(), next());
```

The two results are `1 2`.

### An inner let hides the outer spelling

Once the block ends, the outer city is unchanged. The log uses the inner spelling.

```js run expect="suzhou" title="Inner city"
let city = "hangzhou";
{
  let city = "suzhou";
  console.log(city);
}
```

The inner spelling prints `suzhou`.
