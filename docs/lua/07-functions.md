---
language: lua
chapter: 7
title: "Lua 函数"
level: beginner
minutes: 8
goals:
  - "写出带返回值的函数"
  - "一次返回两个值"
  - "把函数存进局部变量"
sources:
  - lxiy-lua
updated: "2026-10-15"
---

函数是值。可以写名字，也可以放进变量。

### 返回值

`add` 把两个参数加起来交回去。

```lua run expect="18" title="相加"
local function add(a, b)
  return a + b
end
print(add(11, 7))
```

输出里能看到 `18`。

### 多个返回值

调用处用两个变量接住商和余数。

```lua run expect="3 1" title="商和余数"
local function split(n)
  return n // 2, n % 2
end
local q, r = split(7)
print(q .. " " .. r)
```

输出里能看到 `3 1`。

### 匿名函数

函数可以先做出来，再赋给名字。

```lua run expect="18" title="乘二"
local twice = function(n)
  return n * 2
end
print(twice(9))
```

输出里能看到 `18`。
