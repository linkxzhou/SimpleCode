---
language: lua
chapter: 22
title: "Lua 闭包"
level: intermediate
minutes: 8
goals:
  - "让返回的函数记住外层的数字"
  - "连续调用时让计数往上走"
  - "知道 os.execute 不能在这里跑"
sources:
  - lxiy-lua
updated: "2026-10-20"
---

返回的函数把外层局部变量带走。这里用加法、计数和乘法各看一次，不调用操作系统。

### 外层的 3 加上 4

adder 收下基数 3。返回的函数再接收 4，两次相加打印 7。基数留在外层，没有变成全局变量。

```lua run expect="7" title="外层记住 3"
local function adder(base)
  return function(step)
    return base + step
  end
end
local add3 = adder(3)
print(add3(4))
```

### 第二次调用打印 2

计数器内部从 0 起跳。第一次调用只把 n 改成 1，不打印。第二次调用才输出 2。

```lua run expect="2" title="数到 2"
local function counter()
  local n = 0
  return function()
    n = n + 1
    return n
  end
end
local nextn = counter()
nextn()
print(nextn())
```

### 乘数 5 作用在 2 上

scale 记住乘数 5，返回的函数立刻吃进 2。乘积 10 说明 upvalue 在调用时仍然活着。

```lua run expect="10" title="乘出 10"
local function scale(k)
  return function(n)
    return n * k
  end
end
print(scale(5)(2))
```

### 外部命令留在阅读里

这份解释器没有接上操作系统。os.execute 放在不运行的块里，避免冒烟去等一个不存在的进程。

```lua norun title="没有进程"
os.execute("echo tea")
```
