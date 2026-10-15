---
language: js
chapter: 20
title: "JavaScript JSON"
level: beginner
minutes: 8
goals:
  - "把文本解析成对象"
  - "把对象序列化成文本"
  - "接住损坏的文本"
sources:
  - lxiy-js
updated: "2026-10-15"
---

`JSON.parse` 和 `JSON.stringify` 在文本和值之间转换。

### 解析

JSON 的键必须是双引号。

```js run expect="3" title="读出数字"
console.log(JSON.parse('{"n":3}').n);
```

输出里能看到 `3`。

### 序列化再读回

`stringify` 得到文本，再 `parse` 可以取回同一个数字。

```js run expect="3" title="写后再读"
const text = JSON.stringify({ n: 3 });
console.log(JSON.parse(text).n);
```

输出里能看到 `3`。

### 损坏的文本

少一个括号时 `parse` 会抛错。用 `try` 接住。

```js run expect="坏了" title="解析失败"
try {
  JSON.parse("{");
  console.log("过了");
} catch (err) {
  console.log("坏了");
}
```

输出里能看到 `坏了`。
