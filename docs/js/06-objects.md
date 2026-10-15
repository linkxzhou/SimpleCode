---
language: js
chapter: 6
title: "对象与解构"
level: intermediate
minutes: 12
goals:
  - "用展开合并对象"
  - "用可选链读取可能缺失的字段"
  - "用 JSON 编解码"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-15"
---

对象是键值集合。展开 `{ ...a, ...b }` 后者覆盖前者的同名键。可选链 `?.` 在左边是 null 或 undefined 时短路。

`JSON.stringify` 只保留可序列化的数据，函数和 `undefined` 会被丢掉。

```js run expect="light 14" title="合并配置"
const base = { theme: "light", size: 12 };
const extra = { size: 14 };
const cfg = { ...base, ...extra };
console.log(cfg.theme, cfg.size);
```

```js run expect="未知" title="可选链与 JSON"
const user = { name: "Ada" };
console.log(user.city?.name ?? "未知");
console.log(JSON.stringify({ name: user.name, n: 1 }));
```

```js run expect="3" title="解构"
const { a, b = 2 } = { a: 1 };
console.log(a + b);
```

## 练习

把 JSON 文本 `{"n":41}` 解析后加 1。

::: answer 参考答案
```js run expect="42" title="参考答案"
const data = JSON.parse('{"n":41}');
console.log(data.n + 1);
```
:::

## 常见错误

- 用展开做深拷贝。嵌套对象仍然是同一份。
- JSON.parse 用户输入却不 try。坏文本会抛 SyntaxError。

## 延伸阅读

- [javascript.info](https://javascript.info/)（CC BY-NC-SA，仅链接）
- [Eloquent JavaScript](https://eloquentjavascript.net/)（CC BY-NC，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 MDN JavaScript Guide（CC BY-SA 2.5）和 Learn X in Y minutes — JavaScript（CC BY-SA 3.0）。TypeScript 章节的概念范围参考 TypeScript Handbook（CC BY 4.0）。没有逐字搬用这些文档。
