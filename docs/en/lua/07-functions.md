---
language: lua
chapter: 7
title: "Lua Functions"
level: beginner
minutes: 8
goals:
  - "Write a function that returns a value"
  - "Return two values at once"
  - "Store a function in a local variable"
sources:
  - lxiy-lua
updated: "2026-10-16"
---

A function is a value. You can name it in the definition, or store it in a variable.

### A return value

`add` returns the sum of its two arguments. The call below passes 11 and 7.

```lua run expect="18" title="Add"
local function add(a, b)
  return a + b
end
print(add(11, 7))
```

The output shows `18`.

### Several return values

`split` returns the quotient and the remainder together. Two locals at the call catch those results.

```lua run expect="3 1" title="Quotient and remainder"
local function split(n)
  return n // 2, n % 2
end
local q, r = split(7)
print(q .. " " .. r)
```

The output shows `3 1`.

### An anonymous function

The expression builds a function, and the assignment stores it in `twice`. A call multiplies its argument by 2.

```lua run expect="18" title="Times two"
local twice = function(n)
  return n * 2
end
print(twice(9))
```

The output shows `18`.
