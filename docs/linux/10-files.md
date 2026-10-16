---
language: linux
chapter: 10
title: "Linux 文件与目录管理"
level: beginner
minutes: 8
goals:
  - "写绝对路径"
  - "用 mkdir cp mv rm 改目录树"
  - "把 cd 和后续命令放在同一次运行"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

绝对路径从斜杠写起。文档 Run 每次回到快照，所以换目录和后继命令要写在同一条链上。

### 绝对路径从 / 写起

/tmp/box 不依赖当前目录。相对路径则会跟着上一条 cd 走，单独一次 Run 看不出来。

```linux run expect="/tmp/box" title="进入新建目录"
mkdir /tmp/box && cd /tmp/box && pwd
```

### mkdir、cp、mv、rm 改目录树

复制 /etc/hostname 到当前目录后，ls 应能看见这个名字。这些调用都是 BusyBox 外部小程序，不是 wasi-sh 的内建。

```linux run expect="hostname" title="复制主机名文件"
mkdir -p /tmp/box && cd /tmp/box && cp /etc/hostname . && ls --color=never -1
```

### cd 只影响当前这条命令序列

交互终端里单独敲的 cd 会留在那台虚拟机里，直到下一次 Run 把快照盖回来。书里的例子不依赖那份残留。

```linux run expect="/tmp" title="链结束时仍在 /tmp"
cd / && cd /tmp && pwd
```
