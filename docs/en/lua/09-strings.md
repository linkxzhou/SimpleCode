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

Both `#` and `string.len` count bytes. The string `你好` has length 6.

### Byte length

Each of those characters occupies three bytes in UTF-8. The length operator therefore reports 6.

```lua run expect="6" title="Six bytes"
print(#"你好")
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

```lua run expect="单价 18" title="Fill the format"
print(string.format("单价 %d", 18))
```

The output shows `单价 18`.
