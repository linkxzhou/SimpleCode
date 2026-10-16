---
language: lua
chapter: 4
title: "Lua Variables"
level: beginner
minutes: 8
goals:
  - "Limit a name with local"
  - "Assign a new value to the same name"
  - "Treat a name without local as global"
sources:
  - lxiy-lua
updated: "2026-10-16"
---

Prefer `local` for names in these lessons. Without `local`, a name is stored in the global table.

### A local variable

`local` stores 18 under the name `price`. The next statement reads that name back.

```lua run expect="18" title="Unit price"
local price = 18
print(price)
```

The output shows `18`.

### Assign again

A later assignment replaces the number in the same local. After that, `n` holds 4.

```lua run expect="4" title="Change it to 4"
local n = 1
n = 4
print(n)
```

The output shows `4`.

### A global name

Without `local`, the assignment writes the global table. The name can still be read on the next line.

```lua run expect="笔" title="Global"
item = "笔"
print(item)
```

The output shows `笔`.
