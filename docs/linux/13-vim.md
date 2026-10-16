---
language: linux
chapter: 13
title: "Linux vi/vim"
level: intermediate
minutes: 6
goals:
  - "知道 vi 是全屏编辑器"
  - "确认镜像不带 vim"
  - "改文件时用重定向"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

全屏编辑器要占住终端直到退出。文档 Run 需要脚本自己结束，所以改文件用重定向，不用 vi。

### vi 在终端里编辑文件

它切换模式、刷新整屏。串口上的文档运行等不到一个正常的退出码，因此不把 BusyBox vi 算成可运行示例。

```linux run expect="note" title="用重定向写入一行"
echo note > /tmp/note && cat /tmp/note
```

### 镜像不带 vim

完整的 vim 体积大，也不在这颗 Buildroot 配置里。想看文件内容，用 cat 或 head。

```linux run expect="note" title="读回刚才的文件"
echo note > /tmp/note && cat /tmp/note
```

### 教程改文件时用重定向，不用全屏编辑器

下面的命令只给对照。把它标成可运行会把冒烟卡在全屏界面上。

```linux norun title="不打开 vim"
vim /tmp/note
```
