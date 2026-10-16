---
language: js
chapter: 20
title: "JavaScript JSON"
level: beginner
minutes: 8
goals:
  - "Parse text into an object"
  - "Serialize an object back into text"
  - "Catch text that is not valid JSON"
sources:
  - lxiy-js
updated: "2026-10-16"
---

`JSON.parse` turns text into a value. `JSON.stringify` turns a value back into text.

### Double quotes on keys

A JSON key has to be written with double quotes.

```js run expect="3" title="Read a number"
console.log(JSON.parse('{"n":3}').n);
```

The field `n` is `3`.

### Round trip

`stringify` produces text, and a following `parse` can retrieve the original number.

```js run expect="3" title="Write then read"
const text = JSON.stringify({ n: 3 });
console.log(JSON.parse(text).n);
```

The retrieved number is `3`.

### Broken text

Leaving out a brace makes `parse` throw. `try` receives that throw and logs a short note.

```js run expect="broken" title="Parsing failed"
try {
  JSON.parse("{");
  console.log("passed");
} catch (err) {
  console.log("broken");
}
```

The note logged is `broken`.
