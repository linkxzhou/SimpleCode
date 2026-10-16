---
language: shell
chapter: 4
title: "Shell echo"
level: beginner
minutes: 8
goals:
  - "Print several words with echo"
  - "Drop the trailing newline with -n"
  - "Expect a space between words"
sources:
  - wasi-sh
updated: "2026-10-16"
---

`echo` prints a few words as they are given. When the layout needs a format, use `printf`.

### Several words

One space is inserted between the arguments. A newline follows the last word.

```sh run expect="first second" title="A space in the middle"
echo first second
```

The line shows `first second`.

### Suppress the newline

`-n` removes the newline at the end of `echo`. The next `echo` supplies a newline, so the join is easy to see.

```sh run expect="firstsecond" title="Joined before the next line"
echo -n first
echo second
```

The line shows `firstsecond`.

### A single word

One argument does not pick up an extra space. The word stands alone.

```sh run expect="tea" title="One word"
echo tea
```

The line shows `tea`.
