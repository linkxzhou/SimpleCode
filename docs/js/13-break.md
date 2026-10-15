---
language: js
chapter: 13
title: "JavaScript break 和 continue"
level: beginner
minutes: 8
goals:
  - "用 break 离开循环"
  - "用 continue 跳过一轮"
  - "知道它们只作用于最近的一层"
sources:
  - lxiy-js
updated: "2026-10-15"
---

`break` 结束整层循环。`continue` 进入下一轮。

### break

数到 3 就停。

```js run expect="3" title="停在 3"
let n = 0;
for (;;) {
  n += 1;
  if (n === 3) break;
}
console.log(n);
```

输出里能看到 `3`。

### continue

偶数不加进总和。1 和 3 相加是 4。

```js run expect="4" title="跳过偶数"
let sum = 0;
for (let i = 1; i <= 4; i++) {
  if (i % 2 === 0) continue;
  sum += i;
}
console.log(sum);
```

输出里能看到 `4`。

### 一层循环

这里只有一层，`break` 离开的就是这层 `for`。

```js run expect="2" title="停在 2"
let seen = 0;
for (let i = 0; i < 5; i++) {
  seen = i;
  if (i === 2) break;
}
console.log(seen);
```

输出里能看到 `2`。
