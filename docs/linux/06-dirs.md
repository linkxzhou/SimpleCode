---
language: linux
chapter: 6
title: "Linux 系统目录结构"
level: beginner
minutes: 7
goals:
  - "从根往下看路径"
  - "区分 . 和 .."
  - "知道 /bin /etc /tmp /proc 各放什么"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

路径从斜杠往下长。这颗镜像把命令、配置、临时文件和内核接口分成几处，名字和桌面系统大体相同。

### 路径从 / 往下长

单独一个斜杠表示根。BusyBox 的 ls 默认会给可执行文件上色，书里的例子加上 --color=never，期望才稳定。

```linux run expect="bin" title="根目录名字"
ls --color=never -1 /
```

### . 是当前目录，.. 是上一级

在 /tmp 里，点点会回到根。两条路径可以写在同一次运行里，用 && 串起来。

```linux run expect="bin" title="上一级是根"
cd /tmp && ls --color=never -1 .. | head -n 1
```

### /bin、/etc、/tmp、/proc 各放一类东西

/bin 放命令，/etc 放配置，/tmp 是可写的临时盘，/proc 是内核导出的文本。脚本文件不要和 /mnt 里这次 Run 的 main.sh 混在一起。

```linux run expect="os-release" title="配置目录里有发行版文件"
ls --color=never -1 /etc | grep os-release
```
