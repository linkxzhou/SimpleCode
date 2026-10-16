---
language: shell
chapter: 8
title: "Shell Short Circuit"
level: beginner
minutes: 8
goals:
  - "Continue after success with &&"
  - "Continue after failure with ||"
  - "Expect the right-hand command to be skipped"
sources:
  - wasi-sh
updated: "2026-10-16"
---

`&&` runs the command on the right only when the left side exits with 0. `||` runs that command only when the left side fails.

### And

`true` exits 0. The `printf` on the right therefore runs.

```sh run expect="yes" title="The left side succeeds"
true && printf '%s\n' yes
```

The line shows `yes`.

### Or

`false` exits non-zero. The `printf` on the right supplies the other word.

```sh run expect="no" title="The left side fails"
false || printf '%s\n' no
```

The line shows `no`.

### The right side is skipped

`true` has already succeeded, so the command after `||` does not run. The following `printf` still runs.

```sh run expect="done" title="Only the ending is printed"
true || printf '%s\n' absent
printf '%s\n' done
```

The line shows `done`. The text absent is not printed.
