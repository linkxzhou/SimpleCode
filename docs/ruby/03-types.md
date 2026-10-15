---
language: ruby
chapter: 3
title: "Ruby 数据类型"
level: beginner
minutes: 8
goals:
  - "区分整数、小数、字符串和布尔"
  - "用 class 查看类型"
  - "知道 nil 是空"
sources:
  - lxiy-ruby
updated: "2026-10-15"
---

常见的值有整数、小数、字符串、布尔和 `nil`。

### 整数和字符串

整数相除仍是整数。字符串要加引号。

```ruby run expect="3" title="整除"
puts 20 / 6
```

输出里能看到 `3`。

### 类型名

`.class` 给出这个值的类。

```ruby run expect="Integer" title="整数类"
puts 3.class
```

输出里能看到 `Integer`。

### nil 和 false

只有 `nil` 和 `false` 在条件里为假。`0` 是真。

```ruby run expect="真" title="零也是真"
puts 0 ? "真" : "假"
```

输出里能看到 `真`。
