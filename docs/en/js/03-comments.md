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

```js run expect="可见" title="Keep what is visible"
console.log("可见"); // 不打印隐藏
```

What remains visible is `可见`.

### A comment that can cross lines

The pair `/*` and `*/` may enclose more than one line. The log inside this pair is skipped.

```js run expect="留下" title="Skip the whole span"
/* console.log("隐藏"); */
console.log("留下");
```

The log after the comment writes `留下`.

### Notes are not string values

Words sitting in a comment never become data. Put the word in quotes when it should be stored and printed.

```js run expect="茶" title="Only quoted text counts"
const word = "茶"; // 这是说明
console.log(word);
```

The stored word is `茶`.
