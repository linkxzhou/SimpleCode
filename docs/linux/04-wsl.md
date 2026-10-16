---
language: linux
chapter: 4
title: "WSL 安装 Linux"
level: beginner
minutes: 6
goals:
  - "知道 WSL 是 Windows 里的另一套"
  - "确认客户机不经过 Windows"
  - "不运行启用 WSL 的命令"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

WSL 把 Linux 放进 Windows。这个页面的客户机由 v86 直接模拟，不经过那一层。

### WSL 是 Windows 里的另一套 Linux

它使用 Windows 的虚拟化接口，文件系统还能和宿主盘互访。那些盘符在这里不存在。

```linux run expect="Linux" title="仍是 Linux 内核"
uname
```

### 浏览器里的客户机不经过 Windows

CPU 指令在 Wasm 里解释和编译。宿主是 macOS 还是 Windows，客人看到的都是同一份 i686 用户空间。

```linux run expect="i686" title="字长不变"
uname -m
```

### 启用 WSL 的命令无法在页面里运行

wsl.exe 和 dism 属于 Windows。写进 linux 围栏也不会找到它们。

```linux norun title="不启用 WSL"
wsl --install
```
