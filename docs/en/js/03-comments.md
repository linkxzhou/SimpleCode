---
language: js
chapter: 3
title: "JavaScript Comments"
level: beginner
minutes: 8
goals:
  - "Mark a line comment with two slashes"
  - "Cross lines with a block comment"
  - "Remember that commented code does not run"
sources:
  - lxiy-js
updated: "2026-10-16"
---

Comments exist for people. The engine discards them and never runs the text inside.

### To the end of the line

Text after `//` is ignored through the line break. The log written before those slashes still executes.

```js run expect="shown" title="Keep what is visible"
console.log("shown"); // does not print hidden
```

What remains visible is `shown`.

### A comment that can cross lines

The pair `/*` and `*/` may enclose more than one line. The log inside this pair is skipped.

```js run expect="kept" title="Skip the whole span"
/* console.log("hidden"); */
console.log("kept");
```

The log after the comment writes `kept`.

### Notes are not string values

Words sitting in a comment never become data. Put the word in quotes when it should be stored and printed.

```js run expect="tea" title="Only quoted text counts"
const word = "tea"; // this is a note
console.log(word);
```

The stored word is `tea`.
