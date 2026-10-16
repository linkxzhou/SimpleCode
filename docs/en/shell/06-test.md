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

Both sides are 钥匙, so the comparison holds. The branch then prints 是.

```sh run expect="是" title="Equal strings"
item=钥匙
if [ "$item" = 钥匙 ]; then
  printf '%s\n' 是
fi
```

The line shows `是`.

### An empty string

`-z` holds when the value has no characters. The bare `name=` leaves that value empty.

```sh run expect="空" title="It is empty"
name=
if [ -z "$name" ]; then
  printf '%s\n' 空
fi
```

The line shows `空`.

### Integers

`-gt` compares the two sides as integers. Here 3 is greater than 2, so the branch prints 大.

```sh run expect="大" title="3 is greater than 2"
if [ 3 -gt 2 ]; then
  printf '%s\n' 大
fi
```

The line shows `大`.
