---
language: js
chapter: 16
title: "JavaScript 字符串"
level: beginner
minutes: 8
goals:
  - "读取长度"
  - "截取一段"
  - "按字面替换"
sources:
  - lxiy-js
updated: "2026-10-15"
---

字符串的 `length` 按 UTF-16 码元计。

### 长度

`Hi` 的长度是 2。

```js run expect="2" title="两个字"
console.log("Hi".length);
```

输出里能看到 `2`。

### slice

下标含头不含尾。

```js run expect="r" title="第一个字"
console.log("redtea".slice(0, 1));
```

输出里能看到 `r`。

### replace

默认只换第一处。要换全部，用带 `g` 的正则，那一章另说。

```js run expect="greentea" title="替换"
console.log("redtea".replace("red", "green"));
```

输出里能看到 `greentea`。
