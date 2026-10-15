---
language: js
chapter: 18
title: "JavaScript 数组"
level: beginner
minutes: 8
goals:
  - "用 push 增加元素"
  - "用 map 得到新数组"
  - "用 filter 留下一部分"
sources:
  - lxiy-js
updated: "2026-10-15"
---

数组有序，下标从 0 开始。`map` 和 `filter` 不改原来的数组。

### push

`push` 改原数组，并返回新的长度。

```js run expect="2" title="新长度"
const nums = [1];
console.log(nums.push(2));
```

输出里能看到 `2`。

### map

`map` 给出新数组。用 `join` 打印，避免各家引擎的格式不一样。

```js run expect="2,4,6" title="加倍"
const nums = [1, 2, 3];
console.log(nums.map((n) => n * 2).join(","));
```

输出里能看到 `2,4,6`。

### filter

只留下偶数。

```js run expect="2,4" title="偶数"
console.log([1, 2, 3, 4].filter((n) => n % 2 === 0).join(","));
```

输出里能看到 `2,4`。
