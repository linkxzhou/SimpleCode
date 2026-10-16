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

```sh run expect="甲 乙" title="A space in the middle"
echo 甲 乙
```

The line shows `甲 乙`.

### Suppress the newline

`-n` removes the newline at the end of `echo`. The next `echo` supplies a newline, so the join is easy to see.

```sh run expect="甲乙" title="Joined before the next line"
echo -n 甲
echo 乙
```

The line shows `甲乙`.

### A single word

One argument does not pick up an extra space. The word stands alone.

```sh run expect="茶" title="One word"
echo 茶
```

The line shows `茶`.
