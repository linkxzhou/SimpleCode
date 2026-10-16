---
language: linux
chapter: 10
title: "Linux File and Directory Management"
level: beginner
minutes: 8
goals:
  - "Write an absolute path"
  - "Reshape the tree with mkdir, cp, mv, and rm"
  - "Keep cd with the commands that follow"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

An absolute path begins at the slash. Every docs Run returns to the snapshot, so a directory change and the commands after it belong on one chain.

### An absolute path begins at /

`/tmp/box` does not depend on where you were. A relative path follows the previous cd, which one Run by itself cannot show.

```linux run expect="/tmp/box" title="Enter the new directory"
mkdir /tmp/box && cd /tmp/box && pwd
```

`pwd` prints `/tmp/box`.

### mkdir, cp, mv, and rm reshape the tree

Copy `/etc/hostname` into the working directory and ls should list that name. These programs are BusyBox applets outside the shell. They are not wasi-sh builtins.

```linux run expect="hostname" title="Copy the hostname file"
mkdir -p /tmp/box && cd /tmp/box && cp /etc/hostname . && ls --color=never -1
```

The listing contains `hostname`.

### cd applies only to the current command chain

A cd typed by itself in the interactive terminal stays in that virtual machine until the next Run restores the snapshot. Samples in this chapter do not rely on that leftover directory.

```linux run expect="/tmp" title="The chain ends in /tmp"
cd / && cd /tmp && pwd
```

The chain finishes in `/tmp`.
