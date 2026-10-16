---
language: linux
chapter: 18
title: "Linux pwd 命令"
level: intermediate
minutes: 6
goals:
  - "打印当前目录"
  - "让它跟着 cd"
  - "在没有软链时不必区分物理路径"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

pwd 把当前工作目录打到标准输出。这颗镜像几乎没有符号链接迷宫，物理路径和逻辑路径重合。

### pwd 打印当前目录

刚从快照进来时家目录是 /root。显式 cd 之后，pwd 跟的是新位置。

```linux run expect="/tmp" title="临时目录"
cd /tmp && pwd
```

### 它跟随上一条 cd

两条命令用 && 连住，pwd 才看得到切换。分成两次文档 Run 时，第二次又从 /root 开始。

```linux run expect="/etc" title="配置目录"
cd /etc && pwd
```

### 物理路径和逻辑路径在没有软链时相同

BusyBox pwd 没有那么多 GNU 长选项可炫耀。没有软链时，打出来的就是你 cd 进去的那个绝对路径。

```linux run expect="/" title="根路径"
cd / && pwd
```
