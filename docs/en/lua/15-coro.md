---
language: lua
chapter: 15
title: "Lua Coroutines"
level: beginner
minutes: 8
goals:
  - "Hand over a value with yield"
  - "Take it back with resume"
  - "Resume again for the return value"
sources:
  - lxiy-lua
updated: "2026-10-16"
---

A coroutine pauses the function at `coroutine.yield`. A later `resume` continues from that pause.

### The first resume

`resume` returns a success flag, then the value passed to `yield`. That value is 2.

```lua run expect="2" title="Hand over 2 first"
local co = coroutine.create(function()
  coroutine.yield(2)
  return 8
end)
local _, v = coroutine.resume(co)
print(v)
```

The output shows `2`.

### The second resume

After the yield, the function returns 8. The next `resume` delivers that return value.

```lua run expect="8" title="Then 8"
local co = coroutine.create(function()
  coroutine.yield(2)
  return 8
end)
coroutine.resume(co)
local _, v = coroutine.resume(co)
print(v)
```

The output shows `8`.

### Status

Until the function finishes, `coroutine.status` reports `suspended`.

```lua run expect="suspended" title="Still paused"
local co = coroutine.create(function()
  coroutine.yield(1)
end)
coroutine.resume(co)
print(coroutine.status(co))
```

The output shows `suspended`.
