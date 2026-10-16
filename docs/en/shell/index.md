---
language: shell
chapter: 0
title: "Shell Tutorial"
minutes: 8
goals:
  - "Print one line with printf"
  - "Remember that only builtins run"
  - "Skip functions, arrays, and arithmetic expansion"
sources:
  - wasi-sh
updated: "2026-10-16"
---

This book runs on wasi-sh. Builtin commands share one process. No external program is started, and no subshell is created.

### The first line

The format string decides where the newline goes. `%s` copies the following word as it is written.

```sh run expect="你好" title="Say hello"
printf '%s\n' 你好
```

The line shows `你好`.

### echo adds a newline

`echo` places a newline after its last argument. A single space separates one argument from the next.

```sh run expect="茶 18" title="Separated by a space"
echo 茶 18
```

The line shows `茶 18`.

### An external command stops

`ls` is not a builtin. The call ends with status 127.

```sh norun title="No ls"
ls
```

This block is for reading. The shell reports that external commands are not available, because there is no fork.
