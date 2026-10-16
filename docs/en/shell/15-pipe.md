---
language: shell
chapter: 15
title: "Shell Pipes"
level: beginner
minutes: 8
goals:
  - "Pass the left-hand output to the right"
  - "Finish the left side before the right side reads"
  - "Join the pipe with builtin commands only"
sources:
  - wasi-sh
updated: "2026-10-16"
---

A pipe is a buffer in memory. The right side starts reading only after the left side has finished writing. No second process is created.

### Through cat

`echo` writes one line into the pipe. `cat` prints that same line.

```sh run expect="tea" title="After the pipe"
echo tea | cat
```

The line shows `tea`.

### Two cat stages

Each `cat` copies the buffer it receives. The text is still pen after both copies.

```sh run expect="pen" title="Still the pen"
printf '%s\n' pen | cat | cat
```

The line shows `pen`.

### Into a variable

`read` on the right runs in this same process. The command after the pipe still sees `item`.

```sh run expect="key" title="Kept in the variable"
printf '%s\n' key | read item
printf '%s\n' "$item"
```

The line shows `key`.
