---
language: linux
chapter: 3
title: "Linux 云服务器"
level: beginner
minutes: 6
goals:
  - "知道云主机有公网地址"
  - "确认这台虚拟机没有网卡可用"
  - "不在页面里跑 ssh"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

云上的机器会分配地址和密钥。浏览器里的这一台没有配网卡，也到不了公网。

### 云主机会给公网地址和密钥

租用的主机通常用密钥登录，地址写在控制台。那些材料不会出现在这颗本地镜像里。

```linux run expect="buildroot" title="本地主机名"
cat /etc/hostname
```

### 这台虚拟机没有网卡

构建时没有打开 network_relay_url。df 里能看到的远程感来自九号协议目录，那是页面塞进来的文件，不是网卡。

```linux run expect="host9p" title="九号协议挂载"
df | grep mnt
```

### 登录云主机的命令不会在这里执行

ssh 需要客户机和网络。两边都没有，所以下面这段只放在书里对照。

```linux norun title="不登录远端"
ssh root@203.0.113.8
```
