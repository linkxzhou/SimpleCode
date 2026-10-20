---
language: ruby
chapter: 24
title: "Ruby Enumerable"
level: intermediate
minutes: 8
goals:
  - "用 select 留下大于 2 的数"
  - "用 map 把每项乘 2 再求和"
  - "用 tally 数 tea 出现的次数"
sources:
  - lxiy-ruby
updated: "2026-10-20"
---

数组混入了 Enumerable。select、map、sum 和 tally 都在这张表上。例子只用整数和短字符串，避免依赖顺序不稳定的遍历。

### 大于 2 的和是 13

select 留下 4 和 9。1 和 2 被丢掉。剩下两项求和是 13。

```ruby run expect="13" title="留下再求和"
puts [1, 4, 2, 9].select { |n| n > 2 }.sum
```

### 每项乘 2 的和是 12

map 把 1、2、3 变成 2、4、6。sum 得到 12。块参数 n 只在这一次 map 里使用。

```ruby run expect="12" title="乘二再加"
puts [1, 2, 3].map { |n| n * 2 }.sum
```

### tea 出现了 2 次

tally 统计每个字符串的次数。tea 有两次，cup 有一次。这里只打印 tea 的次数。

```ruby run expect="2" title="tea 两次"
counts = ["tea", "tea", "cup"].tally
puts counts["tea"]
```

### reject 丢掉 1 之后还剩 6

reject 去掉等于 1 的项。剩下 2 和 4，求和是 6。

```ruby run expect="6" title="去掉 1"
puts [1, 2, 4].reject { |n| n == 1 }.sum
```
