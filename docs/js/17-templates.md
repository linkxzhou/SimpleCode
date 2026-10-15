---
language: js
chapter: 17
title: "JavaScript 字符串模板"
level: beginner
minutes: 8
goals:
  - "用反引号插入变量"
  - "在模板里做运算"
  - "保留换行时知道输出有两行"
sources:
  - lxiy-js
updated: "2026-10-15"
---

反引号字符串可以嵌入 `${}`。普通引号不会做这件事。

### 插入名字

花括号里是表达式，结果会变成文本。

```js run expect="你好，林" title="插入"
const name = "林";
console.log(`你好，${name}`);
```

输出里能看到 `你好，林`。

### 嵌入运算

花括号里可以写加法。

```js run expect="合计5" title="运算"
console.log(`合计${2 + 3}`);
```

输出里能看到 `合计5`。

### 普通引号不插入

双引号里的 `${name}` 就是这几个字符，不会换成变量。

```js run expect="false" title="不是模板"
const name = "林";
console.log("${name}" === name);
```

输出里能看到 `false`。
