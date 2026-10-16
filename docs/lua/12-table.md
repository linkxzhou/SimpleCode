---
language: lua
chapter: 12
title: "Lua table"
level: beginner
minutes: 8
goals:
  - "用字符串当键"
  - "用点号读取"
  - "把一项从表里拿掉"
sources:
  - lxiy-lua
updated: "2026-10-15"
---

表既可以当数组，也可以当映射。键不限于整数。

### 点号

`item.name` 和 `item["name"]` 是同一个字段。

```lua run expect="tea 18" title="两个字段"
local item = { name = "tea", price = 18 }
print(item.name .. " " .. item.price)
```

输出里能看到 `tea 18`。

### 方括号

键如果放在变量里，就用方括号。

```lua run expect="pen" title="用变量当键"
local item = { name = "pen" }
local key = "name"
print(item[key])
```

输出里能看到 `pen`。

### 删掉一项

赋成 `nil` 之后，这个键就不在了。

```lua run expect="none" title="已经删掉"
local item = { name = "tea", price = 18 }
item.price = nil
print(item.price == nil and "none" or "has")
```

输出里能看到 `none`。
