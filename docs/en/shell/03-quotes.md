---
language: shell
chapter: 3
title: "Shell Quotes"
level: beginner
minutes: 8
goals:
  - "Keep a dollar sign with single quotes"
  - "Expand a variable with double quotes"
  - "Let printf read the newline in the format"
sources:
  - wasi-sh
updated: "2026-10-16"
---

Single quotes copy characters literally. Double quotes expand `$`. The assignment form itself still cannot carry quotes.

### Single quotes

`$item` inside single quotes is not looked up. The characters stay as written.

```sh run expect="$item" title="Keep the spelling"
item=key
printf '%s\n' '$item'
```

The line shows `$item`.

### Double quotes

Double quotes replace `$item` with key. `printf` then receives that word.

```sh run expect="key" title="Expand to the key"
item=key
printf '%s\n' "$item"
```

The line shows `key`.

### The format string

The newline belongs in the `printf` format. It does not depend on expanding a variable.

```sh run expect="kept" title="Newline from the format"
printf '%s\n' kept
```

The line shows `kept`.
