---
language: lua
chapter: 24
title: "Lua metamethods"
level: intermediate
minutes: 8
goals:
  - "Fill a missing field with __index"
  - "Add two tables with __add"
  - "Choose the printed text with __tostring"
sources:
  - lxiy-lua
updated: "2026-10-20"
---

A metatable decides what a table does when a field is missing, when two tables are added, or when the table is printed. Each sample installs one metamethod.

### A missing sku reads as tea

The original table is empty. Reading sku calls __index, which returns tea. This sample only reads that one key.

```lua run expect="tea" title="Fill tea"
local mt = {
  __index = function(_, key)
    if key == "sku" then return "tea" end
  end
}
local row = setmetatable({}, mt)
print(row.sku)
```

### Adding 2 and 5 yields 7

__add receives the left and right tables and adds their n fields. The operator does not add the table identities.

```lua run expect="7" title="Sum 7"
local mt = {
  __add = function(a, b)
    return a.n + b.n
  end
}
local function box(n)
  return setmetatable({ n = n }, mt)
end
print(box(2) + box(5))
```

### Printing uses __tostring

print asks __tostring when it sees this table. The function returns cup, so the line is cup rather than an address.

```lua run expect="cup" title="Print cup"
local mt = {
  __tostring = function()
    return "cup"
  end
}
print(setmetatable({}, mt))
```

### Adding tables without a metamethod stays unread

Adding two plain tables fails at runtime. That failing sample stays out of the smoke run so one arithmetic error does not stop the chapter.

```lua norun title="Plain tables do not add"
local a = { n = 1 }
local b = { n = 2 }
print(a + b)
```
