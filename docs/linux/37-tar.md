---
language: linux
chapter: 37
title: "Linux 打包"
level: intermediate
minutes: 8
goals:
  - "把 note.txt 打进 tar 再列出来"
  - "用 gzip 压一轮再解回来"
  - "解包后读出 tea"
sources:
  - v86-buildroot
updated: "2026-10-20"
---

tar -c 打包，-t 只列出名字，-C 指定进入哪个目录再收文件。gzip -c 写到标准输出，-d 解压。每次 Run 的 /tmp 都是新的。

### 包里的名字是 note.txt

note.txt 写在 /tmp/pack。tar -cf 打成 /tmp/box.tar，-tf 列出 note.txt。

```linux run expect="note.txt" title="列出笔记"
mkdir -p /tmp/pack
printf 'tea\n' > /tmp/pack/note.txt
tar -cf /tmp/box.tar -C /tmp/pack note.txt
tar -tf /tmp/box.tar
```

### 解压后仍是 tea

gzip -c 压缩 note.txt，再 gzip -dc 解回来。正文仍是 tea。

```linux run expect="tea" title="解压 tea"
mkdir -p /tmp/pack
printf 'tea\n' > /tmp/pack/note.txt
gzip -c /tmp/pack/note.txt | gzip -dc
```

### 解包后读出 tea

这份 BusyBox 的 tar 不接受 -z。压缩交给上一节的 gzip。tar 只负责打包和解包，解到 /tmp/out 后再 cat，正文仍是 tea。

```linux run expect="tea" title="解包读出"
mkdir -p /tmp/pack /tmp/out
printf 'tea\n' > /tmp/pack/note.txt
tar -cf /tmp/box.tar -C /tmp/pack note.txt
tar -xf /tmp/box.tar -C /tmp/out
cat /tmp/out/note.txt
```

### reboot 只供阅读

reboot 会试图重启客户机。快照教学不运行它。打包和压缩用上面的 tar 与 gzip。

```linux norun title="不重启"
reboot
```
