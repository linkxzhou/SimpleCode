---
language: linux
chapter: 3
title: "Linux Cloud Servers"
level: beginner
minutes: 6
goals:
  - "Remember a cloud host has a public address"
  - "Confirm this guest has no usable network card"
  - "Skip ssh on this page"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

A cloud machine is assigned an address and a key. The guest in this browser has no network card, and it cannot reach the public internet.

### A cloud host is given a public address and a key

A rented machine usually accepts a key for login. The address is shown in the provider console. None of that material is stored in this local image.

```linux run expect="buildroot" title="Local hostname"
cat /etc/hostname
```

This guest calls itself `buildroot`.

### This virtual machine has no network card

The image build left network_relay_url unset. The remote-looking row in df is the 9p directory. The page pushed those files in. They are not a network interface.

```linux run expect="host9p" title="9p mount"
df | grep mnt
```

`df` shows the `host9p` mount.

### The cloud login command is not run here

`ssh` needs both a client and a network. This guest has neither, so the next sample stays in the chapter for comparison.

```linux norun title="Do not log in remotely"
ssh root@203.0.113.8
```
