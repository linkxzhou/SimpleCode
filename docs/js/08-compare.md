---
language: js
chapter: 8
title: "JavaScript 比较"
level: beginner
minutes: 8
goals:
  - "区分 == 和 ==="
  - "看出空串和 0 在宽松相等时为真"
  - "优先使用 ==="
sources:
  - lxiy-js
updated: "2026-10-15"
---

`==` 会先转换类型。`===` 类型不同就不相等。

### 宽松相等

空串和数字 0 在 `==` 下被当成相等。

```js run expect="true" title="会转换"
console.log("" == 0);
```

输出里能看到 `true`。

### 严格相等

同样两个值，`===` 要求类型也一样。

```js run expect="false" title="不转换"
console.log("" === 0);
```

输出里能看到 `false`。

### 大小比较

数字可以直接比大小。

```js run expect="true" title="大于"
console.log(3 > 1);
```

输出里能看到 `true`。
