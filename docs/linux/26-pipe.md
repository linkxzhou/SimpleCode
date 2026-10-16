---
language: linux
chapter: 26
title: "Linux 管道"
level: advanced
minutes: 7
goals:
  - "把左边的标准输出接到右边"
  - "再接一条命令"
  - "区分这和 wasi-sh 的内建管道"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

管道在这台客户机上是两个 BusyBox 进程。Shell 那一本里的管道只发生在同一个 wasm 进程的内建之间。

### 左边的标准输出接到右边的标准输入

grep 只看到 printf 打出的行。匹配的那一行单独出现。

```linux run expect="b" title="管道里的 b"
printf 'a\nb\n' | grep b
```

### 中间可以再接一条命令

head 先截断，grep 再过滤。根目录的第一项是 bin，两级管道之后它还在。

```linux run expect="bin" title="截断后再过滤"
ls --color=never -1 / | head -n 3 | grep bin
```

### 这是两个 BusyBox 进程，不是 Shell 那本里的内建管道

ps 在脚本运行时能看到 sh。wasi-sh 做不到 fork 出第二个 ls。这边可以。

```linux run expect="sh" title="进程表里有 shell"
ps | grep sh
```
