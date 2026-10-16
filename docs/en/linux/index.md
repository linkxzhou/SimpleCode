---
language: linux
chapter: 0
title: "Linux Tutorial"
minutes: 8
goals:
  - "Find Linux in the sidebar"
  - "Read the kernel name with uname"
  - "Keep Shell and this guest separate"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

Linux in the sidebar is an i686 guest. Its serial console is the terminal under the editor. The neighboring Shell entry still runs wasi-sh, and neither runtime steps into the other.

### A 32-bit guest runs in the browser

After Run, the editor script is written to `/mnt/main.sh` over the 9p protocol, then BusyBox ash executes it. The guest is given 64MiB. A 32MiB machine cannot hold this already-uncompressed 6.8 kernel.

```linux run expect="Linux" title="Kernel name"
uname
```

`uname` prints `Linux`.

### Linux and Shell keep separate runtimes

The fence language has to be linux. A fence marked sh or bash enters wasi-sh, where no external command exists. Here, ls is a BusyBox applet stored under /bin.

```linux run expect="i686" title="Machine word size"
uname -m
```

The word size is `i686`.

### Type commands in the terminal

The snapshot stops at the prompt `~%`. Each Run in these chapters reopens that snapshot, so a directory change inside a script does not carry into the next Run. Commands you type in the terminal remain until the next Run or Stop.

```linux run expect="6.8.12" title="Kernel release"
uname -r
```

The release string is `6.8.12`.
