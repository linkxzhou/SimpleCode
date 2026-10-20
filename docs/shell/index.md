---
language: shell
chapter: 0
title: "Shell 教程"
minutes: 8
goals:
  - "用 printf 打出一行"
  - "知道这里只有内建命令"
  - "不写函数、数组和算术展开"
sources:
  - wasi-sh
updated: "2026-10-15"
---

这一本是 wasi-sh。它在同一个进程里执行内建命令，没有外部程序，也没有子壳。

### 第一行

`printf` 的格式串决定换行。`%s` 原样打出后面的词。

```sh run expect="Hi" title="打招呼"
printf '%s\n' Hi
```

输出里能看到 `Hi`。

### echo 也会换行

`echo` 在末尾加换行，参数之间加空格。

```sh run expect="tea 18" title="空格分开"
echo tea 18
```

输出里能看到 `tea 18`。

### 外部命令不运行

`ls` 不是内建。调用它会以 127 结束。

```sh norun title="没有 ls"
ls
```

### 第 21 章以后

${sku} 会展开，${sku:-mug} 不会。case、here-doc、getopts、trap、命令替换和算术展开都不是这只壳的语法，对应的可运行写法是 if、重复的 %s、for 认 -n、$?、管道和一串 x 记号。
