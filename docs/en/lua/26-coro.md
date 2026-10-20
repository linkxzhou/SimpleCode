---
language: lua
chapter: 26
title: "Lua coroutines"
level: intermediate
minutes: 8
goals:
  - "Yield two strings"
  - "Join the two yielded values"
  - "See what resume returns after the coroutine finishes"
sources:
  - lxiy-lua
updated: "2026-10-20"
---

A coroutine pauses a function at yield. The caller takes one value back on each resume. There is no network and no real thread here.

### Yield tea and then cup

The coroutine yields tea and then cup. The two results are joined with .. into teacup and printed once.

```lua run expect="teacup" title="Join teacup"
local co = coroutine.create(function()
  coroutine.yield("tea")
  coroutine.yield("cup")
end)
local _, a = coroutine.resume(co)
local _, b = coroutine.resume(co)
print(a .. b)
```

### The first value taken out is 4

The producer yields 4 first. The caller resumes only once, so the line is 4. The later 9 stays inside the coroutine.

```lua run expect="4" title="Take 4 first"
local co = coroutine.create(function()
  coroutine.yield(4)
  coroutine.yield(9)
end)
local _, n = coroutine.resume(co)
print(n)
```

### resume is false after the end

After the coroutine function returns, another resume yields false as its first result. This sample prints only that boolean.

```lua run expect="false" title="Already finished"
local co = coroutine.create(function()
  return "done"
end)
coroutine.resume(co)
local ok = coroutine.resume(co)
print(ok)
```

### Two yielded numbers add to 6

The first yield is 1 and the second is 5. The caller adds them and prints 6. The coroutine only supplies the numbers in order.

```lua run expect="6" title="Sum 6"
local co = coroutine.create(function()
  coroutine.yield(1)
  coroutine.yield(5)
end)
local _, a = coroutine.resume(co)
local _, b = coroutine.resume(co)
print(a + b)
```
