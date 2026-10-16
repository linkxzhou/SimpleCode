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

先打出 tea，再打出 pen。

```sh run expect="tea" title="第一项"
for item in tea pen
do
  printf '%s\n' "$item"
done
```

输出里能看到 `tea`。

### 一个词

清单里只有 key 时，循环只走一次。

```sh run expect="key" title="只有一项"
for item in key
do
  printf '%s\n' "$item"
done
```

输出里能看到 `key`。

### 三个词的最后一个

最后一次循环留下 ticket。

```sh run expect="ticket" title="最后一项"
last=none
for item in pen cup ticket
do
  last=$item
done
printf '%s\n' "$last"
```

输出里能看到 `ticket`。
