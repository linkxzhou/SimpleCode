---
language: lua
chapter: 8
title: "Lua 运算符"
level: beginner
minutes: 8
goals:
  - "区分 / 和 //"
  - "用余数"
  - "用 .. 拼接"
sources:
  - lxiy-lua
updated: "2026-10-15"
---

`/` 得到小数，`//` 得到整数商。

### 两种除法

7 除以 2，小数商是 3.5，整数商是 3。

```lua run expect="3.5" title="先是小数"
print(7 / 2)
print(7 // 2)
```

输出里能看到 `3.5`。

### 余数

7 除以 2 的余数是 1。

```lua run expect="1" title="余数"
print(7 % 2)
```

输出里能看到 `1`。

### 拼接和比较

相等时把 yes 打出来。

```lua run expect="yes" title="相等"
local price = 18
if price == 18 then
  print("yes")
else
  print("no")
end
```

输出里能看到 `yes`。
