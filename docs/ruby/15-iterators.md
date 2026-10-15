---
language: ruby
chapter: 15
title: "Ruby 迭代器"
level: beginner
minutes: 8
goals:
  - "用 each 遍历"
  - "用 select 过滤"
  - "用 reduce 累加"
sources:
  - lxiy-ruby
updated: "2026-10-15"
---

迭代器是带块的方法。数组上最常见的是 `each`、`select` 和 `reduce`。

### each

块对每个元素执行一次。

```ruby run expect="3" title="三个"
n = 0
[1, 2, 3].each { n += 1 }
puts n
```

输出里能看到 `3`。

### select

只留下块返回真的元素。

```ruby run expect="2,4" title="偶数"
puts [1, 2, 3, 4].select { |n| n.even? }.join(",")
```

输出里能看到 `2,4`。

### reduce

从初值开始，把每个元素累加进去。

```ruby run expect="6" title="求和"
puts [1, 2, 3].reduce(0) { |sum, n| sum + n }
```

输出里能看到 `6`。
