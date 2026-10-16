---
language: js
chapter: 23
title: "JavaScript Promise"
level: beginner
minutes: 8
goals:
  - "Queue a callback on an already settled Promise"
  - "Notice that synchronous code runs before then"
  - "Catch a rejection with catch"
sources:
  - lxiy-js
updated: "2026-10-16"
---

There is no network in these samples. `Promise.resolve` means the value is already present, yet `then` still waits until the current synchronous code finishes.

### Synchronous work is recorded first

The array stores the synchronous word before the microtask appends the resolved name. One log prints both, in that order.

```js run expect="先-茶" title="Synchronous word first"
function run() {
  const log = [];
  const chain = Promise.resolve("茶").then(function (name) {
    log.push(name);
  });
  log.push("先");
  return chain.then(function () {
    console.log(log.join("-"));
  });
}
run();
```

The joined log is `先-茶`.

### A returned value feeds the next then

Whatever the callback returns is passed to the following `then`.

```js run expect="3" title="Add one in then"
function run() {
  return Promise.resolve(2).then(function (n) {
    return n + 1;
  }).then(function (n) {
    console.log(n);
  });
}
run();
```

The following callback logs `3`.

### throw inside then

A `throw` inside `then` is delivered to a later `catch`.

```js run expect="接住" title="Failure path"
function run() {
  return Promise.resolve(1).then(function () {
    throw new Error("缺");
  }).catch(function () {
    console.log("接住");
  });
}
run();
```

The catch callback logs `接住`.
