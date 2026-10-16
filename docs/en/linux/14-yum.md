---
language: linux
chapter: 14
title: "Linux yum"
level: intermediate
minutes: 6
goals:
  - "Install RPM packages with yum"
  - "Confirm there is no repository and no network"
  - "Skip a missing command in runnable samples"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

yum fetches RPM packages from a repository. This guest has no repository and no network. The yum program itself is not under /bin.

### yum installs RPM packages from a repository

On a desktop or a server it solves dependencies, then downloads them. Those steps need a network and a package database on the root filesystem.

```linux run expect="busybox" title="The multi-call binary already on disk"
ls --color=never -1 /bin/busybox
```

`/bin/busybox` is already present.

### The image has neither a repository nor a network

Commands used for teaching were copied into /bin when the image was built. This page does not add further packages.

```linux run expect="ash" title="The shell is already installed"
ls --color=never -1 /bin/ash
```

`ls` finds `/bin/ash`.

### A missing command makes ash exit 127

Putting yum in a runnable block would leave a nonzero status, and the smoke check would count that as a failure. Read this sample. Do not execute it.

```linux norun title="Do not call yum"
yum install vim
```
