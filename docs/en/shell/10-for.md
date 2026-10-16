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

The first pass prints tea. The second pass prints pen.

```sh run expect="tea" title="The first item"
for item in tea pen
do
  printf '%s\n' "$item"
done
```

The first line is `tea`. The next line is `pen`.

### One word

The list contains only key, so the loop body runs a single time. `item` holds that word.

```sh run expect="key" title="A single item"
for item in key
do
  printf '%s\n' "$item"
done
```

The line shows `key`.

### The last of three

Each pass stores the current word in `last`. After pen and cup, the variable holds ticket.

```sh run expect="ticket" title="The last item"
last=none
for item in pen cup ticket
do
  last=$item
done
printf '%s\n' "$last"
```

The line shows `ticket`.
