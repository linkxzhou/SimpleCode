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

The bash form `items=(茶 笔)` does not run in this shell. Visit the words with `for ... in`.

### Parentheses do not assign

Parentheses after `=` do not build an array. This shell has no subscript syntax to read one.

```sh norun title="No arrays"
items=(茶 笔)
echo "${items[0]}"
```

Keep the sample for reading. This shell has no array subscript.

### Walk the words with for

The words stay in the order they are written. 茶 is visited, then 笔.

```sh run expect="笔" title="The second item"
for item in 茶 笔
do
  printf '%s\n' "$item"
done
```

The opening line is `茶`. The following line is `笔`.

### Keep the last word

The colon is an empty command, so the body prints nothing. When the loop ends, `item` still holds 墨.

```sh run expect="墨" title="What remains"
item=无
for item in 墨
do
  :
done
printf '%s\n' "$item"
```

The line shows `墨`.
