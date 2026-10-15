---
language: js
chapter: 7
title: "JavaScript 运算符"
level: beginner
minutes: 8
goals:
  - "使用加减和余数"
  - "用加号拼接字符串"
  - "知道加号会把数字变成文本"
sources:
  - lxiy-js
updated: "2026-10-15"
---

算术按数字算。加号如果有一边是字符串，就会拼接。

### 余数

`%` 是余数。21 除以 10 余 1。

```js run expect="1" title="余数"
console.log(21 % 10);
```

输出里能看到 `1`。

### 数字相加

两边都是数字时，`+` 是加法。

```js run expect="21" title="相加"
console.log(20 + 1);
```

输出里能看到 `21`。

### 一边是字符串

数字会先变成文本，再接在后面。

```js run expect="房号18" title="拼接"
console.log("房号" + 18);
```

输出里能看到 `房号18`。
