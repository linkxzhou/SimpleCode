---
language: js
chapter: 19
title: "JavaScript 对象"
level: beginner
minutes: 8
goals:
  - "用点号和方括号读字段"
  - "用展开合并对象"
  - "用可选链读可能没有的字段"
sources:
  - lxiy-js
updated: "2026-10-15"
---

对象用花括号。字段名是字符串。

### 读取字段

点号和方括号读到的是同一个值。

```js run expect="tea 18" title="两个字段"
const item = { name: "tea", price: 18 };
console.log(item.name, item["price"]);
```

输出里能看到 `tea 18`。

### 展开

后面的对象覆盖同名字段。

```js run expect="20" title="后者赢"
const item = { ...{ price: 18 }, ...{ price: 20 } };
console.log(item.price);
```

输出里能看到 `20`。

### 可选链

字段不存在时 `?.` 得到 `undefined`，不会因为中间是空而抛错。

```js run expect="undefined" title="没有店铺"
const item = {};
console.log(item.shop?.name);
```

输出里能看到 `undefined`。
