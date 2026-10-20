---
language: linux
chapter: 30
title: "Linux find"
level: intermediate
minutes: 8
goals:
  - "Find note.txt by name"
  - "List only directories"
  - "Print none when the target is missing"
sources:
  - v86-buildroot
updated: "2026-10-20"
---

find walks down from the directory you name. Files live under /tmp so they stay away from system directories. -name selects a file name, and -type d selects directories.

### Find note.txt by name

note.txt is written under /tmp/nest/inner first. find -name prints the full path, and the expected text is that path.

```linux run expect="/tmp/nest/inner/note.txt" title="Find the note"
mkdir -p /tmp/nest/inner
printf 'tea\n' > /tmp/nest/inner/note.txt
find /tmp/nest -name note.txt
```

### See only the directory inner

A second query uses -type d. The name inner is in the output. The file note.txt does not appear on this command.

```linux run expect="inner" title="Directories only"
mkdir -p /tmp/nest/inner
find /tmp/nest -type d
```

### A missing directory prints none

/tmp/no-such-nest does not exist. After find fails, || prints none, and the script still exits 0.

```linux run expect="none" title="No such directory"
find /tmp/no-such-nest -name note.txt || echo none
```

### Find a regular file by type

-type f keeps regular files. The path still contains note.txt.

```linux run expect="note.txt" title="Regular file"
mkdir -p /tmp/nest/inner
printf 'tea\n' > /tmp/nest/inner/note.txt
find /tmp/nest -type f
```
