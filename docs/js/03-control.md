---
language: js
chapter: 3
title: "控制流"
level: beginner
minutes: 12
goals:
  - "写 if 和 switch"
  - "用 for 与 for...of"
  - "打印九九乘法表的一行"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-15"
---

代码块用花括号。`for...of` 遍历值，`for...in` 遍历键，数组请用 of。`switch` 要用 `break`，否则会继续掉进下一支。

```js run expect="1 2 Fizz 4 Buzz Fizz 7" title="FizzBuzz"
const lines = [];
for (let n = 1; n <= 7; n++) {
  if (n % 15 === 0) lines.push("FizzBuzz");
  else if (n % 3 === 0) lines.push("Fizz");
  else if (n % 5 === 0) lines.push("Buzz");
  else lines.push(String(n));
}
console.log(lines.join(" "));
```

```js run expect="2x1=2 2x2=4 2x3=6" title="乘法表一行"
let row = "";
for (let i = 1; i <= 3; i++) row += "2x" + i + "=" + 2 * i + " ";
console.log(row.trim());
```

```js run expect="二" title="switch"
const n = 2;
switch (n) {
  case 1:
    console.log("一");
    break;
  case 2:
    console.log("二");
    break;
  default:
    console.log("其他");
}
```

## 练习

用 for...of 求 `[1, 2, 3]` 的和。

::: answer 参考答案
```js run expect="6" title="参考答案"
let s = 0;
for (const n of [1, 2, 3]) s += n;
console.log(s);
```
:::

## 常见错误

- case 后面忘记 break。
- for...in 遍历数组。它给出的是下标字符串，还可能带上额外的键。

## 延伸阅读

- [javascript.info](https://javascript.info/)（CC BY-NC-SA，仅链接）
- [Eloquent JavaScript](https://eloquentjavascript.net/)（CC BY-NC，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 MDN JavaScript Guide（CC BY-SA 2.5）和 Learn X in Y minutes — JavaScript（CC BY-SA 3.0）。TypeScript 章节的概念范围参考 TypeScript Handbook（CC BY 4.0）。没有逐字搬用这些文档。
