---
language: ruby
chapter: 5
title: "Ruby 运算符"
level: beginner
minutes: 8
goals:
  - "使用整除和余数"
  - "使用比较运算"
  - "用 && 和 || 组合条件"
sources:
  - lxiy-ruby
updated: "2026-10-15"
---

整数的 `/` 丢掉余数。比较得到 `true` 或 `false`。

### 商和余数

`/` 是商，`%` 是余数。

```ruby run expect="2 1" title="二十一除以十"
puts "#{21 / 10} #{21 % 10}"
```

输出里能看到 `2 1`。

### 比较

`==` 看值是否相等。

```ruby run expect="true" title="大于"
puts 3 > 1
```

输出里能看到 `true`。

### 逻辑

`&&` 两边都真才真。

```ruby run expect="false" title="与"
puts true && false
```

输出里能看到 `false`。
