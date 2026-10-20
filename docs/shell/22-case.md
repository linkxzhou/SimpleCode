---
language: shell
chapter: 22
title: "Shell 分支"
level: intermediate
minutes: 8
goals:
  - "用 if 把 tea 标成 cup"
  - "用 elif 接住 mug"
  - "知道 case 不是这只壳的语法"
sources:
  - wasi-sh
updated: "2026-10-20"
---

wasi-sh 没有 case。分支写成 if、elif 和 else，条件用 test 的等号。case 关键字会被当成外部命令，因此只留在阅读块里。

### tea 打印 cup

item 赋成 tea。第一个 test 成功，printf 打出 cup，后面的 elif 不再执行。

```sh run expect="cup" title="tea 走向 cup"
item=tea
if [ "$item" = tea ]; then
  printf '%s\n' cup
elif [ "$item" = mug ]; then
  printf '%s\n' bowl
else
  printf '%s\n' none
fi
```

### mug 打印 bowl

item 改成 mug。第一支失败，elif 成功，打印 bowl。

```sh run expect="bowl" title="mug 走向 bowl"
item=mug
if [ "$item" = tea ]; then
  printf '%s\n' cup
elif [ "$item" = mug ]; then
  printf '%s\n' bowl
else
  printf '%s\n' none
fi
```

### 别的词打印 none

item 是 pen。两支等号都失败，else 打印 none。

```sh run expect="none" title="其余是 none"
item=pen
if [ "$item" = tea ]; then
  printf '%s\n' cup
elif [ "$item" = mug ]; then
  printf '%s\n' bowl
else
  printf '%s\n' none
fi
```

### case 语句只供阅读

case、in 和 esac 都不是内建语法。写出来会去找外部命令，并以 127 结束。阅读块只用来对照上面的 if。

```sh norun title="没有 case"
case tea in
  tea) printf '%s\n' cup ;;
esac
```
