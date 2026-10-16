---
language: lua
chapter: 10
title: "Lua Arrays"
level: beginner
minutes: 8
goals:
  - "Start indexes at 1"
  - "Read a sequence length with #"
  - "Replace an item by index"
sources:
  - lxiy-lua
updated: "2026-10-16"
---

Consecutive integer keys let a table act as an array. The first item is stored at index 1.

### The first item

The first value written inside the braces receives index 1.

```lua run expect="茶" title="The first item"
local items = {"茶", "笔"}
print(items[1])
```

The output shows `茶`.

### Length

On a sequence with no gaps, `#` returns the number of items.

```lua run expect="3" title="Three items"
local items = {"茶", "笔", "墨"}
print(#items)
```

The output shows `3`.

### Change one item

An assignment to index 2 replaces `笔` with `墨`.

```lua run expect="墨" title="Replace the second item"
local items = {"茶", "笔"}
items[2] = "墨"
print(items[2])
```

The output shows `墨`.
