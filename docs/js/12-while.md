---
language: js
chapter: 12
title: "JavaScript while 循环"
level: beginner
minutes: 8
goals:
  - "用 while 重复到条件变假"
  - "用 do while 至少做一次"
  - "保证条件会变化"
sources:
  - lxiy-js
updated: "2026-10-15"
---

`while` 先看条件。条件不变又没有 `break` 时，程序不会返回。

### 先判断

条件一开始就为假，块一次也不执行。

```js run expect="0" title="不进入"
let n = 0;
while (n > 0) {
  n -= 1;
}
console.log(n);
```

输出里能看到 `0`。

### 减到零

块里改变条件用到的变量。

```js run expect="0" title="倒计"
let left = 2;
while (left > 0) {
  left -= 1;
}
console.log(left);
```

输出里能看到 `0`。

### do 至少一次

条件放在块的后面，所以块会先走一遍。

```js run expect="1" title="先做一次"
let n = 0;
do {
  n += 1;
} while (n < 1);
console.log(n);
```

输出里能看到 `1`。
