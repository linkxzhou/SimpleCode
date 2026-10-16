---
language: lua
chapter: 8
title: "Lua Operators"
level: beginner
minutes: 8
goals:
  - "Tell / apart from //"
  - "Compute a remainder"
  - "Join values with .."
sources:
  - lxiy-lua
updated: "2026-10-16"
---

The operator `/` produces a fractional quotient. The operator `//` produces an integer quotient. `..` joins values into one string.

### Two kinds of division

Dividing 7 by 2 with `/` yields 3.5. The integer quotient of the same pair is 3.

```lua run expect="3.5" title="The fraction comes first"
print(7 / 2)
print(7 // 2)
```

The output shows `3.5`.

### Remainder

The `%` operator keeps what is left after division. Dividing 7 by 2 leaves 1.

```lua run expect="1" title="Remainder"
print(7 % 2)
```

The output shows `1`.

### Comparison

`==` asks whether the two sides are equal. When `price` is 18, the first branch runs.

```lua run expect="yes" title="Equal"
local price = 18
if price == 18 then
  print("yes")
else
  print("no")
end
```

The output shows `yes`.
