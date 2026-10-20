---
language: linux
chapter: 34
title: "Linux 排序计数"
level: intermediate
minutes: 8
goals:
  - "按字典序排列三个词"
  - "用 uniq 去掉重复"
  - "用 wc 数字节并打上前缀"
sources:
  - v86-buildroot
updated: "2026-10-20"
---

sort 按字典序重排行。uniq 去掉相邻的重复行，所以前面先 sort。wc -c 的空格不稳定，先删掉空格再加前缀 bytes-。

### 三个词排成 cup mug tea

输入顺序是 mug、tea、cup。sort 之后 cup 在最上，接着 mug 和 tea。

```linux run expect="cup\nmug\ntea" title="字典序"
printf 'mug\ntea\ncup\n' | sort
```

### 重复的 tea 只留一行

tea 写了两次，cup 一次。sort | uniq 之后是 cup 和 tea 各一行。

```linux run expect="cup\ntea" title="去掉重复"
printf 'tea\ntea\ncup\n' | sort | uniq
```

### ab 和换行一共 3 字节

printf 'ab\n' 是 a、b 和换行，共 3 字节。tr 删掉 wc 可能垫上的空格，再打印 bytes-3。

```linux run expect="bytes-3" title="3 字节"
n=$(printf 'ab\n' | wc -c | tr -cd '0-9')
echo "bytes-$n"
```

### 两行文本的行数是 2

wc -l 数换行。两行 tea 和 cup 得到 2。同样去掉空格后打印 lines-2。

```linux run expect="lines-2" title="2 行"
n=$(printf 'tea\ncup\n' | wc -l | tr -cd '0-9')
echo "lines-$n"
```
