---
language: lua
chapter: 13
title: "Lua 模块与包"
level: beginner
minutes: 8
goals:
  - "知道这里不能 require 另一个文件"
  - "把函数写在同一个文件"
  - "调用这个函数核对结果"
sources:
  - lxiy-lua
updated: "2026-10-15"
---

`require` 会去找别的文件。这一本只有当前这一份脚本。

### require 不运行

没有名为 shop 的模块文件。

```lua norun title="没有模块"
local shop = require("shop")
print(shop.price)
```

### 同一文件

函数直接写在下面，9 乘 2 得到 18。

```lua run expect="18" title="同一文件"
local function price()
  return 18
end
print(price())
```

输出里能看到 `18`。

### 再包一层

表也可以装函数，不必分成两个文件。

```lua run expect="18" title="表里的函数"
local shop = {}
function shop.rate()
  return 2
end
print(shop.rate() * 9)
```

输出里能看到 `18`。
