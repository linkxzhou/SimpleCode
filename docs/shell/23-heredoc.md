---
language: shell
chapter: 23
title: "Shell 多行文本"
level: intermediate
minutes: 8
goals:
  - "用多次 %s 打出两行"
  - "把两行写进文件再读回"
  - "知道 here-doc 不能解析"
sources:
  - wasi-sh
updated: "2026-10-20"
---

wasi-sh 的 printf 不会重复使用格式串，一个 %s 只吃一个参数。多行文本把换行写进格式串。<< 不是 here-doc，重定向会缺目标。

### 一次打出 tea 和 cup

格式串里有两个 %s 和两处换行。参数 tea 与 cup 各占一行，期望锁定第二行 cup。

```sh run expect="cup" title="第二行是 cup"
printf '%s\n%s\n' tea cup
```

### 文件里的第二行是 mug

两次 printf 把 tea 和 mug 写进 note.txt。cat 读回整份文件，输出里能看到 mug。

```sh run expect="mug" title="读回 mug"
printf '%s\n' tea > note.txt
printf '%s\n' mug >> note.txt
cat note.txt
```

### 三行里的最后一行是 pen

三个 %s 对应 tea、cup、pen。最后一行是 pen。格式串必须自己写出每一个换行。

```sh run expect="pen" title="最后是 pen"
printf '%s\n%s\n%s\n' tea cup pen
```

### here-doc 只供阅读

<<STOP 会被看成一次输入重定向，后面的 STOP 并不能当正文开始。解析直接失败，所以这段不运行。

```sh norun title="没有 here-doc"
cat <<STOP
tea
STOP
```
