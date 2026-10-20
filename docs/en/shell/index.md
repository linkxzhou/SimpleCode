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

```sh run expect="Hi" title="Say hello"
printf '%s\n' Hi
```

The line shows `Hi`.

### echo adds a newline

`echo` places a newline after its last argument. A single space separates one argument from the next.

```sh run expect="tea 18" title="Separated by a space"
echo tea 18
```

The line shows `tea 18`.

### An external command stops

`ls` is not a builtin. The call ends with status 127.

```sh norun title="No ls"
ls
```

This block is for reading. The shell reports that external commands are not available, because there is no fork.

### After chapter 21

${sku} expands, and ${sku:-mug} does not. case, here-doc, getopts, trap, command substitution, and arithmetic expansion are not syntax in this shell. The runnable stand-ins are if, repeated %s, a for loop that recognizes -n, $?, a pipe, and a string of x marks.
