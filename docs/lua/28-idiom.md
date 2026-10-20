---
language: lua
chapter: 28
title: "Lua 拼接"
level: intermediate
minutes: 8
goals:
  - "用 table.concat 接三段"
  - "在循环里先放进表再拼接"
  - "用局部变量累加一个小数"
sources:
  - lxiy-lua
updated: "2026-10-20"
---

反复用两个点接字符串会不断做出新字符串。先把片段放进表，再 table.concat 一次，结果更直接。循环里的累加只用局部变量。

### 三段接成 tea-cup

表里按顺序放 tea 和 cup。concat 用连字符把它们接成一行 tea-cup。

```lua run expect="tea-cup" title="接成 tea-cup"
local parts = { "tea", "cup" }
print(table.concat(parts, "-"))
```

### 循环放进三个 a

循环三次，每次把 a 放进表。concat 再用连字符接成 a-a-a。

```lua run expect="a-a-a" title="三个 a"
local parts = {}
for i = 1, 3 do
  parts[i] = "a"
end
print(table.concat(parts, "-"))
```

### 1 加到 4 的和是 10

局部变量 n 从 0 开始，加上 1、2、3、4。打印 10。这里不用全局名字保存中间和。

```lua run expect="10" title="和是 10"
local n = 0
for i = 1, 4 do
  n = n + i
end
print(n)
```

### 计时函数只供阅读

os.clock 在这份页面上不稳定，不能拿来做期望里的秒数。阅读块只标出它的名字，不参与冒烟。

```lua norun title="不比较秒数"
print(os.clock())
```
