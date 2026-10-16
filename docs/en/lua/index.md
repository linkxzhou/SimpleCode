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

```lua run expect="Hi" title="Say hello"
print("Hi")
```

The output shows `Hi`.

### A tab between items

Two arguments stay separate. A tab stands between them.

```lua run expect="tea\t18" title="A tab in the middle"
print("tea", 18)
```

The output shows `tea	18`.

### Concatenation

`..` builds one string, and that string is what `print` receives. The number is placed directly after the characters.

```lua run expect="tea18" title="Joined together"
print("tea" .. 18)
```

The output shows `tea18`.
