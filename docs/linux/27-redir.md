---
language: linux
chapter: 27
title: "Linux 重定向"
level: advanced
minutes: 7
goals:
  - "用 > 写入文件"
  - "用 >> 追加"
  - "用 < 从文件读标准输入"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

重定向由 ash 在启动命令前安排。文件在 /tmp，不写到 /mnt 里这次运行的脚本旁边。

### > 把标准输出写进文件

已存在的文件会被截断。cat 读回时应只看到这一次写入的词。

```linux run expect="ada" title="覆盖写入"
echo ada > /tmp/out && cat /tmp/out
```

### >> 追加

追加不抹掉旧内容。再 cat 时，后写的 more 应当还在文件末尾。

```linux run expect="more" title="追加的一行"
echo ada > /tmp/out && echo more >> /tmp/out && cat /tmp/out
```

### < 从文件读标准输入

没有参数的 cat 会读标准输入。小于号把 /tmp/out 接上去，于是又看见 ada。

```linux run expect="ada" title="从文件读入"
echo ada > /tmp/out && cat < /tmp/out
```
