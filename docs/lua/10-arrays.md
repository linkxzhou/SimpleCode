---
language: lua
chapter: 10
title: "Lua 数组"
level: beginner
minutes: 8
goals:
  - "记住下标从 1 开始"
  - "用 # 看序列长度"
  - "按下标改一项"
sources:
  - lxiy-lua
updated: "2026-10-15"
---

连续整数键的表可以当数组用。第一项是 1，不是 0。

### 第一项

写在花括号里的第一段，下标是 1。

```lua run expect="tea" title="第一项"
local items = {"tea", "pen"}
print(items[1])
```

输出里能看到 `tea`。

### 长度

`#` 对这种序列给出项数。

```lua run expect="3" title="三项"
local items = {"tea", "pen", "ink"}
print(#items)
```

输出里能看到 `3`。

### 改一项

把下标 2 从 pen 改成 ink。

```lua run expect="ink" title="改掉第二项"
local items = {"tea", "pen"}
items[2] = "ink"
print(items[2])
```

输出里能看到 `ink`。
