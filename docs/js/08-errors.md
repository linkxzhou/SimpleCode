---
language: js
chapter: 8
title: "错误处理"
level: intermediate
minutes: 12
goals:
  - "用 try / catch 接住 throw"
  - "区分错误类型"
  - "解析可能损坏的 JSON"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-15"
---

`throw` 可以抛任何值，习惯抛 `Error` 或其子类，这样有消息和堆栈。`catch` 接住后程序继续。不要空 catch。

JSON 损坏是可预期的失败，适合就地告诉调用者。

```js run expect="1" title="解析 JSON"
function parse(text) {
  try {
    return JSON.parse(text).n;
  } catch (err) {
    return "坏 JSON";
  }
}
console.log(parse('{"n":1}'));
console.log(parse("nope"));
```

```js run expect="空" title="自定义错误"
class EmptyInput extends Error {}
function need(text) {
  if (text.trim() === "") throw new EmptyInput("空白");
  return text;
}
try {
  need("  ");
} catch (err) {
  console.log(err instanceof EmptyInput ? "空" : "其他");
}
```

```js run expect="5" title="先检查再算"
function divide(a, b) {
  if (b === 0) throw new Error("zero");
  return a / b;
}
console.log(divide(10, 2));
```

## 练习

catch 住一次 throw，打印「接住了」。

::: answer 参考答案
```js run expect="接住了" title="参考答案"
try {
  throw new Error("x");
} catch (err) {
  console.log("接住了");
}
```
:::

## 常见错误

- catch 之后不记录就继续。失败原因会消失。
- 用字符串 throw。instanceof Error 会失败。

## 延伸阅读

- [javascript.info](https://javascript.info/)（CC BY-NC-SA，仅链接）
- [Eloquent JavaScript](https://eloquentjavascript.net/)（CC BY-NC，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 MDN JavaScript Guide（CC BY-SA 2.5）和 Learn X in Y minutes — JavaScript（CC BY-SA 3.0）。TypeScript 章节的概念范围参考 TypeScript Handbook（CC BY 4.0）。没有逐字搬用这些文档。
