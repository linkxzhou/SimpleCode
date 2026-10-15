---
language: shell
chapter: 12
title: "Shell 运算符"
level: beginner
minutes: 8
goals:
  - "用 test 比较整数"
  - "用 -eq 表示相等"
  - "不写算术展开"
sources:
  - wasi-sh
updated: "2026-10-15"
---

这只壳没有 `$((...))`。整数关系放进 `test`。

### 相等

`-eq` 成立时打出「相等」。

```sh run expect="相等" title="两个 18"
if [ 18 -eq 18 ]; then
  printf '%s\n' 相等
fi
```

输出里能看到 `相等`。

### 不等

`-ne` 在两边不同时成立。

```sh run expect="不同" title="单价和数量"
if [ 18 -ne 3 ]; then
  printf '%s\n' 不同
fi
```

输出里能看到 `不同`。

### 加法不运行

想把 1 和 2 加起来，不能写 `$((1+2))`。

```sh norun title="没有加法"
printf '%s\n' $((1+2))
```
