---
language: js
chapter: 14
title: "JavaScript Functions"
level: beginner
minutes: 8
goals:
  - "Declare a function with the function keyword"
  - "Write a one-expression arrow function"
  - "Supply a default for a missing argument"
sources:
  - lxiy-js
updated: "2026-10-16"
---

A function packages a calculation under a name you can call. An arrow fits when the whole body is one expression.

### Parameters line up by position

The call passes 2 and 3 into `a` and `b` in that order.

```js run expect="5" title="Add two parameters"
function add(a, b) {
  return a + b;
}
console.log(add(2, 3));
```

The returned sum is `5`.

### An arrow with no return keyword

When the arrow body is a single expression, `return` is implied.

```js run expect="5" title="Arrow add"
const add = (a, b) => a + b;
console.log(add(4, 1));
```

Four plus one through that arrow logs `5`.

### A default fills a missing argument

If the caller omits the argument, the value after the equals sign is used.

```js run expect="Hello, guest" title="Caller omits the name"
function greet(name = "guest") {
  return "Hello, " + name;
}
console.log(greet());
```

The call with no argument logs `Hello, guest`.
