---
language: lua
chapter: 25
title: "Lua 环境"
level: intermediate
minutes: 8
goals:
  - "在函数里换上一份私有环境"
  - "只把 tonumber 放进沙箱"
  - "确认外层的 print 仍然可用"
sources:
  - lxiy-lua
updated: "2026-10-20"
---

把 _ENV 写成函数里的局部变量后，这个函数只看得见那张表里的名字。外层的 print 留在函数外面使用。

### 沙箱里的 tonumber 得到 9

私有环境只放了 tonumber。函数把字符串 8 转成数字再加 1，返回 9。print 写在函数外。

```lua run expect="9" title="得到 9"
local function sandboxed()
  local _ENV = { tonumber = tonumber }
  return tonumber("8") + 1
end
print(sandboxed())
```

### 沙箱里没有 print

在私有环境里读 print，得到的是 nil。外层用 tostring 把它打出来，确认名字被挡住了。

```lua run expect="nil" title="看不见 print"
local function hidden()
  local _ENV = { tonumber = tonumber }
  return print
end
print(tostring(hidden()))
```

### 自己放进去的 label 能读到

环境表里写上 label 为 mug。函数返回这个字段，外层打印 mug。没有放进表的名字仍然看不见。

```lua run expect="mug" title="读到 mug"
local function read_label()
  local _ENV = { label = "mug" }
  return label
end
print(read_label())
```

### 跨文件 require 不运行

解释器不能去读第二个源文件。require 别人的模块留在阅读块里，本章的函数都写在同一个片段中。

```lua norun title="不能加载别的文件"
require("shop")
print("tea")
```
