---
language: lua
chapter: 13
title: "Lua Modules and Packages"
level: beginner
minutes: 8
goals:
  - "Skip require for another file"
  - "Write the function in the same file"
  - "Call that function and check the result"
sources:
  - lxiy-lua
updated: "2026-10-16"
---

`require` searches for a separate file. This lesson provides only the current script.

### require does not run

There is no module file named `shop`.

```lua norun title="No module"
local shop = require("shop")
print(shop.price)
```

This block is not run.

### The same file

The function is defined in this script and called directly. Its body returns 18.

```lua run expect="18" title="The same file"
local function price()
  return 18
end
print(price())
```

The output shows `18`.

### A function on a table

A table in this file can hold the function. `rate` returns 2, and multiplying that result by 9 gives 18.

```lua run expect="18" title="A function in the table"
local shop = {}
function shop.rate()
  return 2
end
print(shop.rate() * 9)
```

The output shows `18`.
