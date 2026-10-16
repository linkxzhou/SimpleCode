---
language: linux
chapter: 2
title: "Linux Installation"
level: beginner
minutes: 6
goals:
  - "Remember the page writes no disk"
  - "See the root directory already present"
  - "Skip fdisk as a runnable example"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

The guest root is an initramfs held in memory. This page never partitions a drive, and it never writes a system onto your disk.

### The page does not partition or write a disk

The first time you open Linux, the emulator and the snapshot are downloaded. When that finishes, you are already in a shell. No installer wizard sits in between.

```linux run expect="i686" title="Confirm 32-bit"
uname -m
```

The architecture line is `i686`.

### The first Run downloads the kernel and the snapshot

While files arrive, the sidebar shows a percentage. Snapshot restore changes that label to a starting state. A later refresh is served from the Cache API, so those tens of megabytes stay local.

```linux run expect="bin" title="First name on the root"
ls --color=never -1 / | head -n 1
```

The first name on `/` is `bin`.

### No install program matches these commands

`fdisk` would rewrite a partition table. This image does not ship that program. The sample is only for reading, so the docs smoke run does not sit waiting for a command that is absent.

```linux norun title="Do not partition"
fdisk -l
```
