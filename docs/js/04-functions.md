---
language: js
chapter: 4
title: "函数"
level: beginner
minutes: 12
goals:
  - "写函数声明和箭头函数"
  - "使用默认参数"
  - "用闭包做计数器"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-15"
---

函数声明会被提升，箭头函数不会。箭头函数没有自己的 `arguments`。默认参数在调用时、且调用者没传该参数时才求值。

闭包让内部函数记住外部的 `let`。

```js run expect="42" title="两种函数"
function add(a, b = 1) {
  return a + b;
}
const mul = (a, b) => a * b;
console.log(add(41));
console.log(mul(6, 7));
```

```js run expect="1" title="计数器"
function counter() {
  let n = 0;
  return () => {
    n += 1;
    return n;
  };
}
const next = counter();
console.log(next());
console.log(next());
```

```js run expect="21" title="记忆化"
function memo(fn) {
  const saved = new Map();
  return (n) => {
    if (!saved.has(n)) saved.set(n, fn(n));
    return saved.get(n);
  };
}
const fib = memo((n) => (n < 2 ? n : fib(n - 1) + fib(n - 2)));
console.log(fib(8));
```

## 练习

写一个箭头函数，把数字乘 2，打印 21 的结果。

::: answer 参考答案
```js run expect="42" title="参考答案"
const twice = (n) => n * 2;
console.log(twice(21));
```
:::

## 常见错误

- 在箭头函数里用 arguments。改用剩余参数 ...args。
- 递归的 const fib = (n) => fib(...) 在记忆化包装之前调用自身。上面先写成依赖外部名字的形式。

## 延伸阅读

- [javascript.info](https://javascript.info/)（CC BY-NC-SA，仅链接）
- [Eloquent JavaScript](https://eloquentjavascript.net/)（CC BY-NC，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 MDN JavaScript Guide（CC BY-SA 2.5）和 Learn X in Y minutes — JavaScript（CC BY-SA 3.0）。TypeScript 章节的概念范围参考 TypeScript Handbook（CC BY 4.0）。没有逐字搬用这些文档。
