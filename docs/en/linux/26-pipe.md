---
language: linux
chapter: 26
title: "Linux Pipes"
level: advanced
minutes: 7
goals:
  - "Feed the left-hand output to the right"
  - "Insert one more command in the middle"
  - "Tell this apart from a wasi-sh builtin pipe"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

A pipe on this guest is two BusyBox processes. In the Shell book, a pipe stays inside one wasm process and only joins builtins.

### The left side's output becomes the right side's input

grep sees only the lines printf wrote. The matching line shows up by itself.

```linux run expect="b" title="b from the pipe"
printf 'a\nb\n' | grep b
```

The surviving line is `b`.

### A third command can sit in the middle

head cuts the stream first, and grep filters what remains. The first name at the root is bin, and that name is still present after the two-stage pipe.

```linux run expect="bin" title="Filter after a cutoff"
ls --color=never -1 / | head -n 3 | grep bin
```

`bin` passes both stages.

### These are BusyBox processes, not the Shell book's builtin pipe

While the script runs, ps can see sh. wasi-sh cannot fork a second ls. This guest can.

```linux run expect="sh" title="sh is in the process table"
ps | grep sh
```

The table includes `sh`.
