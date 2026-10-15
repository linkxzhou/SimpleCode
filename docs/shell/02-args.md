---
language: shell
chapter: 2
title: "Shell 传递参数"
level: beginner
minutes: 8
goals:
  - "知道按钮不附加参数"
  - "用 $# 看个数"
  - "用 $1 看第一个参数"
sources:
  - wasi-sh
updated: "2026-10-15"
---

运行按钮只把脚本交给壳，不再附加参数。`$#` 因此是 0，`$1` 是空的。

### 个数

`$#` 是附加参数的个数，这里是 0。

```sh run expect="0" title="没有附加参数"
printf '%s\n' $#
```

输出里能看到 `0`。

### 第一个是空的

`$1` 没有内容，所以两边的字母挨在一起。

```sh run expect="xy" title="空参数"
printf '%s\n' "x${1}y"
```

输出里能看到 `xy`。

### 脚本名不是空的

`$0` 是这次脚本的路径。只要它非空，就打出「有」。

```sh run expect="有" title="有脚本名"
if [ -n "$0" ]; then
  printf '%s\n' 有
fi
```

输出里能看到 `有`。
