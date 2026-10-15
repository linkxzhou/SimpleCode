---
language: js
chapter: 2
title: "JavaScript 语句"
level: beginner
minutes: 8
goals:
  - "一行写一条语句"
  - "用花括号包住一块"
  - "知道表达式也可以单独成句"
sources:
  - lxiy-js
updated: "2026-10-15"
---

语句按书写顺序执行。花括号把若干语句收成一块。

### 顺序执行

先赋值，再打印。

```js run expect="5" title="加一"
let n = 4;
n = n + 1;
console.log(n);
```

输出里能看到 `5`。

### 块

块里声明的 `let` 出了块就不能再用。这里只在块里打印。

```js run expect="杭州" title="块内"
{
  let city = "杭州";
  console.log(city);
}
```

输出里能看到 `杭州`。

### 空语句没有输出

单独一个分号什么也不做。真正的结果来自后面的 `console.log`。

```js run expect="有" title="跳过空语句"
;
console.log("有");
```

输出里能看到 `有`。
