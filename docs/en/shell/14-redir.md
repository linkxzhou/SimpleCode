---
language: shell
chapter: 14
title: "Shell Redirection"
level: beginner
minutes: 8
goals:
  - "Write one line to a file with >"
  - "Read that file back with cat"
  - "Append one more line with >>"
sources:
  - wasi-sh
updated: "2026-10-16"
---

A redirect lasts for the current run. Name the file `note.txt`. Do not try to `cd` into another directory.

### Write and read back

`>` sends the `printf` output into the file. `cat` is what brings that text back to the terminal.

```sh run expect="hello" title="Read it back"
printf '%s\n' hello > note.txt
cat note.txt
```

The line shows `hello`.

### Append a line

`>>` keeps the line already stored and adds another after it. `cat` then prints both lines.

```sh run expect="more" title="The second line"
printf '%s\n' hello > note.txt
printf '%s\n' more >> note.txt
cat note.txt
```

The file shows `hello`, then `more`.

### Read with an input redirect

`<` attaches the file to the standard input of `cat`. `cat` copies that stream to the terminal.

```sh run expect="hello" title="Read through a redirect"
printf '%s\n' hello > note.txt
cat < note.txt
```

The line shows `hello`.
