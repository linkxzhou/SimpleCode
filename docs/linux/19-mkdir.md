---
language: linux
chapter: 19
title: "Linux mkdir 命令"
level: intermediate
minutes: 6
goals:
  - "创建一个目录"
  - "用 -p 补上父目录"
  - "知道已存在时会失败"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

mkdir 在目录树上加一个结点。父目录不在时，不加 -p 就会失败。

### 创建一个目录

目标放在 /tmp，免得和根上的系统目录撞名。创建成功时命令本身没有输出，用 ls 看结果。

```linux run expect="only" title="看见新目录"
mkdir /tmp/only && ls --color=never -1 /tmp/only/..
```

### -p 连同缺少的父目录一起建

/tmp/a 事先并不存在。-p 会把 a 和 b 一起建出来，ls 父目录时应能看到 b。

```linux run expect="b" title="父目录一并出现"
mkdir -p /tmp/a/b && ls --color=never -1 /tmp/a
```

### 已存在时命令失败

再 mkdir 同一个名字会非零退出。用 || 接一句固定文本，整段脚本仍以 0 结束，期望才能稳定。

```linux run expect="exists" title="重复创建"
mkdir /tmp/only && mkdir /tmp/only || echo exists
```
