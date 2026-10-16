---
language: shell
chapter: 5
title: "Shell printf"
level: beginner
minutes: 8
goals:
  - "Print a string with %s"
  - "Print an integer with %d"
  - "Break the line with \\n"
sources:
  - wasi-sh
updated: "2026-10-16"
---

`printf` reads the format string first, then the arguments that follow. Keep the format in single quotes so the shell leaves the backslash alone.

### A string

`%s` drops the next word into the output unchanged. `\n` in the format ends the line.

```sh run expect="pen" title="One word"
printf '%s\n' pen
```

The line shows `pen`.

### An integer

`%d` writes the number in decimal. The format string still provides the newline.

```sh run expect="18" title="Decimal"
printf '%d\n' 18
```

The line shows `18`.

### A percent sign

`%%` writes one percent sign. This format takes no argument after it.

```sh run expect="100%" title="One percent sign"
printf '100%%\n'
```

The line shows `100%`.
