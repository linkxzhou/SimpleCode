---
language: linux
chapter: 5
title: "Linux 系统启动过程"
level: beginner
minutes: 7
goals:
  - "读内核命令行"
  - "知道快照跳过了启动打印"
  - "不在书里执行 reboot"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

冷启动会走过 SeaBIOS 和内核解压。教学路径用快照，从已经出现的 shell 提示符接着跑。

### 内核命令行挂在 /proc/cmdline

串口控制台被写进命令行，所以打印走 ttyS0，而不是一块你看不见的 VGA 画布。

```linux run expect="console=ttyS0" title="串口控制台"
cat /proc/cmdline
```

### 快照从 shell 提示符开始

保存发生在 `~%` 出现之后。恢复时不再跑 BIOS，因此启动横幅不会灌进终端。quiet 也压住了内核自己的行。

```linux run expect="quiet" title="安静参数还在"
cat /proc/cmdline
```

### 重启会拆掉这台虚拟机

reboot 会让客户机进入你无法从串口收回的状态。Stop 按钮直接销毁模拟器，需要时再从快照拉起。

```linux norun title="不重启"
reboot
```
