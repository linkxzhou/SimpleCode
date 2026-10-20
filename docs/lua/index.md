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

```lua run expect="Hi" title="打招呼"
print("Hi")
```

输出里能看到 `Hi`。

### 多项之间有制表符

两个参数不会粘成一个词。

```lua run expect="tea\t18" title="中间是制表符"
print("tea", 18)
```

输出里能看到 `tea	18`。

### 拼接

`..` 先接成一个字符串，再交给 `print`。

```lua run expect="tea18" title="接在一起"
print("tea" .. 18)
```

输出里能看到 `tea18`。

### 第 22 章以后

闭包记住外层的 3，table.pack 点数，__index 补上缺的 sku，_ENV 只留下放进去的名字，协程先交出 tea 再交出 cup，模式从 sku=tea 里取出 tea，table.concat 一次接完，三态机器从 idle 走到 done。os.execute 和别的文件的 require 仍然只供阅读。
