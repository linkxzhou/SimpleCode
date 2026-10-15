---
language: lua
chapter: 15
title: "Lua 协同程序"
level: beginner
minutes: 8
goals:
  - "用 yield 交出一个值"
  - "用 resume 取回"
  - "再 resume 一次拿到返回值"
sources:
  - lxiy-lua
updated: "2026-10-15"
---

协同程序把函数暂停在 `yield`。恢复之后从那里继续。

### 第一次恢复

`resume` 的第二个结果是 `yield` 交出来的 2。

```lua run expect="2" title="先交出 2"
local co = coroutine.create(function()
  coroutine.yield(2)
  return 8
end)
local _, v = coroutine.resume(co)
print(v)
```

输出里能看到 `2`。

### 第二次恢复

再次 `resume` 得到函数的返回值 8。

```lua run expect="8" title="然后是 8"
local co = coroutine.create(function()
  coroutine.yield(2)
  return 8
end)
coroutine.resume(co)
local _, v = coroutine.resume(co)
print(v)
```

输出里能看到 `8`。

### 状态

还没运行完时，状态是 suspended。

```lua run expect="suspended" title="还停着"
local co = coroutine.create(function()
  coroutine.yield(1)
end)
coroutine.resume(co)
print(coroutine.status(co))
```

输出里能看到 `suspended`。
