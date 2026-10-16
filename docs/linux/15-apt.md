---
language: linux
chapter: 15
title: "Linux apt 命令"
level: intermediate
minutes: 6
goals:
  - "知道 apt 安装 deb"
  - "确认没有 apt"
  - "改用已经在 /bin 的命令"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

apt 面向 Debian 系的软件仓库。Buildroot 做的这颗根文件系统不用它。

### apt 从仓库安装 deb

它要源列表、签名和网络。客户机三者都没有，装包这条路在页面上是关着的。

```linux run expect="echo" title="echo 小程序在"
ls --color=never -1 /bin | grep echo
```

### 这台机器没有 apt

找不到命令时 ash 会以 127 结束。书里不把这个失败放进可运行块，避免冒烟误判。

```linux run expect="cat" title="cat 也在命令目录"
ls --color=never -1 /bin | grep cat
```

### 教学用的命令已经在 /bin

后面的章节直接调用 ls、grep、chmod。不需要先 apt update。

```linux norun title="不调用 apt"
apt install vim
```
