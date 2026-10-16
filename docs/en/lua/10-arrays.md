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

```lua run expect="tea" title="The first item"
local items = {"tea", "pen"}
print(items[1])
```

The output shows `tea`.

### Length

On a sequence with no gaps, `#` returns the number of items.

```lua run expect="3" title="Three items"
local items = {"tea", "pen", "ink"}
print(#items)
```

The output shows `3`.

### Change one item

An assignment to index 2 replaces `pen` with `ink`.

```lua run expect="ink" title="Replace the second item"
local items = {"tea", "pen"}
items[2] = "ink"
print(items[2])
```

The output shows `ink`.
