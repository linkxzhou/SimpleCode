---
language: js
chapter: 0
title: "JavaScript Tutorial"
minutes: 8
goals:
  - "Send a result to the terminal with console.log"
  - "Remember that this book has no page and no DOM"
  - "Recognize that TypeScript types are stripped first"
sources:
  - lxiy-js
updated: "2026-10-16"
---

Samples in this book execute inside QuickJS. No browser document is attached, and npm is not available. A result appears only when the sample prints it.

### Print one line

`console.log` writes every argument and then finishes the line.

```js run expect="Hi" title="First line"
console.log("Hi");
```

The characters on that line are `Hi`.

### No document object

Page objects such as `document` are missing here. The assignment below is shown so you can recognize it, and Run will not execute it.

```js norun title="No page"
document.body.textContent = "Hi";
```

### End each statement with a semicolon

These chapters terminate every statement with a semicolon. Doing so keeps automatic insertion from breaking a line at an unexpected spot.

```js run expect="5" title="Addition"
console.log(2 + 3);
```

Two plus three logs `5`.
