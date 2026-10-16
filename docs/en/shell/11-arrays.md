---
language: shell
chapter: 11
title: "Shell Arrays"
level: beginner
minutes: 8
goals:
  - "Treat a parenthesis list as invalid here"
  - "Walk the words with for"
  - "Keep the current word in a variable"
sources:
  - wasi-sh
updated: "2026-10-16"
---

The bash form `items=(tea pen)` does not run in this shell. Visit the words with `for ... in`.

### Parentheses do not assign

Parentheses after `=` do not build an array. This shell has no subscript syntax to read one.

```sh norun title="No arrays"
items=(tea pen)
echo "${items[0]}"
```

Keep the sample for reading. This shell has no array subscript.

### Walk the words with for

The words stay in the order they are written. tea is visited, then pen.

```sh run expect="pen" title="The second item"
for item in tea pen
do
  printf '%s\n' "$item"
done
```

The opening line is `tea`. The following line is `pen`.

### Keep the last word

The colon is an empty command, so the body prints nothing. When the loop ends, `item` still holds ink.

```sh run expect="ink" title="What remains"
item=none
for item in ink
do
  :
done
printf '%s\n' "$item"
```

The line shows `ink`.
