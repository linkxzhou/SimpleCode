---
language: linux
chapter: 8
title: "Linux Remote Login"
level: beginner
minutes: 6
goals:
  - "Remember ssh reaches another machine"
  - "Confirm this image has no ssh"
  - "Treat this terminal as the guest console"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

Remote login attaches a shell to some other host. The terminal on this page is already the guest serial port, so there is no extra hop.

### ssh attaches a shell to another machine

It needs a client program, a key, and a network. This image prepared none of those three.

```linux run expect="/root" title="The console is the current shell"
cd / && cd && pwd
```

A bare `cd` lands in `/root`.

### The image ships neither an ssh client nor a server

/bin holds BusyBox applets. sshd is missing, and a chapter should not start a process that listens on a port.

```linux run expect="ash" title="The command directory contains ash"
ls --color=never -1 /bin | grep ash
```

`ash` is present under `/bin`.

### This terminal is already the machine console

Keystrokes travel in through the serial port, and the guest echoes them back. The page does not open a second window.

```linux norun title="Do not start a remote login"
ssh root@127.0.0.1
```
