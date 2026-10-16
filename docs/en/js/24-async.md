---
language: js
chapter: 24
title: "JavaScript async/await"
level: beginner
minutes: 8
goals:
  - "Await an already settled value from an async function"
  - "Put await inside a function rather than at the top of the file"
  - "Catch a rejected await with try"
sources:
  - lxiy-js
updated: "2026-10-16"
---

Whether top-level `await` works depends on the script being a module. These lessons place `await` inside an `async` function and then call that function.

### Await a settled promise

`await` on an already fulfilled promise yields the value inside it.

```js run expect="tea" title="Wait for the name"
async function run() {
  const name = await Promise.resolve("tea");
  console.log(name);
}
run();
```

The awaited text is `tea`.

### One await after another

Both promises are already fulfilled. The printed number still comes from the second step, which uses the first result.

```js run expect="5" title="Two steps"
async function run() {
  const a = await Promise.resolve(2);
  const b = await Promise.resolve(a + 3);
  console.log(b);
}
run();
```

The second step logs `5`.

### A rejection enters catch

`await` on a rejected promise throws into the surrounding `try`.

```js run expect="caught" title="Rejected"
async function run() {
  try {
    await Promise.reject(new Error("lack"));
    console.log("passed");
  } catch (err) {
    console.log("caught");
  }
}
run();
```

The catch clause logs `caught`.
