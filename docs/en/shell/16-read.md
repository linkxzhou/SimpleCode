---
language: shell
chapter: 16
title: "Shell read"
level: beginner
minutes: 8
goals:
  - "Read one line with read"
  - "Leave the newline out of the variable"
  - "Provide standard input with the example"
sources:
  - wasi-sh
updated: "2026-10-16"
---

`read` stops at a newline. The input supplied with the example must end with a newline.

### A name

The input is the letters Ada plus a newline. The variable keeps Ada and drops the newline.

```sh run stdin="Ada\n" expect="Ada" title="Read Ada"
read name
printf '%s\n' "$name"
```

The line shows `Ada`.

### A prefix in front

The format can place characters ahead of the stored word. Here the prefix is 你好， and the name follows it.

```sh run stdin="Ada\n" expect="你好，Ada" title="With a prefix"
read name
printf '%s\n' "你好，$name"
```

The line shows `你好，Ada`.

### From a pipe

`printf` on the left writes the line into the pipe. `read` stores it, and the next command prints it.

```sh run expect="笔" title="From the pipe"
printf '%s\n' 笔 | read item
printf '%s\n' "$item"
```

The line shows `笔`.
