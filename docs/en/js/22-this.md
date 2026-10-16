---
language: js
chapter: 22
title: "JavaScript this"
level: beginner
minutes: 8
goals:
  - "Read this from a method call"
  - "See that a detached function loses this"
  - "Take this from the enclosing function with an arrow"
sources:
  - lxiy-js
updated: "2026-10-16"
---

`this` is set by the call. A method call and a bare call can therefore see different receivers.

### A method call sets this

In `cup.read()`, `this` is `cup`, so the method can read `ml`.

```js run expect="8" title="Read the field"
const cup = {
  ml: 8,
  read() {
    return this.ml;
  },
};
console.log(cup.read());
```

The field value is `8`.

### Pass the object yourself

A function copied off its object can lose `this`. This sample passes the object as an ordinary parameter.

```js run expect="8" title="Pass the object in"
function read(cup) {
  return cup.ml;
}
console.log(read({ ml: 8 }));
```

The parameter's field is `8`.

### An arrow does not get its own this

Inside an arrow, `this` is the `this` of the enclosing function. With no object in scope, read a local instead of a field.

```js run expect="8" title="Read the outer local"
const ml = 8;
const read = () => ml;
console.log(read());
```

The local prints `8`.
