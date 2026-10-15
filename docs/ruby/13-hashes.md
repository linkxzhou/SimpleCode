---
language: ruby
chapter: 13
title: "Ruby 哈希"
level: beginner
minutes: 8
goals:
  - "用键读取值"
  - "给缺键一个默认"
  - "遍历键值"
sources:
  - lxiy-ruby
updated: "2026-10-15"
---

哈希按键找值。新写法用 `key: value`。

### 读取

方括号里写键。

```ruby run expect="18" title="单价"
price = { "茶" => 18 }
puts price["茶"]
```

输出里能看到 `18`。

### fetch 的默认

键不存在时，`fetch` 可以返回你给的默认值。

```ruby run expect="0" title="缺键"
price = { "茶" => 18 }
puts price.fetch("水", 0)
```

输出里能看到 `0`。

### 符号键

冒号写法的键是符号。读取时也要用符号。

```ruby run expect="茶" title="符号"
item = { name: "茶" }
puts item[:name]
```

输出里能看到 `茶`。
