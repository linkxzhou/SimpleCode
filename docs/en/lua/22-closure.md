---
language: lua
chapter: 22
title: "Lua closures"
level: intermediate
minutes: 8
goals:
  - "Return a function that keeps an outer number"
  - "Advance a private counter on each call"
  - "Leave os.execute unread"
sources:
  - lxiy-lua
updated: "2026-10-20"
---

A returned function keeps locals from the function that built it. These samples add, count, and multiply, and they never ask the host to launch a process.

### Add 4 onto an outer 3

adder stores the base 3. The returned function receives 4 and prints 7. That base remains an upvalue, not a global.

```lua run expect="7" title="Outer base 3"
local function adder(base)
  return function(step)
    return base + step
  end
end
local add3 = adder(3)
print(add3(4))
```

### The second call prints 2

The hidden counter starts at 0. The first call only changes n to 1. The second call is the one that prints 2.

```lua run expect="2" title="Count to 2"
local function counter()
  local n = 0
  return function()
    n = n + 1
    return n
  end
end
local nextn = counter()
nextn()
print(nextn())
```

### Factor 5 applied to 2

scale remembers the factor 5 and the returned function is called at once with 2. The product 10 shows the upvalue is still alive.

```lua run expect="10" title="Product 10"
local function scale(k)
  return function(n)
    return n * k
  end
end
print(scale(5)(2))
```

### Keep the process call unread

This interpreter is not wired to a process launcher. os.execute sits in a block that is not executed, so the smoke run does not wait on a missing process.

```lua norun title="No process"
os.execute("echo tea")
```
