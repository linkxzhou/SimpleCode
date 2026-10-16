---
language: linux
chapter: 6
title: "Linux Directory Structure"
level: beginner
minutes: 7
goals:
  - "Read paths down from the root"
  - "Tell . apart from .."
  - "Name what /bin, /etc, /tmp, and /proc store"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

A path grows downward from the slash. This image keeps commands, configuration, temporary files, and kernel interfaces in separate places. The directory names mostly match a desktop system.

### Paths grow downward from /

One slash by itself means the root. BusyBox ls colors executable names unless you ask it not to. Examples here add --color=never so the expected text stays stable.

```linux run expect="bin" title="Names at the root"
ls --color=never -1 /
```

`bin` is one of the names.

### A dot is here, and two dots are the parent

From inside /tmp, `..` climbs back to the root. Both steps can share one run when they are joined with &&.

```linux run expect="bin" title="The parent is the root"
cd /tmp && ls --color=never -1 .. | head -n 1
```

The first name in the parent is `bin`.

### /bin, /etc, /tmp, and /proc each hold one kind of file

/bin stores commands. /etc stores configuration. /tmp is a writable scratch disk. /proc is text the kernel exports. Keep your own scripts away from /mnt/main.sh, which belongs to the current Run.

```linux run expect="os-release" title="Distribution file in the config directory"
ls --color=never -1 /etc | grep os-release
```

`/etc` contains `os-release`.
