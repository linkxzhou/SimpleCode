---
language: js
chapter: 25
title: "TypeScript Types"
level: beginner
minutes: 8
goals:
  - "Annotate a variable with a type"
  - "Remember that types are erased before execution"
  - "Print a title that still carries an annotation"
sources:
  - lxiy-js
updated: "2026-10-16"
---

A type annotation sits beside a name. Before the program runs, Sucrase removes those annotations, and the editor can show the transpiled result.

### Annotate a string

The first TypeScript sample logs the characters for buying a pen. The annotation exists only in the source. The output is still that word.

```ts run expect="买笔" title="One title"
const item: string = "买笔";
console.log(item);
```

The logged word is `买笔`.

### Annotate numbers

Parameters and the return value can all carry annotations. After the annotations are removed, the function is ordinary JavaScript.

```ts run expect="5" title="Typed addition"
function add(a: number, b: number): number {
  return a + b;
}
console.log(add(2, 3));
```

The sum of two and three is `5`.

### A boolean annotation

`boolean` allows only `true` and `false`.

```ts run expect="true" title="Boolean flag"
const open: boolean = true;
console.log(open);
```

The flag logs `true`.
