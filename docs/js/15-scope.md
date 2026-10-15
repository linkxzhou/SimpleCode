---
language: js
chapter: 15
title: "JavaScript 作用域"
level: beginner
minutes: 8
goals:
  - "区分函数内的名字"
  - "用闭包记住外层变量"
  - "知道块级 let 出了块就消失"
sources:
  - lxiy-js
updated: "2026-10-15"
---

函数可以读到它定义时所在的变量。内层的 `let` 不会跑到外面。

### 函数内的名字

参数只在函数里。

```js run expect="林" title="参数"
function greet(name) {
  return name;
}
console.log(greet("林"));
```

输出里能看到 `林`。

### 闭包记住计数

返回的函数仍能改外层的 `n`。

```js run expect="1 2" title="两次"
function counter() {
  let n = 0;
  return function () {
    n += 1;
    return n;
  };
}
const next = counter();
console.log(next(), next());
```

输出里能看到 `1 2`。

### 块里的 let

块结束后，外面的同名名字不受影响。

```js run expect="苏州" title="内层"
let city = "杭州";
{
  let city = "苏州";
  console.log(city);
}
```

输出里能看到 `苏州`。
