---
language: ruby
chapter: 12
title: "Ruby 数组"
level: beginner
minutes: 8
goals:
  - "用下标读取"
  - "用 push 增加元素"
  - "用 map 得到新数组"
sources:
  - lxiy-ruby
updated: "2026-10-15"
---

数组下标从 0 开始。`map` 不改原来的数组。

### 下标

第二项的下标是 1。

```ruby run expect="tea" title="第二项"
puts ["water", "tea"][1]
```

输出里能看到 `tea`。

### push

`push` 改原数组。

```ruby run expect="2" title="追加"
nums = [1]
nums.push(2)
puts nums[1]
```

输出里能看到 `2`。

### map

`map` 返回新数组。`join` 把它打成一行。

```ruby run expect="2,4,6" title="加倍"
puts [1, 2, 3].map { |n| n * 2 }.join(",")
```

输出里能看到 `2,4,6`。
