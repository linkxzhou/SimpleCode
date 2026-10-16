---
language: lua
chapter: 9
title: "Lua Strings"
level: beginner
minutes: 8
goals:
  - "Count bytes with #"
  - "Slice a string with string.sub"
  - "Format a line with string.format"
sources:
  - lxiy-lua
updated: "2026-10-16"
---

Both `#` and `string.len` count bytes. The string `Hello!` has length 6.

### Byte length

`Hello!` is six bytes long, so the length operator reports 6.

```lua run expect="6" title="Six bytes"
print(#"Hello!")
```

The output shows `6`.

### A slice

String indexes start at 1. In `buy pen`, byte 5 is where `pen` begins.

```lua run expect="pen" title="The later part"
print(string.sub("buy pen", 5))
```

The output shows `pen`.

### Formatting

`string.format` replaces `%d` with an integer. The rest of the format string stays in place.

```lua run expect="price 18" title="Fill the format"
print(string.format("price %d", 18))
```

The output shows `price 18`.
