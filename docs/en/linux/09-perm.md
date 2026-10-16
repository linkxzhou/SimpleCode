---
language: linux
chapter: 9
title: "Linux File Permissions"
level: beginner
minutes: 8
goals:
  - "Read the first column of ls -l"
  - "Split the nine bits into three groups"
  - "Change the mode with chmod"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

The first column of a long listing is the file type plus the permission bits. Samples live in /tmp. Modes on the 9p directory do not match an ordinary temporary disk.

### The first column of ls -l is type and mode

A leading hyphen marks a regular file. The next nine characters split into owner, group, and others. The timestamp comes from the guest clock, so leave it out of the expectation.

```linux run expect="-rw-r--r--" title="Nine bits, read-only for others"
echo hi > /tmp/mode && chmod 644 /tmp/mode && ls --color=never -l /tmp/mode
```

The mode string is `-rw-r--r--`.

### Three bits stand for owner, group, and others

755 lets the owner read, write, and execute, while everyone else may read and execute. If you omit the color switch, ls wraps the filename in escape sequences.

```linux run expect="-rwxr-xr-x" title="Execute bits added"
echo hi > /tmp/mode && chmod 755 /tmp/mode && ls --color=never -l /tmp/mode
```

The mode string is `-rwxr-xr-x`.

### chmod rewrites those nine bits

On a root-only guest, chown has no second user whose ownership you can watch change, so it stays out of the runnable block. A numeric mode writes all three groups in one step.

```linux norun title="Do not change the owner"
chown nobody /tmp/mode
```
