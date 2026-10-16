---
language: shell
chapter: 5
title: "Shell printf 命令"
level: beginner
minutes: 8
goals:
  - "用 %s 打出字符串"
  - "用 %d 打出整数"
  - "用 \n 换行"
sources:
  - wasi-sh
updated: "2026-10-15"
---

`printf` 先看格式串，再取后面的参数。格式串用单引号，避免壳去解释反斜杠。

### 字符串

`%s` 把下一个词原样放进去。

```sh run expect="pen" title="一个词"
printf '%s\n' pen
```

输出里能看到 `pen`。

### 整数

`%d` 把数字按十进制打出。

```sh run expect="18" title="十进制"
printf '%d\n' 18
```

输出里能看到 `18`。

### 百分号

`%%` 打出一个百分号。

```sh run expect="100%" title="一个百分号"
printf '100%%\n'
```

输出里能看到 `100%`。
