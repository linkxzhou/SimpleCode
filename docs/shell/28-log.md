---
language: shell
chapter: 28
title: "Shell 日志"
level: intermediate
minutes: 8
goals:
  - "用记号数 tea 出现了几次"
  - "记住日志的最后一行"
  - "只给 cup 打记号"
sources:
  - wasi-sh
updated: "2026-10-20"
---

这只壳没有算术展开，不能写 n=$((n+1))。计数用一串 x 表示，每看到一次目标就在末尾再加一个 x。日志行由 printf 的多个 %s 打出。

### tea 出现三次，记号是 xxx

四行是 tea、tea、cup、tea。只有 tea 追加 x。循环结束后打印 xxx。

```sh run expect="xxx" title="三个 x"
n=
printf '%s\n%s\n%s\n%s\n' tea tea cup tea | while read item
do
  if [ "$item" = tea ]; then
    n=${n}x
  fi
done
printf '%s\n' "$n"
```

### 最后一行是 mug

三行依次是 tea、cup、mug。每次 read 都覆盖 last。循环结束时打印 mug。

```sh run expect="mug" title="末行 mug"
last=
printf '%s\n%s\n%s\n' tea cup mug | while read item
do
  last=$item
done
printf '%s\n' "$last"
```

### cup 只有一次，记号是 x

三行里只有中间那个是 cup。记号从空串变成一个 x。

```sh run expect="x" title="一个 x"
n=
printf '%s\n%s\n%s\n' tea cup mug | while read item
do
  if [ "$item" = cup ]; then
    n=${n}x
  fi
done
printf '%s\n' "$n"
```

### 算术展开只供阅读

$((n+1)) 不会做加法。美元符号后面的括号不是语法。计数继续用上面的记号串。

```sh norun title="没有算术展开"
n=1
n=$((n+1))
printf '%s\n' "$n"
```
