---
language: lua
chapter: 27
title: "Lua patterns"
level: intermediate
minutes: 8
goals:
  - "Capture sku from a line"
  - "Replace every tea with gsub"
  - "Pull a quantity with %d"
sources:
  - lxiy-lua
updated: "2026-10-20"
---

Lua string patterns are not full regular expressions. %a means letters, %d means digits, and parentheses capture. Replacement goes through string.gsub.

### Pull tea out of sku=tea

The pattern sku=(%a+) captures the letters after the equals sign. string.match returns tea directly.

```lua run expect="tea" title="Capture tea"
local line = "sku=tea;qty=4"
print(string.match(line, "sku=(%a+)"))
```

### Both teas become mug

gsub replaces every match by default. tea tea becomes mug mug, and the space between them stays.

```lua run expect="mug mug" title="Become mug"
local text = string.gsub("tea tea", "tea", "mug")
print(text)
```

### The captured quantity is 4

%d+ consumes a run of digits. The trailing 4 is captured and printed. The letters do not leak into the result.

```lua run expect="4" title="Digit 4"
local line = "sku=tea;qty=4"
print(string.match(line, "qty=(%d+)"))
```

### A miss becomes nil

match returns nil when the pattern misses. tostring turns that into the line nil, so the smoke check still has a stable line.

```lua run expect="nil" title="No sku"
local found = string.match("cup", "sku=(%a+)")
print(tostring(found))
```
