---
language: shell
chapter: 14
title: "Shell 重定向"
level: beginner
minutes: 8
goals:
  - "用 > 把一行写进文件"
  - "用 cat 读回来"
  - "用 >> 在末尾再加一行"
sources:
  - wasi-sh
updated: "2026-10-15"
---

重定向在同一次运行里有效。文件名用 `note.txt`，不要 `cd` 到别的目录。

### 写再读

`>` 把 `printf` 的输出送进文件，终端要靠 `cat` 才能看见。

```sh run expect="hello" title="读回"
printf '%s\n' hello > note.txt
cat note.txt
```

输出里能看到 `hello`。

### 追加

`>>` 不会清掉刚才那一行。

```sh run expect="more" title="第二行"
printf '%s\n' hello > note.txt
printf '%s\n' more >> note.txt
cat note.txt
```

输出里能看到 `more`。

### 从文件读

`<` 把文件接到 `cat` 的标准输入。

```sh run expect="hello" title="重定向读入"
printf '%s\n' hello > note.txt
cat < note.txt
```

输出里能看到 `hello`。
