---
language: shell
chapter: 3
title: "Shell 引号"
level: beginner
minutes: 8
goals:
  - "用单引号留下美元符号"
  - "用双引号展开变量"
  - "知道格式串里的换行由 printf 解释"
sources:
  - wasi-sh
updated: "2026-10-15"
---

单引号按字面抄。双引号会展开 `$`。赋值本身仍然不能带引号。

### 单引号

单引号里的 `$item` 不会去查变量表。

```sh run expect="$item" title="留下写法"
item=key
printf '%s\n' '$item'
```

输出里能看到 `$item`。

### 双引号

双引号先把 `$item` 换成 key，再交给 `printf`。

```sh run expect="key" title="展开成钥匙"
item=key
printf '%s\n' "$item"
```

输出里能看到 `key`。

### 格式串

换行写在 `printf` 的格式里，不靠变量展开。

```sh run expect="kept" title="格式换行"
printf '%s\n' kept
```

输出里能看到 `kept`。
