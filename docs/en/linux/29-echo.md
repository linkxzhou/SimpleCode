---
language: linux
chapter: 29
title: "Linux echo"
level: advanced
minutes: 6
goals:
  - "Print arguments followed by a newline"
  - "Omit the newline with -n"
  - "Keep it apart from the wasi-sh builtin"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

The echo on this guest is /bin/echo from BusyBox. The Shell book documents a wasi-sh builtin of the same name. Keep those two descriptions apart.

### echo writes its arguments and then a newline

BusyBox puts one blank between the words and finishes the line. Chinese text and a number can share that one call.

```linux run expect="tea 18" title="A blank between the words"
echo tea 18
```

The printed line is `tea 18`.

### -n leaves out the newline

The following echo continues on that same line. tea and leaf therefore sit together, with no line break between them.

```linux run expect="tealeaf" title="Two characters on one line"
echo -n tea; echo leaf
```

The printed line is `tealeaf`.

### This binary is /bin/echo, not the Shell book's builtin

Confirm the path with ls. wasi-sh provides no /bin. This guest has the file.

```linux run expect="echo" title="The file under /bin"
ls --color=never -1 /bin/echo
```

The path ends in `echo`.
