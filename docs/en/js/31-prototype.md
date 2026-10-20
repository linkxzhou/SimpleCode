---
language: js
chapter: 31
title: "JavaScript Prototypes"
level: intermediate
minutes: 10
goals:
  - "Attach a prototype with Object.create"
  - "Tell an own property from a prototype property"
  - "Find a method by walking the prototype chain"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-20"
---

A property missing on the object itself is looked up on the prototype. That prototype may have a prototype of its own. This chapter does not draw a browser diagram; it prints the lookup.

### kind lives on the prototype

row itself only has ml. kind sits on proto, and reading row.kind still yields cup. hasOwnProperty is false for kind because it does not belong to row.

```js run expect="cup-false" title="kind on the prototype"
const proto = { kind: "cup" };
const row = Object.create(proto);
row.ml = 8;
const own = Object.prototype.hasOwnProperty.call(row, "kind");
console.log(row.kind + "-" + own);
```

The line is `cup-false`.

### An own property hides the prototype

Writing kind onto row hides the prototype. hasOwnProperty becomes true, and the read is mug.

```js run expect="mug-true" title="Own kind"
const proto = { kind: "cup" };
const row = Object.create(proto);
row.kind = "mug";
const own = Object.prototype.hasOwnProperty.call(row, "kind");
console.log(row.kind + "-" + own);
```

The line is `mug-true`.

### A method can sit on the prototype

price is written on the prototype, and this is still the object used at the call. row.ml is 4, and the method multiplies it by 3 to get 12.

```js run expect="12" title="Prototype method"
const proto = {
  price() { return this.ml * 3; },
};
const row = Object.create(proto);
row.ml = 4;
console.log(row.price());
```

The method returns 12.

### Exercise: what is the prototype of a plain object

Object.getPrototypeOf({}) should be Object.prototype. Compare the two references and print yes.

```js run expect="yes" title="Default prototype"
const proto = Object.getPrototypeOf({});
console.log(proto === Object.prototype ? "yes" : "no");
```

The comparison prints yes.

### javascript.info cannot be adapted

javascript.info is CC-BY-NC-SA, so its prototype chapter is further reading only: <https://javascript.info/>.
