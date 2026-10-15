---
language: js
chapter: 1
title: "值与变量"
level: beginner
minutes: 12
goals:
  - "用 let 和 const"
  - "用 typeof 辨认类型"
  - "交换两个绑定"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-15"
---

`let` 可以重新赋值，`const` 不能改绑定，但对象的内容仍可改。`typeof null` 是 `"object"`，这是历史遗留，判断空值请直接和 `null` 比较。

```js run expect="string" title="类型"
const name = "Ada";
let year = 2026;
year = year + 1;
console.log(typeof name);
console.log(year);
```

```js run expect="2 1" title="交换"
let a = 1;
let b = 2;
const t = a;
a = b;
b = t;
console.log(a, b);
```

```js run expect="object" title="typeof"
console.log(typeof null);
console.log(typeof 1);
console.log(typeof undefined);
```

## 练习

交换后打印第二个变量，确认它变成了 1。

::: answer 参考答案
```js run expect="1" title="参考答案"
let a = 1;
let b = 2;
[a, b] = [b, a];
console.log(b);
```
:::

## 常见错误

- 用 var 并依赖提升。新代码用 let 和 const，作用域更好懂。
- const 对象就以为字段也不能改。冻结的是绑定，不是对象内容。

## 延伸阅读

- [javascript.info](https://javascript.info/)（CC BY-NC-SA，仅链接）
- [Eloquent JavaScript](https://eloquentjavascript.net/)（CC BY-NC，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 MDN JavaScript Guide（CC BY-SA 2.5）和 Learn X in Y minutes — JavaScript（CC BY-SA 3.0）。TypeScript 章节的概念范围参考 TypeScript Handbook（CC BY 4.0）。没有逐字搬用这些文档。
