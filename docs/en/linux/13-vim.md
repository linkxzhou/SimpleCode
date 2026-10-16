---
language: linux
chapter: 13
title: "Linux vi/vim"
level: intermediate
minutes: 6
goals:
  - "Treat vi as a full-screen editor"
  - "Confirm vim is absent from the image"
  - "Edit files with redirection"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

A full-screen editor holds the terminal until you leave it. A docs Run has to finish on its own, so file edits use redirection instead of vi.

### vi edits inside the terminal

It changes modes and redraws the whole screen. A serial docs run cannot wait for a normal exit status, so BusyBox vi is not offered as a runnable sample.

```linux run expect="便签" title="Write one line by redirection"
echo 便签 > /tmp/note && cat /tmp/note
```

The file contains `便签`.

### This image does not include vim

A complete vim binary is large, and this Buildroot config does not contain it. To look at a file, use cat or head.

```linux run expect="便签" title="Read that file back"
echo 便签 > /tmp/note && cat /tmp/note
```

`cat` prints `便签` again.

### Chapters edit files with redirection, not a full-screen editor

The command below is only for side-by-side reading. If it were runnable, the smoke check would stop inside the full-screen interface.

```linux norun title="Do not open vim"
vim /tmp/note
```
