---
language: js
chapter: 32
title: "JavaScript class"
level: intermediate
minutes: 10
goals:
  - "Write a constructor and a method with class"
  - "Override a method with extends"
  - "Put a function that needs no instance in static"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-20"
---

class is one syntax for writing a prototype. Instance fields are attached to this inside the constructor. There is still no DOM.

### The constructor stores milliliters

Cup stores ml on this. double reads that field and multiplies by 2. A 4 milliliter cup doubled is 8.

```js run expect="8" title="Double"
class Cup {
  constructor(ml) { this.ml = ml; }
  double() { return this.ml * 2; }
}
console.log(new Cup(4).double());
```

Doubled, the value is 8.

### A subclass rewrites the label

Mug extends Cup and changes label so it carries a mug prefix. super is unused here because the new method does not call the old one. 3 milliliters prints mug3.

```js run expect="mug3" title="Mug"
class Cup {
  constructor(ml) { this.ml = ml; }
  label() { return "cup" + this.ml; }
}
class Mug extends Cup {
  label() { return "mug" + this.ml; }
}
console.log(new Mug(3).label());
```

The label is mug3.

### A static method does not need new

static hangs on the constructor, not on the prototype. Cup.sign(5) yields c5 without building a cup first.

```js run expect="c5" title="Static mark"
class Cup {
  static sign(n) { return "c" + n; }
}
console.log(Cup.sign(5));
```

The mark is c5.

### Exercise: a subclass calls super

The Tall constructor uses super(ml) to pass milliliters to Cup, then sets its own high to true. Reading ml should be 9.

```js run expect="9" title="Taller cup"
class Cup {
  constructor(ml) { this.ml = ml; }
}
class Tall extends Cup {
  constructor(ml) {
    super(ml);
    this.high = true;
  }
}
console.log(new Tall(9).ml);
```

The milliliters are 9.

### The professional book is an outline

Professional JavaScript for Web Developers, 4th edition, can set the difficulty for classes. Do not copy its sentences: <https://book.douban.com/subject/35175321>.
