---
language: ruby
chapter: 20
title: "Ruby 日期和时间"
level: beginner
minutes: 8
goals:
  - "构造一个日期"
  - "格式化成年月日"
  - "比较两个时间的先后"
sources:
  - lxiy-ruby
updated: "2026-10-15"
---

`Time` 表示一个时刻。课程里用固定的日期，不读取本机的当前时区差异。

### 构造

`Time.new` 按年、月、日构造。

```ruby run expect="2026" title="年份"
t = Time.new(2026, 10, 15)
puts t.year
```

输出里能看到 `2026`。

### 格式化

`strftime` 按格式写出文本。

```ruby run expect="2026-10-15" title="日期文本"
t = Time.new(2026, 10, 15)
puts t.strftime("%Y-%m-%d")
```

输出里能看到 `2026-10-15`。

### 先后

较早的时间小于较晚的时间。

```ruby run expect="true" title="十月一日更早"
a = Time.new(2026, 10, 1)
b = Time.new(2026, 10, 15)
puts a < b
```

输出里能看到 `true`。
