---
language: shell
chapter: 18
title: "Shell Exit Status"
level: beginner
minutes: 8
goals:
  - "Read the previous status with $?"
  - "Tell true apart from false"
  - "Treat 0 as success"
sources:
  - wasi-sh
updated: "2026-10-16"
---

When the next command expands `$?`, the value is still the previous exit status. Success is 0.

### Success is 0

`true` finishes successfully. The following `printf` expands `$?` to 0.

```sh run expect="0" title="Success"
true
printf '%s\n' $?
```

The line shows `0`.

### Failure is 1

`false` exits with status 1. `$?` on the next line prints that status.

```sh run expect="1" title="Failure"
false
printf '%s\n' $?
```

The line shows `1`.

### A fixed $$

`$$` prints 1 on every run of this shell. Every script sees this same fixed value.

```sh run expect="1" title="A fixed 1"
printf '%s\n' $$
```

The line shows `1`.
