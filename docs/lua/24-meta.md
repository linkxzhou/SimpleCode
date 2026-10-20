---
language: lua
chapter: 24
title: "Lua 元方法"
level: intermediate
minutes: 8
goals:
  - "用 __index 补上缺少的字段"
  - "用 __add 把两张表相加"
  - "用 __tostring 决定打印文本"
sources:
  - lxiy-lua
updated: "2026-10-20"
---

元表决定一张表在缺字段、相加和被打印时怎么做。下面三张小表各自只装一个元方法。

### 缺少的 sku 读成 tea

原表是空的。读取 sku 时 __index 返回 tea。别的键没有写在这个函数里，这里只读 sku。

```lua run expect="tea" title="补上 tea"
local mt = {
  __index = function(_, key)
    if key == "sku" then return "tea" end
  end
}
local row = setmetatable({}, mt)
print(row.sku)
```

### 2 和 5 相加得 7

__add 收到左右两张表，把它们的 n 相加。运算符本身不会去加表的地址。

```lua run expect="7" title="加出 7"
local mt = {
  __add = function(a, b)
    return a.n + b.n
  end
}
local function box(n)
  return setmetatable({ n = n }, mt)
end
print(box(2) + box(5))
```

### 打印时走 __tostring

print 碰到这张表时会问 __tostring。函数返回 cup，所以输出是 cup 而不是一串地址。

```lua run expect="cup" title="印出 cup"
local mt = {
  __tostring = function()
    return "cup"
  end
}
print(setmetatable({}, mt))
```

### 没有元方法时不能对表相加

两张普通表用加号会在运行时失败。那个失败例子不放进冒烟，避免整章被一次算术错误打断。

```lua norun title="普通表不能加"
local a = { n = 1 }
local b = { n = 2 }
print(a + b)
```
