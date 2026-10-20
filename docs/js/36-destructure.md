---
language: js
chapter: 36
title: "JavaScript 解构与展开"
level: intermediate
minutes: 10
goals:
  - "从数组里取出头和剩余"
  - "从对象里取字段并给默认值"
  - "用展开拼出新数组"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-20"
---

解构是在赋值的左边按形状取内容。展开是在右边把一份已有的列表摊进新列表。两边都不改你没有写到的那一份，除非你后来又去改它。

### 头一个数和剩下的长度

first 拿到 4，rest 拿到后面的两项。4 加 rest 的长度 2，得到 6。

```js run expect="6" title="头和剩余"
const [first, ...rest] = [4, 5, 6];
console.log(first + rest.length);
```

和是 6。

### 缺了毫升就用 1

对象里只有 name。解构时给 ml 默认值 1，于是名字和毫升拼成 tea1。

```js run expect="tea1" title="默认毫升"
const { name, ml = 1 } = { name: "tea" };
console.log(name + ml);
```

拼出来是 tea1。

### 展开进一个新数组

left 是 1 和 2。新数组在中间插入 9，再摊开 left。下标 1 是 9，说明原来的 1 还在最前面。

```js run expect="9" title="插入 9"
const left = [1, 2];
const merged = [left[0], 9, ...left.slice(1)];
console.log(merged[1]);
```

中间这一位是 9。

### 练习：交换两个名字

用解构一次交换 tea 和 bun。交换后的第一个名字应是 bun。

```js run expect="bun" title="交换"
let left = "tea";
let right = "bun";
[left, right] = [right, left];
console.log(left);
```

左边变成 bun。

### You Don't Know JS 的类型章

展开和解构在 You Don't Know JS 里有专章，那套书是 NC-ND，只链接：<https://github.com/getify/You-Dont-Know-JS> 。
