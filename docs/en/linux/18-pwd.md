---
language: linux
chapter: 18
title: "Linux pwd"
level: intermediate
minutes: 6
goals:
  - "Print the working directory"
  - "Follow the previous cd"
  - "Skip physical versus logical paths without a symlink"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

pwd writes the working directory to standard output. This image has almost no symbolic links, so the physical path and the logical path are the same string.

### pwd prints the working directory

Fresh from the snapshot, home is /root. After an explicit cd, pwd reports the new location.

```linux run expect="/tmp" title="The temporary directory"
cd /tmp && pwd
```

The command prints `/tmp`.

### pwd follows the cd just above it

Join the two commands with &&, or pwd never sees the change. If you split them into two docs Runs, the second Run starts in /root again.

```linux run expect="/etc" title="The configuration directory"
cd /etc && pwd
```

After that cd, pwd prints `/etc`.

### Without a symlink, physical and logical paths match

BusyBox pwd does not carry the long GNU switches you might expect on a desktop. With no symlink in the way, the printed text is the absolute path you entered.

```linux run expect="/" title="The root path"
cd / && pwd
```

At the root, pwd prints `/`.
