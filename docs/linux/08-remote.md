---
language: linux
chapter: 8
title: "Linux 远程登录"
level: beginner
minutes: 6
goals:
  - "知道 ssh 连接的是另一台机器"
  - "确认镜像没有 ssh"
  - "把当前终端当成这台机器的控制台"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

远程登录把 shell 接到别的主机。这里的终端已经是这台客户机的串口，不需要再跳一次。

### ssh 把 shell 接到另一台机器

它要客户机程序、密钥和网络。三者这颗镜像都没有准备。

```linux run expect="/root" title="控制台就是当前 shell"
cd / && cd && pwd
```

### 镜像没有 ssh 客户机，也没有服务器

/bin 里是 BusyBox 的小程序。找不到 sshd，也不该在文档里启动一个听端口的进程。

```linux run expect="ash" title="命令目录里有 shell"
ls --color=never -1 /bin | grep ash
```

### 终端已经是这台机器的控制台

按键经串口进入客户机，客户机回显。页面不会再弹一个窗口。

```linux norun title="不发起远程登录"
ssh root@127.0.0.1
```
