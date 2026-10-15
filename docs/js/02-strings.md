---
language: js
chapter: 2
title: "运算与字符串"
level: beginner
minutes: 12
goals:
  - "区分 == 和 ==="
  - "拼接字符串"
  - "按单词反转"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-15"
---

`===` 不转换类型，`==` 会。`"6" + 7` 是拼接，`"6" * 7` 才变成数字运算。教学示例一律用 `===`。

模板字符串能插值，但为了少一层转义，示例用加号拼接，效果一样。

```js run expect="67" title="转换"
console.log("6" + 7);
console.log(Number("6") + 7);
console.log(1 === 1);
```

```js run expect="你好，Ada" title="拼接"
const name = "Ada";
console.log("你好，" + name);
```

```js run expect="two one" title="反转单词"
const words = "one two".split(" ");
console.log(words.reverse().join(" "));
```

## 练习

判断 `0 == "0"` 和 `0 === "0"`，各打印 true 或 false。

::: answer 参考答案
```js run expect="true" title="参考答案"
console.log(0 == "0");
console.log(0 === "0");
```
:::

## 常见错误

- 用 == 比较用户输入。类型一转换，空字符串和 0 会变成同一件事。
- reverse 会改原数组。要保留原顺序就先 slice。

## 延伸阅读

- [javascript.info](https://javascript.info/)（CC BY-NC-SA，仅链接）
- [Eloquent JavaScript](https://eloquentjavascript.net/)（CC BY-NC，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 MDN JavaScript Guide（CC BY-SA 2.5）和 Learn X in Y minutes — JavaScript（CC BY-SA 3.0）。TypeScript 章节的概念范围参考 TypeScript Handbook（CC BY 4.0）。没有逐字搬用这些文档。
