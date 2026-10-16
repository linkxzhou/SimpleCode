---
language: lua
chapter: 14
title: "Lua Metatables"
level: beginner
minutes: 8
goals:
  - "Supply a missing field with __index"
  - "Define addition with __add"
  - "Leave an existing field unchanged"
sources:
  - lxiy-lua
updated: "2026-10-16"
---

A metatable steps in when a field lookup fails, or when an operator runs.

### A missing field

This table has no `price` of its own. Lua then reads that name from the table stored in `__index`.

```lua run expect="18" title="From the metatable"
local defaults = { price = 18 }
local item = setmetatable({}, { __index = defaults })
print(item.price)
```

The output shows `18`.

### The table's own field

`price` is already stored on the table, so `__index` is skipped. The stored value is 7.

```lua run expect="7" title="Its own 7"
local defaults = { price = 18 }
local item = setmetatable({ price = 7 }, { __index = defaults })
print(item.price)
```

The output shows `7`.

### Addition

`__add` handles the `+` operator. It adds the `n` fields and returns a new table.

```lua run expect="18" title="Add the fields"
local mt = {
  __add = function(a, b)
    return setmetatable({ n = a.n + b.n }, mt)
  end
}
local left = setmetatable({ n = 11 }, mt)
local right = setmetatable({ n = 7 }, mt)
print((left + right).n)
```

The output shows `18`.
