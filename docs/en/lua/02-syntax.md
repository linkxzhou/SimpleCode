---
language: lua
chapter: 2
title: "Lua Basic Syntax"
level: beginner
minutes: 8
goals:
  - "Leave the semicolon off a statement"
  - "Write a comment with --"
  - "Wrap a block with do"
sources:
  - lxiy-lua
updated: "2026-10-16"
---

Lua ends a statement at the line break. A semicolon is optional.

### Two lines

Each `print` stands on its own line.

```lua run expect="甲" title="The first line"
print("甲")
print("乙")
```

The output shows `甲`.

### Comments

Two hyphens start a comment. The `print` on that line is skipped.

```lua run expect="留下" title="Skip the comment"
-- print("隐藏")
print("留下")
```

The output shows `留下`.

### A block

`do` and `end` wrap a block. A local declared inside the block ends at `end`. The name `n` sits outside, so it keeps the updated value.

```lua run expect="3" title="Add 2"
local n = 1
do
  local extra = 2
  n = n + extra
end
print(n)
```

The output shows `3`.
