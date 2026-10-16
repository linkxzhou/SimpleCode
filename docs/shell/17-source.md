---
language: shell
chapter: 17
title: "Shell 文件包含"
level: beginner
minutes: 8
goals:
  - "知道 source 不是内建"
  - "把命令写在同一个文件"
  - "不依赖第二个脚本"
sources:
  - wasi-sh
updated: "2026-10-15"
---

`source` 和 `.` 都不会去读另一个文件。要执行的命令写在这一份里。

### source 不运行

没有 other.sh 可以包含。

```sh norun title="不能包含"
source other.sh
```

### 写在一起

两行 `printf` 就是这一份脚本的全部。

```sh run expect="first" title="第一行"
printf '%s\n' first
printf '%s\n' second
```

输出里能看到 `first`。

### 点命令也不用

单独一个点会去找外部命令。这里改用 `true` 占位。

```sh run expect="next" title="同一文件继续"
true
printf '%s\n' next
```

输出里能看到 `next`。
