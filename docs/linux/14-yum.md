---
language: linux
chapter: 14
title: "Linux yum 命令"
level: intermediate
minutes: 6
goals:
  - "知道 yum 安装 RPM"
  - "确认没有仓库和网络"
  - "不把缺失命令当成可运行示例"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

yum 从仓库拉 RPM。这台客户机没有仓库，也没有网，命令本身就不在 /bin。

### yum 从仓库安装 RPM

桌面或服务器上它会解析依赖再下载。那些步骤需要网络和根目录里的包数据库。

```linux run expect="busybox" title="已有的多调用二进制"
ls --color=never -1 /bin/busybox
```

### 镜像没有仓库，也没有网

教学用的命令在制作镜像时已经放进 /bin。页面上不再安装新的包。

```linux run expect="ash" title="shell 已经在"
ls --color=never -1 /bin/ash
```

### 命令不存在时 shell 返回 127

若把 yum 放进可运行块，退出码不是 0，冒烟会把它当成失败。这里只阅读，不执行。

```linux norun title="不调用 yum"
yum install vim
```
