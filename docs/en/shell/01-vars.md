---
language: shell
chapter: 1
title: "Shell Variables"
level: beginner
minutes: 8
goals:
  - "Assign with an equals sign"
  - "Leave no spaces around the equals sign"
  - "Read the value in double quotes"
sources:
  - wasi-sh
updated: "2026-10-16"
---

An assignment is one word, with no space on either side of `=`. Quotes on the right-hand side make this shell treat the line as a command name.

### Assign a value and read it

The value is one word with no spaces. Write it on the right-hand side of the equals sign.

```sh run expect="key" title="Read the key"
item=key
printf '%s\n' "$item"
```

The line shows `key`.

### Replace the stored word

A second assignment overwrites the word already stored. Only the newer word remains.

```sh run expect="ticket" title="The later value"
item=cup
item=ticket
printf '%s\n' "$item"
```

The line shows `ticket`.

### Quotes do not assign

`item="key"` is not an assignment. The shell looks for an external command.

```sh norun title="Quotes are not an assignment"
item="key"
printf '%s\n' "$item"
```

Leave this block for reading. The quoted form stores nothing in `item`.
