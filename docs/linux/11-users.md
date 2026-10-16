---
language: linux
chapter: 11
title: "Linux 用户和用户组管理"
level: intermediate
minutes: 6
goals:
  - "用 id 看 uid 和 gid"
  - "确认只有 root"
  - "不运行 useradd"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

教学镜像只有 root 一个用户。组也是 root。没有用户数据库可写。

### id 打印 uid 和 gid

两个数字都是 0，名字写在括号里。这是 BusyBox id 的一行输出，不是 procps 的长表。

```linux run expect="gid=0(root)" title="用户和组"
id
```

### 这台机器只有 root

whoami 只可能打出 root。家目录是 /root，提示符里的波浪号指的就是这里。

```linux run expect="root" title="登录名"
whoami
```

### useradd 不在镜像里

添加用户和组需要对应的小程序和可写的账号文件。这里两者都不准备，示例只供对照。

```linux norun title="不添加用户"
useradd student
```
