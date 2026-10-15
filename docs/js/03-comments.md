---
language: js
chapter: 3
title: "JavaScript 注释"
level: beginner
minutes: 8
goals:
  - "用双斜杠写行注释"
  - "用块注释跨行"
  - "知道注释里的代码不会运行"
sources:
  - lxiy-js
updated: "2026-10-15"
---

注释给读者看，引擎会跳过。

### 行注释

`//` 后面直到行尾都不执行。

```js run expect="可见" title="留下可见"
console.log("可见"); // 不打印隐藏
```

输出里能看到 `可见`。

### 块注释

`/* */` 可以跨过一行。

```js run expect="留下" title="整段跳过"
/* console.log("隐藏"); */
console.log("留下");
```

输出里能看到 `留下`。

### 注释不是字符串

写在注释里的字不会成为值。要输出，就把它放进引号。

```js run expect="茶" title="引号里的才算"
const word = "茶"; // 这是说明
console.log(word);
```

输出里能看到 `茶`。
