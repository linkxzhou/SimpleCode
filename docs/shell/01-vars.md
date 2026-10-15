---
language: shell
chapter: 1
title: "Shell 变量"
level: beginner
minutes: 8
goals:
  - "用等号赋值"
  - "等号两边不写空格"
  - "用双引号读出值"
sources:
  - wasi-sh
updated: "2026-10-15"
---

赋值必须是一个不含引号的词。等号右边若再套引号，这只壳会把它当成命令名。

### 赋值再读出

值是一个没有空格的词，直接写在等号右边。

```sh run expect="钥匙" title="读出钥匙"
item=钥匙
printf '%s\n' "$item"
```

输出里能看到 `钥匙`。

### 换一个值

再次赋值会盖掉原来的词。

```sh run expect="车票" title="后来的值"
item=水杯
item=车票
printf '%s\n' "$item"
```

输出里能看到 `车票`。

### 引号赋值不运行

`item="钥匙"` 不是赋值，会去找外部命令。

```sh norun title="引号不是赋值"
item="钥匙"
printf '%s\n' "$item"
```
