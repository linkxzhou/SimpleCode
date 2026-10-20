---
language: ruby
chapter: 23
title: "Ruby Proc"
level: intermediate
minutes: 8
goals:
  - "用 proc 把两数相加"
  - "用 lambda 检查参数个数"
  - "让 proc 记住外层的基数"
sources:
  - lxiy-ruby
updated: "2026-10-20"
---

Proc 和 lambda 都是可调用对象。lambda 对参数个数更严，少传一个就会抛 ArgumentError。这里把这个错误接住并打印 arity。

### proc 把 2 和 5 加成 7

proc 收下两个参数再相加。call(2, 5) 打印 7。少传参数时 proc 不会像 lambda 那样立刻拒绝。

```ruby run expect="7" title="加出 7"
add = proc { |a, b| a + b }
puts add.call(2, 5)
```

### lambda 少一个参数时打印 arity

lambda 要求两个参数。只传 2 会抛 ArgumentError。rescue 接住后打印 arity，程序仍以成功结束。

```ruby run expect="arity" title="参数个数不对"
add = lambda { |a, b| a + b }
begin
  add.call(2)
  puts "open"
rescue ArgumentError
  puts "arity"
end
```

### 外层基数 3 再加 4

proc 读到外层的 base。base 是 3 时，call(4) 打印 7。这个 proc 没有自己的默认参数。

```ruby run expect="7" title="3 加 4"
base = 3
add = proc { |n| base + n }
puts add.call(4)
```

### 两个 proc 相加的结果是 9

double 把 4 变成 8 并不在这节。这里 one 返回 4，two 返回 5，外层相加后打印 9。

```ruby run expect="9" title="4 加 5"
one = proc { 4 }
two = proc { 5 }
puts one.call + two.call
```
