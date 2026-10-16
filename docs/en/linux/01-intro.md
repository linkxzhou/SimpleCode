---
language: linux
chapter: 1
title: "Linux Introduction"
level: beginner
minutes: 7
goals:
  - "Separate the kernel from user space"
  - "Read the BusyBox version"
  - "Read the distribution name"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

The kernel in this image owns processes and files. Day-to-day commands come from BusyBox in user space, not from a separate GNU toolchain.

### The kernel owns processes and files

`uname` names the kernel. The `ls` and `cat` you type live on the root filesystem, and the shell started by init is what finds them.

```linux run expect="Buildroot 2024.05.2" title="Distribution fields"
cat /etc/os-release
```

The file includes `Buildroot 2024.05.2`.

### These commands are BusyBox applets

A single busybox binary picks its behavior from argv[0]. The version line says 1.36.1. That tree is not the coreutils package a desktop distribution installs by itself.

```linux run expect="BusyBox v1.36.1" title="BusyBox version line"
busybox | head -n 1
```

The first line begins with `BusyBox v1.36.1`.

### Read the distribution name from /etc/os-release

The field list is shorter than on a desktop distribution. NAME and VERSION are still both there. The hostname lives in a separate file, and its text is buildroot.

```linux run expect="buildroot" title="Hostname file"
cat /etc/hostname
```

The hostname file contains `buildroot`.
