---
language: lua
chapter: 4
title: "Lua 变量"
level: beginner
minutes: 8
goals:
  - "用 local 限制名字的范围"
  - "给同一个名字换值"
  - "知道未写 local 的名字是全局的"
sources:
  - lxiy-lua
updated: "2026-10-15"
---

课程里的名字尽量加 `local`，避免留在全局表里。

### 局部变量

`local` 把 18 放进 `price`。

```lua run expect="18" title="单价"
local price = 18
print(price)
```

输出里能看到 `18`。

### 再改一次

同一个局部名字可以换成新的数。

```lua run expect="4" title="改成 4"
local n = 1
n = 4
print(n)
```

输出里能看到 `4`。

### 全局名字

不加 `local` 时，赋值进全局表，仍能读回来。

```lua run expect="pen" title="全局"
item = "pen"
print(item)
```

输出里能看到 `pen`。
