---
language: lua
chapter: 23
title: "Lua varargs"
level: intermediate
minutes: 8
goals:
  - "Remember the argument count with table.pack"
  - "Take the last value with select"
  - "Place a fixed parameter before the rest"
sources:
  - lxiy-lua
updated: "2026-10-20"
---

Three dots on a function collect the extra values from the call. table.pack records how many arrived, and select can skip the earlier ones.

### Three arguments report 3

table.pack stores the passed values and sets field n to the count. Passing a, b, and c makes n equal 3.

```lua run expect="3" title="Count 3"
local function count(...)
  local packed = table.pack(...)
  return packed.n
end
print(count("a", "b", "c"))
```

### The last value is mug

select returns values from a chosen index through the end. When the index equals the count, only the final string mug remains.

```lua run expect="mug" title="Final mug"
local function last(...)
  local n = select("#", ...)
  return select(n, ...)
end
print(last("a", "b", "mug"))
```

### A fixed sku and then two more

The first name is an ordinary parameter. The rest fall into the dots. pack.n counts only that rest, so it is 2.

```lua run expect="2" title="Two left"
local function rest(sku, ...)
  local packed = table.pack(...)
  return packed.n
end
print(rest("tea", "cup", "mug"))
```

### An empty call has count 0

When the call passes nothing, pack.n is 0. Printing that 0 shows the dots still produce a pack on an empty call.

```lua run expect="0" title="Empty is 0"
local function count(...)
  return table.pack(...).n
end
print(count())
```
