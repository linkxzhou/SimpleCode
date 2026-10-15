---
language: js
chapter: 14
title: "JavaScript 函数"
level: beginner
minutes: 8
goals:
  - "用 function 声明函数"
  - "写出箭头函数"
  - "给参数默认值"
sources:
  - lxiy-js
updated: "2026-10-15"
---

函数把一段计算收成名字。箭头函数适合一行能写完的情况。

### 函数声明

参数按位置传入。

```js run expect="5" title="相加"
function add(a, b) {
  return a + b;
}
console.log(add(2, 3));
```

输出里能看到 `5`。

### 箭头函数

单行表达式不用写 `return`。

```js run expect="5" title="箭头"
const add = (a, b) => a + b;
console.log(add(4, 1));
```

输出里能看到 `5`。

### 默认参数

调用时省略的参数使用默认值。

```js run expect="你好，客人" title="省略"
function greet(name = "客人") {
  return "你好，" + name;
}
console.log(greet());
```

输出里能看到 `你好，客人`。
