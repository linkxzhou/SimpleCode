---
language: lua
chapter: 12
title: "Lua Tables"
level: beginner
minutes: 8
goals:
  - "Use a string as a key"
  - "Read a field with a dot"
  - "Remove an entry from the table"
sources:
  - lxiy-lua
updated: "2026-10-16"
---

A table can work as an array or as a map. A key may be a string.

### Dot syntax

`item.name` and `item["name"]` read the same field. This table stores a name and a price.

```lua run expect="茶 18" title="Two fields"
local item = { name = "茶", price = 18 }
print(item.name .. " " .. item.price)
```

The output shows `茶 18`.

### Brackets

Use brackets when the key is held in a variable.

```lua run expect="笔" title="A variable as the key"
local item = { name = "笔" }
local key = "name"
print(item[key])
```

The output shows `笔`.

### Remove one entry

Assign `nil` to a field. That removes the key, and the test prints `无`.

```lua run expect="无" title="Already removed"
local item = { name = "茶", price = 18 }
item.price = nil
print(item.price == nil and "无" or "有")
```

The output shows `无`.
