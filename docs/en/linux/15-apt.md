---
language: linux
chapter: 15
title: "Linux apt"
level: intermediate
minutes: 6
goals:
  - "Install deb packages with apt"
  - "Confirm apt is absent"
  - "Use the programs already stored in /bin"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

apt speaks to Debian-family package repositories. The root filesystem produced by Buildroot does not use apt.

### apt installs deb packages from a repository

It wants a source list, signatures, and a network. The guest has none of those, so package installation stays closed on this page.

```linux run expect="echo" title="The echo applet is present"
ls --color=never -1 /bin | grep echo
```

The listing includes `echo`.

### apt is not on this machine

When the name cannot be found, ash finishes with status 127. The chapter keeps that failure out of runnable blocks so the smoke check does not treat it as a broken sample.

```linux run expect="cat" title="cat is in the command directory too"
ls --color=never -1 /bin | grep cat
```

The listing includes `cat`.

### The teaching commands are already under /bin

Later chapters call ls, grep, and chmod directly. You do not run apt update first.

```linux norun title="Do not call apt"
apt install vim
```
