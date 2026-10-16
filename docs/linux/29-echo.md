---
language: linux
chapter: 29
title: "Linux echo 命令"
level: advanced
minutes: 6
goals:
  - "把参数打出来并换行"
  - "用 -n 不换行"
  - "把它和 wasi-sh 的内建 echo 分开"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

这里的 echo 是 /bin/echo，由 BusyBox 提供。Shell 书里的 echo 是 wasi-sh 内建，两边的说明不要混用。

### echo 把参数打出来并换行

参数之间加一个空格，末尾换行。词和数字可以放在同一次调用里。

```linux run expect="tea 18" title="空格分开"
echo tea 18
```

### -n 不换行

下一次 echo 会接在同一行。tea 和 leaf 因此贴在一起，中间没有换行符。

```linux run expect="tealeaf" title="贴在一行"
echo -n tea; echo leaf
```

### 这是 /bin/echo，和 Shell 书里的内建不是同一个程序

which 风格的查找可以用 ls 看文件名。wasi-sh 没有 /bin。这边有。

```linux run expect="echo" title="二进制在 /bin"
ls --color=never -1 /bin/echo
```
