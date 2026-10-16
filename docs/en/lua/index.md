---
language: lua
chapter: 0
title: "Lua Tutorial"
minutes: 8
goals:
  - "Print one line"
  - "Notice the tab between items"
  - "Join two pieces with .."
sources:
  - lxiy-lua
updated: "2026-10-16"
---

This tutorial runs one file at a time under Lua 5.4. `print` places a tab between its arguments. Use `..` when the pieces should sit next to each other.

### The first line

`print` writes its argument and then a newline.

```lua run expect="你好" title="Say hello"
print("你好")
```

The output shows `你好`.

### A tab between items

Two arguments stay separate. A tab stands between them.

```lua run expect="茶	18" title="A tab in the middle"
print("茶", 18)
```

The output shows `茶	18`.

### Concatenation

`..` builds one string, and that string is what `print` receives. The number is placed directly after the characters.

```lua run expect="茶18" title="Joined together"
print("茶" .. 18)
```

The output shows `茶18`.
