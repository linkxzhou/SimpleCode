---
language: linux
chapter: 23
title: "Linux cat 命令"
level: advanced
minutes: 7
goals:
  - "把文件打到标准输出"
  - "按顺序接上多个文件"
  - "在没有参数时读标准输入"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

cat 把字节抄到标准输出。文档 Run 的标准输入来自九号协议上的文件，不从串口读，以免和包装命令抢终端。

### 把文件内容写到标准输出

重定向先把一行放进 /tmp，cat 再读出来。期望就是那一行正文。

```linux run expect="plain" title="单文件"
echo plain > /tmp/plain && cat /tmp/plain
```

### 多个文件按顺序接在一起

参数从左到右。第二段出现时，说明两个文件都被读过。

```linux run expect="two" title="按顺序拼接"
echo one > /tmp/p && echo two > /tmp/q && cat /tmp/p /tmp/q
```

### 没有参数时从标准输入读到 EOF

围栏的 stdin 被写成 /mnt/stdin.txt，再重定向给 cat。中文按 UTF-8 从串口字节解出来。

```linux run stdin="林夏\n" expect="林夏" title="读入的名字"
cat
```
