---
language: linux
chapter: 2
title: "Linux 安装"
level: beginner
minutes: 6
goals:
  - "知道页面不会写硬盘"
  - "看到根目录已经在"
  - "不把 fdisk 当成可运行示例"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

这台客户机的根是内存里的 initramfs。页面没有分区步骤，也不会把系统写进你的磁盘。

### 页面不会分区或写入硬盘

第一次点开 Linux 才下载模拟器和快照。下载结束之后直接进 shell，中间没有安装向导。

```linux run expect="i686" title="确认是 32 位"
uname -m
```

### 第一次点 Run 才下载内核和快照

侧栏在拉取文件时显示百分比，快照恢复时改成启动中。刷新之后走 Cache API，不必再下那几十兆。

```linux run expect="bin" title="根上第一项"
ls --color=never -1 / | head -n 1
```

### 安装命令在这台机器上没有对应程序

fdisk 会改分区表。这颗镜像不提供它，示例只给阅读，避免 docs 冒烟去等一个不存在的命令。

```linux norun title="不分区"
fdisk -l
```
