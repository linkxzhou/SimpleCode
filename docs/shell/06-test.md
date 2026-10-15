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

两边都是钥匙时，条件成立。

```sh run expect="是" title="相等"
item=钥匙
if [ "$item" = 钥匙 ]; then
  printf '%s\n' 是
fi
```

输出里能看到 `是`。

### 空字符串

`-z` 在值为空时成立。

```sh run expect="空" title="是空的"
name=
if [ -z "$name" ]; then
  printf '%s\n' 空
fi
```

输出里能看到 `空`。

### 整数

`-gt` 比较的是整数，不是字典序。

```sh run expect="大" title="3 比 2 大"
if [ 3 -gt 2 ]; then
  printf '%s\n' 大
fi
```

输出里能看到 `大`。
