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

字符串的 `length` 按 UTF-16 码元计。常见汉字一个算一个。

### 长度

两个汉字的长度是 2。

```js run expect="2" title="两个字"
console.log("你好".length);
```

输出里能看到 `2`。

### slice

下标含头不含尾。

```js run expect="红" title="第一个字"
console.log("红茶".slice(0, 1));
```

输出里能看到 `红`。

### replace

默认只换第一处。要换全部，用带 `g` 的正则，那一章另说。

```js run expect="绿茶" title="替换"
console.log("红茶".replace("红", "绿"));
```

输出里能看到 `绿茶`。
