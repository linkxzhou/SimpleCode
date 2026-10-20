---
language: lua
chapter: 23
title: "Lua 可变参数"
level: intermediate
minutes: 8
goals:
  - "用 table.pack 记住参数个数"
  - "用 select 取最后一个"
  - "固定参数后面再接一串"
sources:
  - lxiy-lua
updated: "2026-10-20"
---

函数名后面的三个点收集调用时多出来的值。table.pack 会记下个数，select 可以跳过前面的几个。

### 三个参数的个数是 3

table.pack 把传入的值收进一张表，字段 n 是个数。这里传入 a、b、c，所以 n 是 3。

```lua run expect="3" title="个数 3"
local function count(...)
  local packed = table.pack(...)
  return packed.n
end
print(count("a", "b", "c"))
```

### 最后一个是 mug

select 从指定位置取到末尾。位置等于个数时，只剩下最后那一个字符串 mug。

```lua run expect="mug" title="末尾 mug"
local function last(...)
  local n = select("#", ...)
  return select(n, ...)
end
print(last("a", "b", "mug"))
```

### 固定的 sku 后面还有两个

第一个名字写成普通参数，其余交给三个点。pack 的 n 只数点号那一部分，所以是 2。

```lua run expect="2" title="剩下 2 个"
local function rest(sku, ...)
  local packed = table.pack(...)
  return packed.n
end
print(rest("tea", "cup", "mug"))
```

### 空调用的个数是 0

一个参数都不传时，pack.n 是 0。打印这个 0，确认三个点在空调用下也是一张空表。

```lua run expect="0" title="空是 0"
local function count(...)
  return table.pack(...).n
end
print(count())
```
