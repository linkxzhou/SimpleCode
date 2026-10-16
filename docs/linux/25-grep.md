---
language: linux
chapter: 25
title: "Linux grep 命令"
level: advanced
minutes: 7
goals:
  - "打印匹配的行"
  - "用 -n 带行号"
  - "不匹配时用固定文本收尾"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

grep 把匹配的行打到标准输出。图案先用这颗镜像上试过的编码。不匹配时退出码是 1。

### 打印匹配的行

printf 造出两行，grep 只留下含 second 的那一行。

```linux run expect="second" title="留下乙"
printf 'first\nsecond\n' | grep second
```

### -n 带行号

行号和正文之间是冒号。第二行匹配时，输出以 2: 开头。

```linux run expect="2:b" title="行号"
printf 'a\nb\n' | grep -n b
```

### 不匹配时退出码为 1

直接让脚本以 1 结束，文档冒烟会把它当成失败。用 || 打出 none，进程仍以 0 结束，期望锁定这句。

```linux run expect="none" title="没有匹配"
grep nope /etc/hostname || echo none
```
