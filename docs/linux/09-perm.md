---
language: linux
chapter: 9
title: "Linux 文件基本属性"
level: beginner
minutes: 8
goals:
  - "读 ls -l 的第一列"
  - "把九位权限分成三组"
  - "用 chmod 改模式"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

长列表的第一列是类型和权限。例子放在 /tmp，九号协议目录上的模式和普通临时盘不一致。

### ls -l 的第一列是类型和权限

横线开头表示普通文件。后面九位分成拥有者、组、其他人。时间戳来自客户机时钟，不要写进期望。

```linux run expect="-rw-r--r--" title="只读样式的九位"
echo hi > /tmp/mode && chmod 644 /tmp/mode && ls --color=never -l /tmp/mode
```

### 三位一组对应拥有者、组、其他人

755 让拥有者可读可写可执行，其余人可读可执行。ls 不加颜色开关时，文件名会被包进转义序列。

```linux run expect="-rwxr-xr-x" title="加上执行位"
echo hi > /tmp/mode && chmod 755 /tmp/mode && ls --color=never -l /tmp/mode
```

### chmod 改这九位

chown 在只有 root 的机器上没有第二个用户可观察，所以不放进可运行块。数字模式一次写完三组。

```linux norun title="不改属主"
chown nobody /tmp/mode
```
