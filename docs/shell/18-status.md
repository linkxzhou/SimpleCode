---
language: shell
chapter: 18
title: "Shell 退出状态"
level: beginner
minutes: 8
goals:
  - "用 $? 看上一条的退出码"
  - "区分 true 和 false"
  - "知道 0 表示成功"
sources:
  - wasi-sh
updated: "2026-10-15"
---

`$?` 在下一条命令展开时，还是上一条的退出码。0 是成功。

### 成功是 0

`true` 之后，`$?` 是 0。

```sh run expect="0" title="成功"
true
printf '%s\n' $?
```

输出里能看到 `0`。

### 失败是 1

`false` 的退出码是 1。

```sh run expect="1" title="失败"
false
printf '%s\n' $?
```

输出里能看到 `1`。

### 这条壳的 $$

`$$` 在这里固定打出 1，不是操作系统的进程号。

```sh run expect="1" title="固定的 1"
printf '%s\n' $$
```

输出里能看到 `1`。
