---
language: shell
chapter: 19
title: "Shell Comments"
level: beginner
minutes: 8
goals:
  - "Skip a line with #"
  - "Keep comment text out of the output"
  - "Place two commands on one line with a semicolon"
sources:
  - wasi-sh
updated: "2026-10-16"
---

`#` marks a comment through the end of the line. The shell skips that text when it runs the script.

### A full-line comment

The `printf` written after `#` is ignored. Only the second line runs.

```sh run expect="留下" title="Skip the comment"
# printf '%s\n' 隐藏
printf '%s\n' 留下
```

The line shows `留下`.

### A semicolon

A semicolon separates two print commands on one line. They run from left to right.

```sh run expect="甲" title="The first command"
printf '%s\n' 甲; printf '%s\n' 乙
```

The upper line is `甲`. The lower line is `乙`.

### The colon command

`:` is an empty command that succeeds. It writes nothing, and the next line still runs.

```sh run expect="之后" title="After the empty command"
:
printf '%s\n' 之后
```

The line shows `之后`.
