---
language: lua
chapter: 25
title: "Lua _ENV"
level: intermediate
minutes: 8
goals:
  - "Swap in a private environment inside one function"
  - "Place only tonumber in the sandbox"
  - "Keep print available outside that function"
sources:
  - lxiy-lua
updated: "2026-10-20"
---

When _ENV is a local inside a function, that function sees only names stored in the table. print stays outside and is called from the outer chunk.

### tonumber inside the sandbox yields 9

The private environment holds only tonumber. The function converts the string 8 and adds 1, returning 9. print is outside the function.

```lua run expect="9" title="Yields 9"
local function sandboxed()
  local _ENV = { tonumber = tonumber }
  return tonumber("8") + 1
end
print(sandboxed())
```

### The sandbox has no print

Reading print inside the private environment produces nil. The outer tostring prints that nil, which shows the name was hidden.

```lua run expect="nil" title="print is hidden"
local function hidden()
  local _ENV = { tonumber = tonumber }
  return print
end
print(tostring(hidden()))
```

### A label you insert can be read

The environment table sets label to mug. The function returns that field and the outer print shows mug. Names left out of the table stay invisible.

```lua run expect="mug" title="Reads mug"
local function read_label()
  local _ENV = { label = "mug" }
  return label
end
print(read_label())
```

### require of another file stays unread

The interpreter cannot open a second source file. require of another module stays in a reading block. Every function in this chapter lives in the same snippet.

```lua norun title="Cannot load another file"
require("shop")
print("tea")
```
