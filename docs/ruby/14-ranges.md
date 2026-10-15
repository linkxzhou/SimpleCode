---
language: ruby
chapter: 14
title: "Ruby 范围"
level: beginner
minutes: 8
goals:
  - "写出含尾的范围"
  - "写出不含尾的范围"
  - "用范围询问是否包含"
sources:
  - lxiy-ruby
updated: "2026-10-15"
---

`..` 含右端，`...` 不含右端。

### 含尾

`1..3` 有三个数，和是 6。

```ruby run expect="6" title="一到三"
puts (1..3).sum
```

输出里能看到 `6`。

### 不含尾

`1...3` 只有 1 和 2。

```ruby run expect="1,2" title="不含 3"
puts (1...3).to_a.join(",")
```

输出里能看到 `1,2`。

### 包含

`cover?` 问这个值在不在范围内。

```ruby run expect="true" title="包含 2"
puts (1..3).cover?(2)
```

输出里能看到 `true`。
