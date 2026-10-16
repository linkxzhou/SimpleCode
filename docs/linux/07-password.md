---
language: linux
chapter: 7
title: "Linux 忘记密码解决方法"
level: beginner
minutes: 6
goals:
  - "知道改密码要碰到引导器"
  - "确认这里自动登录 root"
  - "不运行 passwd"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

单用户改密码需要能打断引导。这台机器的 inittab 直接登录 root，没有密码提示。

### 单用户改密码需要能碰到引导器

桌面发行版可以在 GRUB 里加单用户参数。快照已经停在 shell，没有引导菜单可进。

```linux run expect="root" title="当前用户是 root"
whoami
```

### 这台机器自动登录 root，没有密码提示

id 打出的 uid 是 0。没有第二个账号，也就没有“忘记的那一个密码”可以重置。

```linux run expect="uid=0(root)" title="uid 为零"
id
```

### passwd 不作为可运行示例

passwd 会读终端上的新口令。文档 Run 把标准输入放进文件，不适合交互改密码。

```linux norun title="不改密码"
passwd
```
