---
language: linux
chapter: 33
title: "Linux awk"
level: intermediate
minutes: 8
goals:
  - "打印第二列"
  - "把两行的数量加起来"
  - "用 length 看 sku 的长度"
sources:
  - v86-buildroot
updated: "2026-10-20"
---

awk 按空白切开每一行。$1 是第一列，$2 是第二列。END 里可以在全部行读完后打印合计。

### 第二列是 4

行 tea 4 的第二列是 4。print $2 只打这一列。

```linux run expect="4" title="第二列"
printf 'tea 4\n' | awk '{print $2}'
```

### 4 加 1 得到 5

两行的第二列是 4 和 1。s 在每行加上这一列，END 打印 5。

```linux run expect="5" title="合计 5"
printf 'tea 4\ncup 1\n' | awk '{s+=$2} END {print s}'
```

### tea 的长度是 3

length($1) 数第一列的字符。tea 有 3 个字母。

```linux run expect="3" title="长度 3"
printf 'tea\n' | awk '{print length($1)}'
```

### 只累加 sku 为 tea 的数量

两行 tea 的数量是 4 和 2，cup 是 1。条件 $1=="tea" 留下 6。

```linux run expect="6" title="只要 tea"
printf 'tea 4\ncup 1\ntea 2\n' | awk '{ if ($1=="tea") s+=$2 } END { print s }'
```
