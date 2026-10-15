---
language: shell
chapter: 10
title: "Shell for 循环"
level: beginner
minutes: 8
goals:
  - "用 for 走过几个词"
  - "每次把词放进同一个变量"
  - "用 in 写出清单"
sources:
  - wasi-sh
updated: "2026-10-15"
---

`for` 按词重复。词与词之间用空格分开。

### 两个词

先打出茶，再打出笔。

```sh run expect="茶" title="第一项"
for item in 茶 笔
do
  printf '%s\n' "$item"
done
```

输出里能看到 `茶`。

### 一个词

清单里只有钥匙时，循环只走一次。

```sh run expect="钥匙" title="只有一项"
for item in 钥匙
do
  printf '%s\n' "$item"
done
```

输出里能看到 `钥匙`。

### 三个词的最后一个

最后一次循环留下车票。

```sh run expect="车票" title="最后一项"
last=无
for item in 笔 水杯 车票
do
  last=$item
done
printf '%s\n' "$last"
```

输出里能看到 `车票`。
