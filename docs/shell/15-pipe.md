---
language: shell
chapter: 15
title: "Shell 管道"
level: beginner
minutes: 8
goals:
  - "把左边的输出交给右边"
  - "知道左边先全部跑完"
  - "只用内建命令接管道"
sources:
  - wasi-sh
updated: "2026-10-15"
---

管道是一块内存。左边写完，右边才开始读。没有第二个进程。

### 交给 cat

`echo` 的一行经过管道，仍由 `cat` 打出来。

```sh run expect="tea" title="管道之后"
echo tea | cat
```

输出里能看到 `tea`。

### 接两次

两段 `cat` 都只是把同一块缓冲抄出去。

```sh run expect="pen" title="仍是笔"
printf '%s\n' pen | cat | cat
```

输出里能看到 `pen`。

### 读进变量

右边的 `read` 和后面的命令在同一个进程，变量还在。

```sh run expect="key" title="留在变量里"
printf '%s\n' key | read item
printf '%s\n' "$item"
```

输出里能看到 `key`。
