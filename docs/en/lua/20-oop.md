---
language: lua
chapter: 20
title: "Lua Object-Oriented Programming"
level: beginner
minutes: 8
goals:
  - "Store a price in a table"
  - "Call a method with a colon"
  - "Share methods through a metatable"
sources:
  - lxiy-lua
updated: "2026-10-16"
---

Lua has no `class` keyword. Data and methods both live in tables.

### A colon call

The colon passes the table itself as `self`. `pen:price()` therefore reads `pen.n`.

```lua run expect="18" title="Its own price"
local pen = { n = 18 }
function pen:price()
  return self.n
end
print(pen:price())
```

The output shows `18`.

### A prototype

`Item.new` returns a fresh table whose metatable is `Item`. Method lookup follows `__index`.

```lua run expect="18" title="From the prototype"
local Item = {}
Item.__index = Item
function Item.new(price)
  return setmetatable({ n = price }, Item)
end
function Item:price()
  return self.n
end
local pen = Item.new(18)
print(pen:price())
```

The output shows `18`.

### Two pens

Each table keeps its own `n`. Calling `price` on one table reads only that table's field.

```lua run expect="12 18" title="Independent fields"
local Item = {}
Item.__index = Item
function Item.new(price)
  return setmetatable({ n = price }, Item)
end
function Item:price()
  return self.n
end
local a = Item.new(12)
local b = Item.new(18)
print(a:price() .. " " .. b:price())
```

The output shows `12 18`.
