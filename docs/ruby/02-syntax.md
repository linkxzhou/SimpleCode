---
language: ruby
chapter: 2
title: "Ruby 语法"
level: beginner
minutes: 8
goals:
  - "用 end 结束一块"
  - "知道换行通常就是语句结束"
  - "用 def 定义方法"
sources:
  - lxiy-ruby
updated: "2026-10-15"
---

Ruby 用 `end` 结束方法、条件和循环，不靠花括号强制分层。

### 方法

`def` 和 `end` 之间是方法体。

```ruby run expect="5" title="相加"
def add(a, b)
  a + b
end
puts add(2, 3)
```

输出里能看到 `5`。

### 最后一行表达式

方法里最后一个表达式就是返回值，不必写 `return`。

```ruby run expect="8" title="隐式返回"
def twice(n)
  n * 2
end
puts twice(4)
```

输出里能看到 `8`。

### 分号可以但不必

一行写一句更清楚。下面两句各占一行。

```ruby run expect="甲" title="第一行"
puts "甲"
puts "乙"
```

输出里能看到 `甲`。
