---
language: lua
chapter: 1
title: "Lua 环境安装"
level: beginner
minutes: 8
goals:
  - "知道按钮会启动 lua"
  - "不把安装命令写进脚本"
  - "先打出一行确认解释器在工作"
sources:
  - lxiy-lua
updated: "2026-10-15"
---

运行按钮已经带好解释器。脚本里只放 Lua 语句。

### 能跑的一行

这一行不依赖安装路径。

```lua run expect="ready" title="就绪"
print("ready")
```

输出里能看到 `ready`。

### 版本号不写死

课程不比较 `_VERSION` 的文字，只确认算术可用。

```lua run expect="3" title="加法"
print(1 + 2)
```

输出里能看到 `3`。

### 安装命令不是脚本

`lua` 可执行文件那一行是终端命令。

```lua norun title="不是 Lua 语句"
lua main.lua
```
