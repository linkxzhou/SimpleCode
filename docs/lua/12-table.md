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

```lua run expect="茶 18" title="两个字段"
local item = { name = "茶", price = 18 }
print(item.name .. " " .. item.price)
```

输出里能看到 `茶 18`。

### 方括号

键如果放在变量里，就用方括号。

```lua run expect="笔" title="用变量当键"
local item = { name = "笔" }
local key = "name"
print(item[key])
```

输出里能看到 `笔`。

### 删掉一项

赋成 `nil` 之后，这个键就不在了。

```lua run expect="无" title="已经删掉"
local item = { name = "茶", price = 18 }
item.price = nil
print(item.price == nil and "无" or "有")
```

输出里能看到 `无`。
