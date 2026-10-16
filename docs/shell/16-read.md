---
language: shell
chapter: 16
title: "Shell read"
level: beginner
minutes: 8
goals:
  - "用 read 读入一行"
  - "知道换行不会留在变量里"
  - "标准输入要在围栏上写好"
sources:
  - wasi-sh
updated: "2026-10-15"
---

`read` 读到换行就停。围栏上的输入要以换行结束。

### 一行名字

输入是 Ada 和换行，变量里只留下 Ada。

```sh run stdin="Ada\n" expect="Ada" title="读入 Ada"
read name
printf '%s\n' "$name"
```

输出里能看到 `Ada`。

### 再打出前缀

读到的词可以接在 Hello, 后面。

```sh run stdin="Ada\n" expect="Hello, Ada" title="接上前缀"
read name
printf '%s\n' "Hello, $name"
```

输出里能看到 `Hello, Ada`。

### 从管道读

没有键盘时，也可以从左边的 `printf` 读。

```sh run expect="pen" title="来自管道"
printf '%s\n' pen | read item
printf '%s\n' "$item"
```

输出里能看到 `pen`。
