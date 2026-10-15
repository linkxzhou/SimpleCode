---
language: lua
chapter: 0
title: "Lua 教程"
minutes: 8
goals:
  - "用 print 打出一行"
  - "知道多项之间是制表符"
  - "用 .. 把两段接成一段"
sources:
  - lxiy-lua
updated: "2026-10-15"
---

这一本用 Lua 5.4 执行单个文件。`print` 的多项之间是制表符，想紧挨着就用 `..`。

### 第一行

`print` 会在末尾换行。

```lua run expect="你好" title="打招呼"
print("你好")
```

输出里能看到 `你好`。

### 多项之间有制表符

两个参数不会粘成一个词。

```lua run expect="茶	18" title="中间是制表符"
print("茶", 18)
```

输出里能看到 `茶	18`。

### 拼接

`..` 先接成一个字符串，再交给 `print`。

```lua run expect="茶18" title="接在一起"
print("茶" .. 18)
```

输出里能看到 `茶18`。
