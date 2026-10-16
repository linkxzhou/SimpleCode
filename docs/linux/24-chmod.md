---
language: linux
chapter: 24
title: "Linux chmod 命令"
level: advanced
minutes: 7
goals:
  - "用三个八进制数写模式"
  - "用 u+x 只给拥有者加执行"
  - "确认内容没有被改掉"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

chmod 改的是权限位，不是文件里的字节。例子仍放在 /tmp 这块 tmpfs 上。

### 数字模式把九位写成三个八进制数

644 是 rw-r--r--。6 是拥有者的读写，4 是只读。ls 的第一列应出现这个串。

```linux run expect="-rw-r--r--" title="八进制 644"
echo x > /tmp/bit && chmod 644 /tmp/bit && ls --color=never -l /tmp/bit
```

### u+x 只给拥有者加执行

在 644 上执行 u+x，拥有者变成 rwx，组和其他人仍是 r--。于是第一列是 -rwxr--r--，不是 755 那种全员可执行。

```linux run expect="-rwxr--r--" title="只加拥有者执行位"
echo x > /tmp/bit && chmod 644 /tmp/bit && chmod u+x /tmp/bit && ls --color=never -l /tmp/bit
```

### 改的是权限，不是文件内容

模式变了，cat 仍读到原来的字节。两条命令放在同一次运行里核对。

```linux run expect="x" title="内容仍是 x"
echo x > /tmp/bit && chmod 755 /tmp/bit && cat /tmp/bit
```
