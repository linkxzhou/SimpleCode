---
language: js
chapter: 21
title: "JavaScript Errors"
level: beginner
minutes: 8
goals:
  - "Catch a throw with try"
  - "Read the message on an Error"
  - "Keep the success path out of catch"
sources:
  - lxiy-js
updated: "2026-10-16"
---

`throw` abandons the current path. `catch` can log a short explanation once it receives the thrown value.

### A thrown string

A string thrown directly can be logged as it is.

```js run expect="soldout" title="Catch the text"
try {
  throw "soldout";
} catch (err) {
  console.log(err);
}
```

The caught text is `soldout`.

### message on an Error object

When the thrown value is an `Error`, the explanation lives on `message`.

```js run expect="soldout" title="Read message"
try {
  throw new Error("soldout");
} catch (err) {
  console.log(err.message);
}
```

The message text is `soldout`.

### No throw, no catch

If nothing is thrown, `catch` does not run.

```js run expect="ok" title="Nothing failed"
try {
  console.log("ok");
} catch (err) {
  console.log("broke");
}
```

The success log is `ok`.
