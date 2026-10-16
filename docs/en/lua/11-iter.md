---
language: lua
chapter: 11
title: "Lua Iterators"
level: beginner
minutes: 8
goals:
  - "Walk an array with ipairs"
  - "Walk every key with pairs"
  - "Write an iterator that yields one value"
sources:
  - lxiy-lua
updated: "2026-10-16"
---

Each call of an iterator produces the next item. `ipairs` walks a sequence from index 1 through the last item.

### ipairs

The loop visits index 1 and then index 2. The names are joined into one string.

```lua run expect="teapen" title="In order"
local items = {"tea", "pen"}
local out = ""
for _, name in ipairs(items) do
  out = out .. name
end
print(out)
```

The output shows `teapen`.

### pairs

`pairs` yields each key together with its value. This table contains a single key.

```lua run expect="name=tea" title="One key"
local item = { name = "tea" }
for key, value in pairs(item) do
  print(key .. "=" .. value)
end
```

The output shows `name=tea`.

### A handwritten iterator

The inner function counts its own calls. The first call returns `tea`. The next call returns nothing, and the loop stops.

```lua run expect="tea" title="Hand over once"
local function once()
  local i = 0
  return function()
    i = i + 1
    if i == 1 then return "tea" end
  end
end
local out = ""
for name in once() do
  out = out .. name
end
print(out)
```

The output shows `tea`.
