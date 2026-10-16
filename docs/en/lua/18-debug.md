---
language: lua
chapter: 18
title: "Lua Debugging"
level: beginner
minutes: 8
goals:
  - "Read a function name with debug.getinfo"
  - "Read the current line number"
  - "Work without a debugger window"
sources:
  - lxiy-lua
updated: "2026-10-16"
---

`debug.getinfo` describes the function that is running. These pages have no separate debugger window.

### The function name

The `n` option requests the function's name. Called inside `label`, it reports that name.

```lua run expect="label" title="The name"
local function label()
  local info = debug.getinfo(1, "n")
  print(info.name)
end
label()
```

The output shows `label`.

### The line number

`currentline` is the line where `getinfo` runs. In this script that call is line 1.

```lua run expect="1" title="Line 1"
local info = debug.getinfo(1, "l")
print(info.currentline)
```

The output shows `1`.

### The source name

A `source` value that begins with `@` was loaded from a file. This script prints the type of that field.

```lua run expect="string" title="A source is present"
local info = debug.getinfo(1, "S")
print(type(info.source))
```

The output shows `string`.
