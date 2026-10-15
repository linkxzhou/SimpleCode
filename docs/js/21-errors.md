---
language: js
chapter: 21
title: "JavaScript 错误"
level: beginner
minutes: 8
goals:
  - "用 try 接住 throw"
  - "读取错误消息"
  - "区分成功和失败的分支"
sources:
  - lxiy-js
updated: "2026-10-15"
---

`throw` 中断当前路径。`catch` 接到之后可以改打印一句说明。

### 接住

抛出的字符串可以直接打印。

```js run expect="缺货" title="接住文本"
try {
  throw "缺货";
} catch (err) {
  console.log(err);
}
```

输出里能看到 `缺货`。

### Error 的 message

抛出 `Error` 时，说明在 `message` 上。

```js run expect="缺货" title="消息"
try {
  throw new Error("缺货");
} catch (err) {
  console.log(err.message);
}
```

输出里能看到 `缺货`。

### 成功不进 catch

没有抛出时，`catch` 不会执行。

```js run expect="好" title="没有失败"
try {
  console.log("好");
} catch (err) {
  console.log("坏");
}
```

输出里能看到 `好`。
