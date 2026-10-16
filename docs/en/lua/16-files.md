---
language: lua
chapter: 16
title: "Lua File I/O"
level: beginner
minutes: 8
goals:
  - "Leave disk paths unopened"
  - "Keep one line in a string"
  - "Take a number with string.match"
sources:
  - lxiy-lua
updated: "2026-10-16"
---

`io.open` depends on a real filesystem path. The runnable examples keep a single line in a string.

### io.open does not run

The lesson has no file named `note.txt`.

```lua norun title="Do not write to disk"
local f = io.open("note.txt", "w")
f:write("tea\n")
f:close()
```

This block is not run.

### One line of text

The name and the price are already stored in the string.

```lua run expect="tea 18" title="One line"
local line = "tea 18"
print(line)
```

The output shows `tea 18`.

### Take the number

`string.match` with the pattern `%d+` captures the integer at the end of the line.

```lua run expect="18" title="The number"
local line = "tea 18"
print(string.match(line, "%d+"))
```

The output shows `18`.
