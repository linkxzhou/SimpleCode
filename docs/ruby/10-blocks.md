---
language: ruby
chapter: 10
title: "Ruby 块"
level: beginner
minutes: 8
goals:
  - "把块传给方法"
  - "用 yield 调用块"
  - "区分花括号和 do end"
sources:
  - lxiy-ruby
updated: "2026-10-15"
---

块是一段交给方法的代码。`yield` 在方法里执行它。

### 传给 each

参数写在竖线里。

```ruby run expect="tea" title="最后一项"
last = ""
["water", "tea"].each { |name| last = name }
puts last
```

输出里能看到 `tea`。

### 自己 yield

方法里 `yield` 一次，块就执行一次。

```ruby run expect="inward" title="调用块"
def once
  yield
end
once { puts "inward" }
```

输出里能看到 `inward`。

### do end 适合多行

多行块用 `do` 和 `end`。结果和花括号相同。

```ruby run expect="6" title="求和"
sum = 0
[1, 2, 3].each do |n|
  sum += n
end
puts sum
```

输出里能看到 `6`。
