---
language: lua
chapter: 11
title: "Lua 迭代器"
level: beginner
minutes: 8
goals:
  - "用 ipairs 走过数组"
  - "用 pairs 走过全部键"
  - "自己写一个只产生两次的迭代器"
sources:
  - lxiy-lua
updated: "2026-10-15"
---

迭代器每次交出下一项。`ipairs` 从 1 走到序列结束。

### ipairs

按 1、2 的顺序打出名字。

```lua run expect="teapen" title="按顺序"
local items = {"tea", "pen"}
local out = ""
for _, name in ipairs(items) do
  out = out .. name
end
print(out)
```

输出里能看到 `teapen`。

### pairs

键是名字时，`pairs` 能把它交出来。这里只有一个键。

```lua run expect="name=tea" title="一个键"
local item = { name = "tea" }
for key, value in pairs(item) do
  print(key .. "=" .. value)
end
```

输出里能看到 `name=tea`。

### 手写迭代器

闭包记住已经交到哪一次，第三次就结束。

```lua run expect="tea" title="只交一次"
local function once()
  local i = 0
  return function()
    i = i + 1
    if i == 1 then return "tea" end
  end
end
local out = ""
for name in once() do
  out = out .. name
end
print(out)
```

输出里能看到 `tea`。
