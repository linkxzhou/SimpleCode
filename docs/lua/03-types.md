---
language: lua
chapter: 3
title: "Lua 数据类型"
level: beginner
minutes: 8
goals:
  - "用 type 看数字和字符串"
  - "区分 nil 和 false"
  - "知道表也是一种类型"
sources:
  - lxiy-lua
updated: "2026-10-15"
---

常见的值有数字、字符串、布尔、nil 和表。

### 数字和字符串

`type` 对 18 给出 number，对文字给出 string。

```lua run expect="number" title="数字在前"
print(type(18))
print(type("茶"))
```

输出里能看到 `number`。

### 假和空

`false` 和 `nil` 都是假，但类型不同。

```lua run expect="boolean" title="先是布尔"
print(type(false))
print(type(nil))
```

输出里能看到 `boolean`。

### 表

花括号创建的值，类型是 table。

```lua run expect="table" title="一张表"
print(type({}))
```

输出里能看到 `table`。
