---
language: lua
chapter: 28
title: "Lua concatenation"
level: intermediate
minutes: 8
goals:
  - "Join three parts with table.concat"
  - "Fill a table in a loop and then concatenate"
  - "Accumulate a small sum in a local"
sources:
  - lxiy-lua
updated: "2026-10-20"
---

Joining with .. over and over builds a new string each time. Putting the pieces in a table and calling table.concat once is the direct form. The numeric loop uses a local.

### Three parts become tea-cup

The table holds tea and then cup. concat joins them with a hyphen into the single line tea-cup.

```lua run expect="tea-cup" title="Join tea-cup"
local parts = { "tea", "cup" }
print(table.concat(parts, "-"))
```

### A loop stores three a marks

The loop runs three times and stores a on each pass. concat then joins the marks into a-a-a.

```lua run expect="a-a-a" title="Three a marks"
local parts = {}
for i = 1, 3 do
  parts[i] = "a"
end
print(table.concat(parts, "-"))
```

### The sum from 1 through 4 is 10

The local n starts at 0 and adds 1, 2, 3, and 4. The line is 10. No global holds the running sum.

```lua run expect="10" title="Sum is 10"
local n = 0
for i = 1, 4 do
  n = n + i
end
print(n)
```

### A timer call stays unread

os.clock is not stable on this page, so a chapter cannot expect a number of seconds. The reading block only names the function.

```lua norun title="Do not compare seconds"
print(os.clock())
```
