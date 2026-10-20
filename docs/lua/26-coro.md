---
language: lua
chapter: 26
title: "Lua 协程"
level: intermediate
minutes: 8
goals:
  - "用 yield 交出两个字符串"
  - "把两个交出的值拼起来"
  - "看 resume 在结束之后的结果"
sources:
  - lxiy-lua
updated: "2026-10-20"
---

协程把函数暂停在 yield。主控这边用 resume 一次取回一个值。这里没有网络，也没有真正的线程。

### 先交出 tea 再交出 cup

协程第一次交出 tea，第二次交出 cup。两边用两个点接成 teacup，一次打印出来。

```lua run expect="teacup" title="接成 teacup"
local co = coroutine.create(function()
  coroutine.yield("tea")
  coroutine.yield("cup")
end)
local _, a = coroutine.resume(co)
local _, b = coroutine.resume(co)
print(a .. b)
```

### 第一次取出的是 4

生产者先交出 4。主控只 resume 一次，所以打印 4，后面的 9 还停在协程里。

```lua run expect="4" title="先拿到 4"
local co = coroutine.create(function()
  coroutine.yield(4)
  coroutine.yield(9)
end)
local _, n = coroutine.resume(co)
print(n)
```

### 结束后 resume 得到 false

协程函数返回之后再 resume，第一个结果是 false。这里只打印这个布尔值，不再取后面的消息。

```lua run expect="false" title="已经结束"
local co = coroutine.create(function()
  return "done"
end)
coroutine.resume(co)
local ok = coroutine.resume(co)
print(ok)
```

### 两个数字相加是 6

第一次交出 1，第二次交出 5。主控把它们相加，打印 6。协程在这里只负责按顺序供数。

```lua run expect="6" title="加出 6"
local co = coroutine.create(function()
  coroutine.yield(1)
  coroutine.yield(5)
end)
local _, a = coroutine.resume(co)
local _, b = coroutine.resume(co)
print(a + b)
```
