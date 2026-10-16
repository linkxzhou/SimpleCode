---
language: linux
chapter: 12
title: "Linux 磁盘管理"
level: intermediate
minutes: 7
goals:
  - "用 df 看挂载点"
  - "分清 initramfs 和 9p"
  - "不运行 fdisk 或 mkfs"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

没有物理磁盘。能看到的是根上的内存文件系统，以及页面通过九号协议挂上的 /mnt。

### df 看挂载点还剩多少空间

host9p 那一行的挂载点是 /mnt。容量数字是模拟出来的，不要把整行抄进期望。

```linux run expect="host9p" title="九号协议在 df 里"
df
```

### initramfs 和 9p 是两种文件系统

mount 把类型写在 type 后面。根是 rootfs，/mnt 是 9p，传输方式是 virtio。

```linux run expect="type 9p" title="挂载类型"
mount
```

### fdisk 会改分区表

mkfs 会格式化。这台机器没有可分区的块设备给它们用，两段都标成只读。

```linux norun title="不格式化"
mkfs.ext4 /dev/sda1
```
