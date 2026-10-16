---
language: linux
chapter: 5
title: "Linux Boot Process"
level: beginner
minutes: 7
goals:
  - "Read the kernel command line"
  - "Remember the snapshot skips boot text"
  - "Skip reboot in this book"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

A cold start walks through SeaBIOS and kernel decompression. The teaching path uses a snapshot and continues from a shell prompt that is already visible.

### The kernel command line lives in /proc/cmdline

The serial console is written into that command line, so messages go to ttyS0 rather than a VGA canvas you cannot see.

```linux run expect="console=ttyS0" title="Serial console"
cat /proc/cmdline
```

The line contains `console=ttyS0`.

### The snapshot starts at the shell prompt

The save is taken after `~%` appears. Restore does not rerun BIOS, so the boot banner never floods the terminal. The quiet flag also holds back the kernel's own lines.

```linux run expect="quiet" title="The quiet flag is still set"
cat /proc/cmdline
```

The same file still contains `quiet`.

### Reboot tears this virtual machine down

`reboot` leaves the guest in a state the serial port cannot bring back. The Stop button destroys the emulator. When you need the machine again, it is restored from the snapshot.

```linux norun title="Do not reboot"
reboot
```
