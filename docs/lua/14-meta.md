---
language: lua
chapter: 14
title: "Lua 元表"
level: beginner
minutes: 8
goals:
  - "用 __index 提供缺少的字段"
  - "用 __add 定义相加"
  - "知道元表不改变已有字段"
sources:
  - lxiy-lua
updated: "2026-10-15"
---

元表在查找失败或运算符发生时插入自己的规则。

### 缺少的字段

表自己没有 `price` 时，去 `__index` 里找。

```lua run expect="18" title="从元表来"
local defaults = { price = 18 }
local item = setmetatable({}, { __index = defaults })
print(item.price)
```

输出里能看到 `18`。

### 自己的字段优先

表里已经有 `price` 时，不再问元表。

```lua run expect="7" title="自己的 7"
local defaults = { price = 18 }
local item = setmetatable({ price = 7 }, { __index = defaults })
print(item.price)
```

输出里能看到 `7`。

### 相加

`__add` 让两个表按字段相加。

```lua run expect="18" title="字段相加"
local mt = {
  __add = function(a, b)
    return setmetatable({ n = a.n + b.n }, mt)
  end
}
local left = setmetatable({ n = 11 }, mt)
local right = setmetatable({ n = 7 }, mt)
print((left + right).n)
```

输出里能看到 `18`。
