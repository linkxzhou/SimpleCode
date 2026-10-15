---
language: shell
chapter: 19
title: "Shell 注释"
level: beginner
minutes: 8
goals:
  - "用 # 跳过一行"
  - "知道注释不会打出来"
  - "用分号把两条命令写在一行"
sources:
  - wasi-sh
updated: "2026-10-15"
---

`#` 一直管到行尾。它不是引号，也不是命令。

### 行注释

注释里的 `printf` 不会执行。

```sh run expect="留下" title="跳过注释"
# printf '%s\n' 隐藏
printf '%s\n' 留下
```

输出里能看到 `留下`。

### 分号

分号把两条输出隔开，仍按顺序打出。

```sh run expect="甲" title="第一段"
printf '%s\n' 甲; printf '%s\n' 乙
```

输出里能看到 `甲`。

### 空命令

冒号是成功的空命令，适合占住一个分支。

```sh run expect="之后" title="空命令之后"
:
printf '%s\n' 之后
```

输出里能看到 `之后`。
