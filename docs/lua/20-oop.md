---
language: lua
chapter: 20
title: "Lua 面向对象"
level: beginner
minutes: 8
goals:
  - "用表保存单价"
  - "用冒号调用方法"
  - "用元表复用方法"
sources:
  - lxiy-lua
updated: "2026-10-15"
---

Lua 没有 class 关键字。方法和数据都放在表里。

### 冒号

`pen:price()` 会把 `pen` 自己传进方法。

```lua run expect="18" title="自己的单价"
local pen = { n = 18 }
function pen:price()
  return self.n
end
print(pen:price())
```

输出里能看到 `18`。

### 原型

`new` 做一张新表，方法放在元表的 `__index` 里。

```lua run expect="18" title="从原型来"
local Item = {}
Item.__index = Item
function Item.new(price)
  return setmetatable({ n = price }, Item)
end
function Item:price()
  return self.n
end
local pen = Item.new(18)
print(pen:price())
```

输出里能看到 `18`。

### 两支笔

两张表的字段互不影响。

```lua run expect="12 18" title="互不影响"
local Item = {}
Item.__index = Item
function Item.new(price)
  return setmetatable({ n = price }, Item)
end
function Item:price()
  return self.n
end
local a = Item.new(12)
local b = Item.new(18)
print(a:price() .. " " .. b:price())
```

输出里能看到 `12 18`。
