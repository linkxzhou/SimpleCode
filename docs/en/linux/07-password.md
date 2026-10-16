---
language: linux
chapter: 7
title: "Linux Password Recovery"
level: beginner
minutes: 6
goals:
  - "Reach the bootloader before resetting a password"
  - "Confirm this guest logs in as root"
  - "Skip passwd"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

Resetting a password from single-user mode means interrupting the boot. The inittab on this machine logs straight in as root, with no password prompt.

### A single-user reset has to reach the bootloader

On a desktop distribution you can add a single-user argument in GRUB. This snapshot is already sitting at a shell. There is no boot menu to open.

```linux run expect="root" title="The current user is root"
whoami
```

`whoami` prints `root`.

### This machine logs in as root and never asks for a password

`id` reports uid 0. No second account exists, so there is no forgotten password waiting to be reset.

```linux run expect="uid=0(root)" title="The uid is zero"
id
```

The id line includes `uid=0(root)`.

### passwd is not a runnable sample

`passwd` reads the new secret from the terminal. A docs Run feeds standard input from a file, which is a poor fit for an interactive password change.

```linux norun title="Do not change the password"
passwd
```
