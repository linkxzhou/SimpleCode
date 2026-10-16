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

```sh run expect="是" title="The left side succeeds"
true && printf '%s\n' 是
```

The line shows `是`.

### Or

`false` exits non-zero. The `printf` on the right supplies the other word.

```sh run expect="否" title="The left side fails"
false || printf '%s\n' 否
```

The line shows `否`.

### The right side is skipped

`true` has already succeeded, so the command after `||` does not run. The following `printf` still runs.

```sh run expect="结束" title="Only the ending is printed"
true || printf '%s\n' 不该出现
printf '%s\n' 结束
```

The line shows `结束`. The text 不该出现 is absent.
