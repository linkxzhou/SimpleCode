---
language: linux
chapter: 12
title: "Linux Disk Management"
level: intermediate
minutes: 7
goals:
  - "Inspect mount points with df"
  - "Separate initramfs from 9p"
  - "Skip fdisk and mkfs"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

There is no physical disk. You can see an in-memory filesystem at the root, plus /mnt, which the page attaches through the 9p protocol.

### df reports free space on each mount

The host9p row is mounted at /mnt. The capacity figures are simulated, so do not paste the whole row into the expectation.

```linux run expect="host9p" title="9p inside df"
df
```

One row is labeled `host9p`.

### initramfs and 9p are different filesystems

mount writes the type after the word type. The root is rootfs. /mnt is 9p, and the transport is virtio.

```linux run expect="type 9p" title="Mount type"
mount
```

The mount table includes `type 9p`.

### fdisk would rewrite a partition table

mkfs would format a volume. This guest has no block device either tool can partition. Both samples are marked read-only.

```linux norun title="Do not format"
mkfs.ext4 /dev/sda1
```
