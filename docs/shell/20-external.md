---
language: shell
chapter: 20
title: "Shell 外部命令"
level: beginner
minutes: 8
goals:
  - "知道 cd 不可用"
  - "知道命令替换不可用"
  - "只用内建完成输出"
sources:
  - wasi-sh
updated: "2026-10-15"
---

找不到的名字以 127 结束，并说明没有 fork。下面这些写法只作阅读。

### cd 不运行

没有切换目录这件内建。

```sh norun title="不能换目录"
cd /tmp
pwd
```

### 命令替换不运行

反引号和 `$()` 都不会去启动另一个程序。

```sh norun title="没有命令替换"
item=$(echo tea)
printf '%s\n' "$item"
```

### 内建就够

需要的一行由 `printf` 自己打出。

```sh run expect="tea" title="内建输出"
printf '%s\n' tea
```

输出里能看到 `tea`。

### 冒号也是内建

`:` 成功，并且不打出文字。后面的行才出现。

```sh run expect="ready" title="准备好了"
:
printf '%s\n' ready
```

输出里能看到 `ready`。
