---
language: shell
chapter: 12
title: "Shell Operators"
level: beginner
minutes: 8
goals:
  - "Compare integers with test"
  - "Test equality with -eq"
  - "Leave arithmetic expansion unwritten"
sources:
  - wasi-sh
updated: "2026-10-16"
---

Integer relations go into `test`. This shell has no `$((...))` form for arithmetic.

### Equal integers

Both sides are the integer 18. A successful `-eq` prints same.

```sh run expect="same" title="Two 18s"
if [ 18 -eq 18 ]; then
  printf '%s\n' same
fi
```

The line shows `same`.

### Unequal integers

`-ne` holds when the two numbers differ. 18 and 3 take that branch.

```sh run expect="differ" title="Price and count"
if [ 18 -ne 3 ]; then
  printf '%s\n' differ
fi
```

The line shows `differ`.

### Addition stays unread

The sum of 1 and 2 cannot be written as `$((1+2))`. This shell does not evaluate that form.

```sh norun title="No addition"
printf '%s\n' $((1+2))
```

Run does not execute the sample. The line is only here to show the missing form.
