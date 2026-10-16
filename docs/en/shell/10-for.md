---
language: shell
chapter: 10
title: "Shell for"
level: beginner
minutes: 8
goals:
  - "Visit each word with for"
  - "Store every word in the same variable"
  - "Write the list after in"
sources:
  - wasi-sh
updated: "2026-10-16"
---

`for` repeats once for each word. A space separates one word from the next.

### Two words

The first pass prints 茶. The second pass prints 笔.

```sh run expect="茶" title="The first item"
for item in 茶 笔
do
  printf '%s\n' "$item"
done
```

The first line is `茶`. The next line is `笔`.

### One word

The list contains only 钥匙, so the loop body runs a single time. `item` holds that word.

```sh run expect="钥匙" title="A single item"
for item in 钥匙
do
  printf '%s\n' "$item"
done
```

The line shows `钥匙`.

### The last of three

Each pass stores the current word in `last`. After 笔 and 水杯, the variable holds 车票.

```sh run expect="车票" title="The last item"
last=无
for item in 笔 水杯 车票
do
  last=$item
done
printf '%s\n' "$last"
```

The line shows `车票`.
