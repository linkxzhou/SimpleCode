---
language: js
chapter: 4
title: "JavaScript 变量"
level: beginner
minutes: 8
goals:
  - "用 let 声明可以再赋值的名字"
  - "知道未赋值时是 undefined"
  - "一次声明不要留下没用的名字"
sources:
  - lxiy-js
updated: "2026-10-15"
---

`let` 声明的名字可以改。用到之前要先赋值。

### 声明再赋值

先给出名字，下一行再放值。

```js run expect="tea" title="赋值"
let item;
item = "tea";
console.log(item);
```

输出里能看到 `tea`。

### 未赋值

只有声明、没有赋值时，读出来是 `undefined`。

```js run expect="undefined" title="还没有值"
let item;
console.log(item);
```

输出里能看到 `undefined`。

### 可以改

同一个 `let` 名字可以指向新的值。

```js run expect="2" title="改成 2"
let n = 1;
n = 2;
console.log(n);
```

输出里能看到 `2`。
