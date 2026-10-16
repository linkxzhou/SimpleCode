---
language: js
chapter: 10
title: "JavaScript switch 语句"
level: beginner
minutes: 8
goals:
  - "按离散取值分支"
  - "用 break 避免掉进下一支"
  - "用 default 接其余情况"
sources:
  - lxiy-js
updated: "2026-10-15"
---

`switch` 用 `===` 比较。没有 `break` 时会继续执行下一支。

### 命中一支

`break` 让它停在这一支。

```js run expect="three" title="第三天"
const day = 3;
switch (day) {
  case 1:
    console.log("one");
    break;
  case 3:
    console.log("three");
    break;
  default:
    console.log("other");
}
```

输出里能看到 `three`。

### default

没有匹配的 case 时走 `default`。

```js run expect="other" title="其余"
switch (9) {
  case 1:
    console.log("one");
    break;
  default:
    console.log("other");
}
```

输出里能看到 `other`。

### 多值可以故意不写 break

两支要做同一件事时，可以让上一支落下来。这里两支都打印同一句，所以只保留最后的打印。

```js run expect="earlier" title="合并"
const n = 1;
switch (n) {
  case 1:
  case 2:
    console.log("earlier");
    break;
  default:
    console.log("other");
}
```

输出里能看到 `earlier`。
