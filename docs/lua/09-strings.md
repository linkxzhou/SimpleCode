---
language: lua
chapter: 9
title: "Lua 字符串"
level: beginner
minutes: 8
goals:
  - "用 # 看字节数"
  - "用 string.sub 截取"
  - "用 string.format 排版"
sources:
  - lxiy-lua
updated: "2026-10-15"
---

`#` 和 `string.len` 都按字节计数。`Hello!` 的长度是 6。

### 字节长度

`Hello!` 有 6 个字节。

```lua run expect="6" title="六个字节"
print(#"Hello!")
```

输出里能看到 `6`。

### 截取

下标从 1 开始。`buy pen` 从第 5 个字节起是 pen。

```lua run expect="pen" title="后半段"
print(string.sub("buy pen", 5))
```

输出里能看到 `pen`。

### 格式化

`string.format` 把整数填进 `%d`。

```lua run expect="price 18" title="填进格式"
print(string.format("price %d", 18))
```

输出里能看到 `price 18`。
