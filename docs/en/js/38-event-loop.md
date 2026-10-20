---
language: js
chapter: 38
title: "JavaScript Event Loop and Microtasks"
level: advanced
minutes: 11
goals:
  - "See that synchronous code runs before then"
  - "Queue another microtask from inside a microtask"
  - "See that setTimeout stalls this run"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-20"
---

Promise.then queues a function as a microtask. Synchronous code in the current turn finishes before those queued microtasks run. setTimeout on this QuickJS build does not come back on time, and calling it stalls the run, so that call is for reading only.

### Synchronous A and C appear first

A and C are pushed synchronously. B and D run inside then. The print happens at the end of the second then, so the order is A, C, B, D.

```js run expect="ACBD" title="Sync first"
const log = [];
log.push("A");
Promise.resolve().then(function () { log.push("B"); });
log.push("C");
Promise.resolve().then(function () {
  log.push("D");
  console.log(log.join(""));
});
```

The order is ACBD.

### An inner then waits behind microtasks already queued

The first then pushes B and queues another then that pushes inner. The print sits in a then that was queued earlier, so inner is not in the log yet. The visible line is ACB.

```js run expect="ACB" title="Inner has not run"
const log = [];
log.push("A");
Promise.resolve().then(function () {
  log.push("B");
  Promise.resolve().then(function () { log.push("inner"); });
});
log.push("C");
Promise.resolve().then(function () { console.log(log.join("")); });
```

This line is ACB.

### Do not run setTimeout

A timer callback waits until the script yields. This host stalls on the timer, and the docs smoke test would not see the run finish. The now and later lines below are for reading.

```js norun title="Timer stalls"
setTimeout(function () { console.log("later"); }, 0);
console.log("now");
```

This block is for reading only.

### Exercise: queue three microtasks in order

Put only S in the synchronous part. Three then callbacks append 1, 2, and 3, and the last one prints. The result should be S123.

```js run expect="S123" title="Three microtasks"
const log = ["S"];
Promise.resolve().then(function () { log.push("1"); });
Promise.resolve().then(function () { log.push("2"); });
Promise.resolve().then(function () {
  log.push("3");
  console.log(log.join(""));
});
```

The queued line is S123.

### The MDN event-loop notes

MDN writes up macrotasks and microtasks in more detail under CC-BY-SA: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide>.
