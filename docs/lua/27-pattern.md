---
language: lua
chapter: 27
title: "Lua 模式"
level: intermediate
minutes: 8
goals:
  - "用捕获取出 sku"
  - "用 gsub 替换全部 tea"
  - "用 %d 取出数量"
sources:
  - lxiy-lua
updated: "2026-10-20"
---

Lua 的字符串模式不是完整的正则。%a 表示字母，%d 表示数字，捕获用圆括号。替换交给 string.gsub。

### 从 sku=tea 取出 tea

模式 sku=(%a+) 把等号后面的字母放进捕获。string.match 直接返回 tea。

```lua run expect="tea" title="捕获 tea"
local line = "sku=tea;qty=4"
print(string.match(line, "sku=(%a+)"))
```

### 两处 tea 都换成 mug

gsub 默认替换每一次匹配。tea tea 变成 mug mug，中间的空格还在。

```lua run expect="mug mug" title="换成 mug"
local text = string.gsub("tea tea", "tea", "mug")
print(text)
```

### 数量捕获是 4

%d+ 吃掉连续的数字。行尾的 4 被捕获后打印出来，字母部分不会混进结果。

```lua run expect="4" title="数字 4"
local line = "sku=tea;qty=4"
print(string.match(line, "qty=(%d+)"))
```

### 不匹配时得到 nil

模式对不上时 match 返回 nil。tostring 把它打成 nil，这样冒烟仍有一行稳定的输出。

```lua run expect="nil" title="没有 sku"
local found = string.match("cup", "sku=(%a+)")
print(tostring(found))
```
