---
language: lua
chapter: 16
title: "Lua 文件 I/O"
level: beginner
minutes: 8
goals:
  - "知道这里不打开磁盘路径"
  - "用字符串保存一行"
  - "用 string.match 取出数字"
sources:
  - lxiy-lua
updated: "2026-10-15"
---

`io.open` 依赖真实路径。例子只处理内存里的一行。

### io.open 不运行

没有可依赖的 note.txt。

```lua norun title="不写磁盘"
local f = io.open("note.txt", "w")
f:write("tea\n")
f:close()
```

### 一行文字

名字和单价已经在字符串里。

```lua run expect="tea 18" title="一行"
local line = "tea 18"
print(line)
```

输出里能看到 `tea 18`。

### 取出数字

`string.match` 抓出末尾的整数。

```lua run expect="18" title="数字"
local line = "tea 18"
print(string.match(line, "%d+"))
```

输出里能看到 `18`。
