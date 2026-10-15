---
language: js
chapter: 5
title: "数组"
level: intermediate
minutes: 12
goals:
  - "用 map、filter、reduce"
  - "排序时提供比较函数"
  - "把一层嵌套摊平"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-15"
---

`map` 产生新数组，`filter` 留下通过测试的项，`reduce` 收成一个值。它们都不改原数组；`sort` 会改。

数字排序必须给比较函数，否则会按文本排，`10` 会排在 `2` 前面。

```js run expect="85" title="及格平均"
const scores = [40, 80, 90];
const passed = scores.filter((n) => n >= 60);
const avg = passed.reduce((s, n) => s + n, 0) / passed.length;
console.log(avg);
```

```js run expect="1,2,10" title="数字排序"
const nums = [10, 2, 1];
console.log(nums.slice().sort((a, b) => a - b).join(","));
```

```js run expect="1,2,3" title="摊平一层"
const nested = [[1], [2, 3]];
const flat = [];
for (const row of nested) flat.push(...row);
console.log(flat.join(","));
```

## 练习

map 出平方，打印 `1,4,9`。

::: answer 参考答案
```js run expect="1,4,9" title="参考答案"
console.log([1, 2, 3].map((n) => n * n).join(","));
```
:::

## 常见错误

- sort() 不带比较函数就排序数字。
- reduce 忘记初始值，空数组会抛错。

## 延伸阅读

- [javascript.info](https://javascript.info/)（CC BY-NC-SA，仅链接）
- [Eloquent JavaScript](https://eloquentjavascript.net/)（CC BY-NC，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 MDN JavaScript Guide（CC BY-SA 2.5）和 Learn X in Y minutes — JavaScript（CC BY-SA 3.0）。TypeScript 章节的概念范围参考 TypeScript Handbook（CC BY 4.0）。没有逐字搬用这些文档。
