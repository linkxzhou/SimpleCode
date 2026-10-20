---
language: linux
chapter: 30
title: "Linux find"
level: intermediate
minutes: 8
goals:
  - "按文件名找到 note.txt"
  - "只列出目录"
  - "目标不存在时打印 none"
sources:
  - v86-buildroot
updated: "2026-10-20"
---

find 从给出的目录往下走。文件放在 /tmp，避免碰到系统目录。名字用 -name，目录用 -type d。

### 按名字找到 note.txt

先在 /tmp/nest/inner 写下 note.txt。find -name 打出完整路径，期望锁定这条路径。

```linux run expect="/tmp/nest/inner/note.txt" title="找到笔记"
mkdir -p /tmp/nest/inner
printf 'tea\n' > /tmp/nest/inner/note.txt
find /tmp/nest -name note.txt
```

### 只看见目录 inner

再查一次 -type d。输出里有 inner 这个目录名。文件 note.txt 不会出现在这一条里。

```linux run expect="inner" title="只看目录"
mkdir -p /tmp/nest/inner
find /tmp/nest -type d
```

### 没有的目录打印 none

/tmp/no-such-nest 不存在。find 失败后用 || 打出 none，整段脚本仍以 0 结束。

```linux run expect="none" title="没有目录"
find /tmp/no-such-nest -name note.txt || echo none
```

### 按类型找普通文件

-type f 只留普通文件。路径里仍能看到 note.txt。

```linux run expect="note.txt" title="普通文件"
mkdir -p /tmp/nest/inner
printf 'tea\n' > /tmp/nest/inner/note.txt
find /tmp/nest -type f
```
