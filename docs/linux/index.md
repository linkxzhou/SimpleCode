---
language: linux
chapter: 0
title: "Linux 教程"
minutes: 8
goals:
  - "认出侧栏里的 Linux"
  - "用 uname 看到内核名字"
  - "把 Shell 和这台客户机分开"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

侧栏上的 Linux 是一台 i686 客户机，串口接在页面下方的终端。旁边的 Shell 仍是 wasi-sh，两条运行时互不进入。

### 浏览器里跑的是 32 位客户机

点 Run 之后，编辑器里的脚本经九号协议写到 `/mnt/main.sh`，再由 BusyBox 的 ash 执行。客户机内存是 64MiB：32MiB 装不下这颗已经解压的 6.8 内核。

```linux run expect="Linux" title="内核名字"
uname
```

### 侧栏上的 Linux 和 Shell 各有一个运行时

围栏语言要写成 linux。写成 sh 或 bash 会进 wasi-sh，那里没有外部命令。这边的 ls 是 `/bin` 里的 BusyBox 小程序。

```linux run expect="i686" title="机器字长"
uname -m
```

### 终端可以直接敲命令

快照停在提示符 `~%`。文档里的每一次 Run 都从这份快照重新打开，脚本里的目录切换不会留给下一次。人在终端里敲的命令会留着，直到下一次 Run 或 Stop。

```linux run expect="6.8.12" title="内核小版本"
uname -r
```

### 第 30 章以后

find 在 /tmp 里按名字查找，xargs 把多行收成参数，sed 做替换，awk 加第二列，sort、uniq 和 wc 整理行，kill -0 只检查当前壳，export 之后 env 才看得见 SKU，tar 与 gzip 打包 note.txt。reboot 和 kill -9 1 仍然只供阅读。
