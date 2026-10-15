---
language: lua
chapter: 5
title: "Lua 循环"
level: beginner
minutes: 8
goals:
  - "用数字 for 累加"
  - "用 while 倒数"
  - "用 break 提前停下"
sources:
  - lxiy-lua
updated: "2026-10-15"
---

数字 `for` 含两端。`while` 先看条件。

### for

1 到 3 的和是 6。

```lua run expect="6" title="求和"
local sum = 0
for i = 1, 3 do
  sum = sum + i
end
print(sum)
```

输出里能看到 `6`。

### while

从 3 减到 1，累加结果同样是 6。

```lua run expect="6" title="倒数累加"
local n = 3
local sum = 0
while n > 0 do
  sum = sum + n
  n = n - 1
end
print(sum)
```

输出里能看到 `6`。

### break

遇到 3 就停，所以只打出 1。

```lua run expect="1" title="第一圈"
for i = 1, 5 do
  if i == 3 then break end
  print(i)
end
```

输出里能看到 `1`。
