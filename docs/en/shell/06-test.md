---
language: shell
chapter: 6
title: "Shell test"
level: beginner
minutes: 8
goals:
  - "Compare strings with ="
  - "Detect an empty string with -z"
  - "Compare integers with -eq"
sources:
  - wasi-sh
updated: "2026-10-16"
---

`test` and `[` write nothing to the terminal. The exit status carries the answer. A successful test exits with 0.

### Equal strings

Both sides are key, so the comparison holds. The branch then prints yes.

```sh run expect="yes" title="Equal strings"
item=key
if [ "$item" = key ]; then
  printf '%s\n' yes
fi
```

The line shows `yes`.

### An empty string

`-z` holds when the value has no characters. The bare `name=` leaves that value empty.

```sh run expect="empty" title="It is empty"
name=
if [ -z "$name" ]; then
  printf '%s\n' empty
fi
```

The line shows `empty`.

### Integers

`-gt` compares the two sides as integers. Here 3 is greater than 2, so the branch prints big.

```sh run expect="big" title="3 is greater than 2"
if [ 3 -gt 2 ]; then
  printf '%s\n' big
fi
```

The line shows `big`.
