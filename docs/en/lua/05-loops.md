---
language: lua
chapter: 5
title: "Lua Loops"
level: beginner
minutes: 8
goals:
  - "Add numbers with a numeric for"
  - "Count down with while"
  - "Stop early with break"
sources:
  - lxiy-lua
updated: "2026-10-16"
---

A numeric `for` includes both ends of the range. `while` tests its condition before each pass through the body.

### for

The loop variable runs from 1 through 3. Adding those three numbers produces 6.

```lua run expect="6" title="Sum"
local sum = 0
for i = 1, 3 do
  sum = sum + i
end
print(sum)
```

The output shows `6`.

### while

`n` starts at 3 and decreases until the test fails. The running total is 6 here as well.

```lua run expect="6" title="Count down and add"
local n = 3
local sum = 0
while n > 0 do
  sum = sum + n
  n = n - 1
end
print(sum)
```

The output shows `6`.

### break

`break` leaves the loop when `i` is 3, before that value is printed. The passes for 1 and 2 still print.

```lua run expect="1" title="The first pass"
for i = 1, 5 do
  if i == 3 then break end
  print(i)
end
```

The output shows `1`.
