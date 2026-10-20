---
language: shell
chapter: 25
title: "Shell 状态"
level: intermediate
minutes: 8
goals:
  - "用 $? 看见 false 的 1"
  - "成功命令之后状态是 0"
  - "知道 trap 不会登记"
sources:
  - wasi-sh
updated: "2026-10-20"
---

每条命令结束后，$? 是它的退出状态。false 是 1，true 和 printf 是 0。trap 不是内建，不能在退出时挂上另一条命令。

### false 之后 $? 是 1

false 把状态设成 1。下一条 printf 在展开 $? 时读到的仍是 1，因为展开发生在 printf 自己返回之前。

```sh run expect="1" title="状态 1"
false
printf '%s\n' $?
```

### true 之后 $? 是 0

true 成功，状态是 0。printf 把这个 0 打出来。

```sh run expect="0" title="状态 0"
true
printf '%s\n' $?
```

### 失败时改打 bad

false 之后 if 看的是上一条状态。非 0 时走 else，打印 bad。整段最后一条是 printf，脚本仍以 0 结束。

```sh run expect="bad" title="失败写成 bad"
false
if [ $? -eq 0 ]; then
  printf '%s\n' ok
else
  printf '%s\n' bad
fi
```

### trap 只供阅读

trap 会被当成外部命令。这里不能在 EXIT 上登记 printf。要看状态，用上面的 $?。

```sh norun title="没有 trap"
trap 'printf %s\n bye' EXIT
printf '%s\n' hi
```
