---
language: js
chapter: 1
title: "JavaScript Output"
level: beginner
minutes: 8
goals:
  - "Print several values with console.log"
  - "Join an array into one line"
  - "Do not call alert"
sources:
  - lxiy-js
updated: "2026-10-16"
---

Only the terminal is visible in this runtime. Popups have no window to use, and page text cannot be rewritten.

### Several arguments

A space is inserted between arguments. Text and a number therefore share one line.

```js run expect="tea 18" title="Two items"
console.log("tea", 18);
```

You should see `tea 18`.

### Build one string

`join` uses exactly the separator you supply. It does not add the extra space that separate log arguments receive.

```js run expect="tea-water" title="Join"
console.log(["tea", "water"].join("-"));
```

The joined result is `tea-water`.

### alert is unavailable

`alert` belongs to the browser. This page has a terminal instead of a dialog.

```js norun title="No dialog"
alert("Hi");
```

Read the call, but do not expect a popup.
