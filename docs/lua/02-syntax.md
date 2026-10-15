---
language: lua
chapter: 2
title: "Lua 基本语法"
level: beginner
minutes: 8
goals:
  - "知道语句可以不写分号"
  - "用 -- 写注释"
  - "用 do 包住一块"
sources:
  - lxiy-lua
updated: "2026-10-15"
---

Lua 用换行分开语句。分号可以写，但不是必须的。

### 两行

两条 `print` 各占一行。

```lua run expect="甲" title="第一行"
print("甲")
print("乙")
```

输出里能看到 `甲`。

### 注释

双减号后面的输出不会执行。

```lua run expect="留下" title="跳过注释"
-- print("隐藏")
print("留下")
```

输出里能看到 `留下`。

### 块

`do` 和 `end` 包住一块，块里的局部名字到 `end` 结束。

```lua run expect="3" title="加上 2"
local n = 1
do
  local extra = 2
  n = n + extra
end
print(n)
```

输出里能看到 `3`。
