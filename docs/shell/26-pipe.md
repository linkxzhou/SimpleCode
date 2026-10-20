---
language: shell
chapter: 26
title: "Shell 管道"
level: intermediate
minutes: 8
goals:
  - "用管道把一行交给 read"
  - "知道命令替换不会执行"
  - "把管道读到的词再加前缀"
sources:
  - wasi-sh
updated: "2026-10-20"
---

内建之间的管道在同一个进程里接内存。管道右边的 read 写进的变量，左边结束后仍然看得见。$(...) 不会启动子命令。

### 管道读到 mug

printf 打出 mug 和换行。read 把这一行放进 sku，再打印 got-mug。

```sh run expect="got-mug" title="读到 mug"
printf '%s\n' mug | read sku
printf '%s\n' "got-$sku"
```

### 再加一层 cat

tea 先进入 cat，再进入 read。变量里仍是 tea，打印 seen-tea。管道没有把 read 放进另一个进程。

```sh run expect="seen-tea" title="经过 cat"
printf '%s\n' tea | cat | read sku
printf '%s\n' "seen-$sku"
```

### 两段管道只留下最后一行

printf 的格式串打出 tea 和 cup 两行。read 每读一行就覆盖 sku，循环结束时 sku 是 cup。

```sh run expect="cup" title="最后是 cup"
printf '%s\n%s\n' tea cup | while read sku
do
  last=$sku
done
printf '%s\n' "$last"
```

### 命令替换只供阅读

$(printf ...) 不会执行里面的 printf。美元符号后面的括号不是展开语法。要取另一条命令的输出，用管道。

```sh norun title="没有命令替换"
printf '%s\n' "$(printf %s tea)"
```
