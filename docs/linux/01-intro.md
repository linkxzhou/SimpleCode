---
language: linux
chapter: 1
title: "Linux 简介"
level: beginner
minutes: 7
goals:
  - "区分内核和用户空间"
  - "读出 BusyBox 版本"
  - "读发行版名字"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

这颗镜像的内核负责进程和文件，日常命令来自用户空间里的 BusyBox，不是另一套 GNU 工具。

### 内核负责进程和文件，命令来自用户空间

uname 打出的是内核。真正被你敲下的 ls、cat 住在根文件系统里，由 init 拉起的 shell 去找。

```linux run expect="Buildroot 2024.05.2" title="发行版字段"
cat /etc/os-release
```

### 这里的命令是 BusyBox applet

一个 busybox 二进制靠 argv[0] 切换行为。版本行写着 1.36.1，和桌面发行版里单独安装的 coreutils 不是同一份源码。

```linux run expect="BusyBox v1.36.1" title="BusyBox 版本行"
busybox | head -n 1
```

### 发行版名字可以读 /etc/os-release

字段比桌面发行版短，但 NAME 和 VERSION 都在。主机名文件单独放着，内容是 buildroot。

```linux run expect="buildroot" title="主机名文件"
cat /etc/hostname
```
