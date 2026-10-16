---
language: js
chapter: 11
title: "JavaScript for 循环"
level: beginner
minutes: 8
goals:
  - "用三段式 for 累加"
  - "用 for...of 遍历数组"
  - "不要在遍历时依赖不存在的下标"
sources:
  - lxiy-js
updated: "2026-10-15"
---

`for` 可以计数，也可以直接走数组的元素。

### 三段式

初始化、条件和后置用分号隔开。`range` 这种名字不是内建。

```js run expect="6" title="加到 3"
let sum = 0;
for (let i = 1; i <= 3; i++) {
  sum += i;
}
console.log(sum);
```

输出里能看到 `6`。

### for of

循环变量是元素本身，不是下标。

```js run expect="tea" title="最后一项"
const items = ["water", "tea"];
let last = "";
for (const name of items) {
  last = name;
}
console.log(last);
```

输出里能看到 `tea`。

### 下标仍可用普通 for

需要位置时，用长度和方括号。

```js run expect="tea" title="下标 1"
const items = ["water", "tea"];
console.log(items[1]);
```

输出里能看到 `tea`。
