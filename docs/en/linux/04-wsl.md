---
language: linux
chapter: 4
title: "Install Linux with WSL"
level: beginner
minutes: 6
goals:
  - "Treat WSL as Linux inside Windows"
  - "Confirm this guest does not go through Windows"
  - "Skip the command that enables WSL"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

WSL puts a Linux environment inside Windows. The guest on this page is simulated by v86 directly, and it does not pass through that Windows layer.

### WSL is a second Linux inside Windows

It calls the Windows virtualization interface, and its files can reach the host disks. Those drive letters do not exist on this guest.

```linux run expect="Linux" title="Still a Linux kernel"
uname
```

The kernel name is still `Linux`.

### The browser guest does not pass through Windows

CPU instructions are interpreted and compiled inside Wasm. The host may be macOS or Windows. The guest still sees the same i686 user space.

```linux run expect="i686" title="The word size stays i686"
uname -m
```

`uname -m` prints `i686`.

### Enabling WSL cannot be done from this page

`wsl.exe` and `dism` belong to Windows. A linux fence will not find either program.

```linux norun title="Do not enable WSL"
wsl --install
```
