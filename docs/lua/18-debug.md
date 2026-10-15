---
language: lua
chapter: 18
title: "Lua 调试"
level: beginner
minutes: 8
goals:
  - "用 debug.getinfo 看函数名"
  - "看当前行号"
  - "不依赖调试器界面"
sources:
  - lxiy-lua
updated: "2026-10-15"
---

调试库能看当前函数。这里没有单独的调试器窗口。

### 函数名

`getinfo` 的 `n` 给出正在执行的函数名。

```lua run expect="label" title="名字"
local function label()
  local info = debug.getinfo(1, "n")
  print(info.name)
end
label()
```

输出里能看到 `label`。

### 行号

`currentline` 落在调用 `getinfo` 的那一行，这个文件里是第 1 行。

```lua run expect="1" title="第一行"
local info = debug.getinfo(1, "l")
print(info.currentline)
```

输出里能看到 `1`。

### 源文件名

`source` 以 `@` 开头时表示来自文件。这里只确认它不是空的。

```lua run expect="string" title="有来源"
local info = debug.getinfo(1, "S")
print(type(info.source))
```

输出里能看到 `string`。
