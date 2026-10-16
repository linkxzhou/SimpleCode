---
language: js
chapter: 5
title: "JavaScript 数据类型"
level: beginner
minutes: 8
goals:
  - "用 typeof 辨认类型"
  - "区分 null 和 undefined"
  - "知道 typeof null 是 object"
sources:
  - lxiy-js
updated: "2026-10-15"
---

值有类型，但变量不固定类型。`typeof` 返回一个字符串。

### typeof

数字、字符串和布尔各有自己的名字。

```js run expect="number string boolean" title="三种"
console.log(typeof 3, typeof "tea", typeof true);
```

输出里能看到 `number string boolean`。

### null 和 undefined

两者都表示缺，但不相等。`undefined` 是还没给，`null` 是明确的空。

```js run expect="false" title="不相等"
console.log(null === undefined);
```

输出里能看到 `false`。

### typeof null

历史原因，`typeof null` 得到 `object`。要判断空，用 `=== null`。

```js run expect="object" title="历史结果"
console.log(typeof null);
```

输出里能看到 `object`。
