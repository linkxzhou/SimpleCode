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

```sh run expect="kept" title="Skip the comment"
# printf '%s\n' hidden
printf '%s\n' kept
```

The line shows `kept`.

### A semicolon

A semicolon separates two print commands on one line. They run from left to right.

```sh run expect="first" title="The first command"
printf '%s\n' first; printf '%s\n' second
```

The upper line is `first`. The lower line is `second`.

### The colon command

`:` is an empty command that succeeds. It writes nothing, and the next line still runs.

```sh run expect="later" title="After the empty command"
:
printf '%s\n' later
```

The line shows `later`.
