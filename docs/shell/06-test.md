---
language: shell
chapter: 6
title: "Shell test 命令"
level: beginner
minutes: 8
goals:
  - "用 = 比较字符串"
  - "用 -z 看空字符串"
  - "用 -eq 比较整数"
sources:
  - wasi-sh
updated: "2026-10-15"
---

`test` 和 `[` 不打出文字，只用退出码表示成立与否。成立是 0。

### 字符串相等

两边都是 key 时，条件成立。

```sh run expect="yes" title="相等"
item=key
if [ "$item" = key ]; then
  printf '%s\n' yes
fi
```

输出里能看到 `yes`。

### 空字符串

`-z` 在值为空时成立。

```sh run expect="empty" title="是空的"
name=
if [ -z "$name" ]; then
  printf '%s\n' empty
fi
```

输出里能看到 `empty`。

### 整数

`-gt` 比较的是整数，不是字典序。

```sh run expect="big" title="3 比 2 大"
if [ 3 -gt 2 ]; then
  printf '%s\n' big
fi
```

输出里能看到 `big`。
